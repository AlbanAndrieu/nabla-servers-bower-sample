# syntax=docker/dockerfile:1.7

# This Dockerfile is used to build an image containing basic stuff to be used as a Jenkins slave build node.
# hadolint ignore=DL3007
FROM selenium/standalone-chrome:126.0-20240621 as selenium

LABEL name="nabla-servers-bower-sample" vendor="TEST" version="2.2.0"
# dockerfile_lint - ignore
LABEL description="Image used by fusion-risk products to build Java/Javascript and CPP\
 this image is running on Ubuntu 22.04."

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

ARG JENKINS_USER_HOME=${JENKINS_USER_HOME:-/home/jenkins}
#ENV http_proxy=${http_proxy:-"http://127.0.0.1:3128"}
#ENV https_proxy=${https_proxy:-"${http_proxy}"}
ENV no_proxy=${no_proxy:-"localhost,127.0.0.1,.albandrieu.com,.azure.io,albandri,albandrieu"}

ENV JAVA_HOME=${JAVA_HOME:-"/usr/lib/jvm/java-11-openjdk-amd64"}

# No interactive frontend during docker build
ENV DEBIAN_FRONTEND=noninteractive \
    DEBCONF_NONINTERACTIVE_SEEN=true

#Below HOME is needed to override seluser (selenium user)
ENV HOME=${JENKINS_USER_HOME}

ENV CHROME_BIN=/usr/bin/google-chrome
#ENV CHROMIUM_BIN=/usr/bin/chromium-browser # chromium-browser: command not found

USER 0

ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8
ENV TERM="xterm-256color"
ENV TZ="Europe/Paris"

#===================
# Timezone settings
# Possible alternative: https://github.com/docker/docker/issues/3359#issuecomment-32150214
#===================
RUN ln -sf /usr/share/zoneinfo/$TZ /etc/localtime && \
    printf '%s' "$TZ" > /etc/timezone

#RUN echo "Acquire::http::Proxy \"${http_proxy}\";" > /etc/apt/apt.conf.d/proxy.conf

RUN rm -f /etc/apt/apt.conf.d/docker-clean; echo 'Binary::apt::APT::Keep-Downloaded-Packages "true";' > /etc/apt/apt.conf.d/keep-cache
# hadolint ignore=DL3008
RUN apt-get -q update &&\
    apt-get -q --no-install-recommends install -y \
    -o Dpkg::Options::="--force-confnew" -o APT::Install-Recommend=false -o APT::Install-Suggests=false \
    git bzip2 zip unzip python3-yaml python3-jinja2 rsyslog \
    apt-transport-https ca-certificates software-properties-common \
    locales xz-utils ksh tzdata sudo curl wget lsof sshpass gpg-agent \
    python3-setuptools python3 python3-pip python3-dev python3-apt \
    openjdk-11-jdk maven \
    net-tools iputils-ping x11-apps \
    ruby-full build-essential rubygems \
    libgtk-3-0 libgtk-3-dev libxss1

#    openjdk-8-dbg openjdk-11-dbg openjdk-21-jdk maven \

# Remove unnecessary getty and udev targets that result in high CPU usage when using
# multiple containers with Molecule (https://github.com/ansible/molecule/issues/1104)
RUN rm -f /lib/systemd/system/systemd*udev* \
  && rm -f /lib/systemd/system/getty.target

# Fix potential UTF-8 errors with ansible-test.
RUN dpkg-reconfigure --frontend noninteractive tzdata && date && locale-gen en_US.UTF-8

### PYTHON 3

RUN python3 -m pip install --no-cache-dir --upgrade pip==20.3.4 \
    && pip3 install --no-cache-dir ansible==2.10.3 zabbix-api==0.5.4 docker-compose==1.25.5 distro==1.5.0

# Install Ansible inventory file.
RUN mkdir -p /etc/ansible
RUN printf "[local]\nlocalhost ansible_connection=local" > /etc/ansible/hosts

### DOCKER

# dockerfile_lint - ignore
ENV DOCKER_VERSION=${DOCKER_VERSION:-"20.10.21~3-0"}

# hadolint ignore=DL3006,DL4006
RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
RUN add-apt-repository \
    "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) \
    stable"
# Install Docker from Docker Inc. repositories.
RUN apt-get update -qq && apt-get --no-install-recommends install -qqy \
  docker-ce=5:"${DOCKER_VERSION}~ubuntu-$(lsb_release -cs)" \
  docker-ce-cli=5:"${DOCKER_VERSION}~ubuntu-$(lsb_release -cs)" \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

### JAVASCRIPT

# hadolint ignore=DL3008,DL3015
RUN wget -x --no-check-certificate -q -O - https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get update && apt-get install --no-install-recommends -y nodejs=18* && apt-get clean && rm -rf /var/lib/apt/lists/* && \
    npm set progress=false && \
    npm config set depth 0;
#NOK npm@7.11.2 with imagemin
# OK npm@8.11.0
RUN npm install -g npm@6.14.16 && apt-get purge -y npm # && ln -s /usr/local/bin/npm /usr/bin/npm
RUN npm -v && command -v npm # 6.14.16
RUN npm install -g bower@1.8.13 grunt@1.4.1 grunt-cli@1.4.3 webdriver-manager@12.1.9 yarn@1.22.19 yo@latest shrinkwrap@0.4.0 json2csv@4.3.3 phantomas@1.20.1 dockerfile_lint@0.3.3 newman@5.2.2 newman-reporter-htmlextra@1.19.7 xunit-viewer@5.1.11 phantomas@1.20.1 dockerfile_lint@0.3.3 bower-nexus3-resolver@1.0.2

### USER

ARG USER=${USER:-jenkins}
ARG GROUP=${GROUP:-docker}
ARG UID=${UID:-2000}
ARG GID=${GID:-2000}
# hadolint ignore=SC2059
RUN printf "\033[1;32mFROM UID:GID: ${UID}:${GID}- JENKINS_USER_HOME: ${JENKINS_USER_HOME} \033[0m\n" && \
    printf "\033[1;32mWITH user: $USER\ngroup: $GROUP \033[0m\n"

RUN groupmod -g ${GID} docker

# Add user jenkins to the image
RUN adduser --quiet --uid ${UID} --gid ${GID} --home ${JENKINS_USER_HOME} jenkins && \
    echo 'ALL ALL = (ALL) NOPASSWD: ALL' >> /etc/sudoers
# Set password for the jenkins user (you may want to alter this).
RUN echo "jenkins:jenkins1234" | chpasswd
RUN usermod -a -G docker jenkins

RUN ifconfig | awk '/inet addr/{print substr($2,6)}' ## Display IP address (optional)

### HELM

ENV HELM_VERSION=${HELM_VERSION:-"v3.5.4"}
ENV HELM_FILENAME=helm-${HELM_VERSION}-linux-amd64.tar.gz
ENV HELM_URL=https://get.helm.sh/${HELM_FILENAME}

# Kubernetes tools
# hadolint ignore=DL3020
ADD ${HELM_URL} /tmp/${HELM_FILENAME}
RUN tar -zxvf /tmp/${HELM_FILENAME} -C /tmp \
  && chmod +x /tmp/linux-amd64/helm \
  && mv /tmp/linux-amd64/helm /bin/helm \
  && rm -rf /tmp/*

ENV KUBECTL_VERSION=${KUBECTL_VERSION:-"v1.18.3"}
ENV KUBECTL_URL=https://storage.googleapis.com/kubernetes-release/release/${KUBECTL_VERSION}/bin/linux/amd64/kubectl

# hadolint ignore=DL3020
ADD ${KUBECTL_URL} /tmp/kubectl
RUN chmod +x /tmp/kubectl \
  && mv /tmp/kubectl /bin/kubectl \
  && rm -rf /tmp/*

# COMPASS
# need rubygems
#RUN gem install sass creates=/usr/local/bin/sass && gem install compass creates=/usr/local/bin/compass
RUN gem install ffi -v 1.17.0
RUN gem install sass && gem install compass && gem cleanup all
RUN sass -v & compass -v

# Working dir
WORKDIR $JENKINS_USER_HOME

# Clean up APT when done.
#RUN AUTO_ADDED_PACKAGES=$(apt-mark showauto) \
#&& apt-get remove --purge -y $BUILD_PACKAGES $AUTO_ADDED_PACKAGES &&
RUN apt-get autoremove -y && apt-get clean && rm -rf /var/lib/apt/lists/* /usr/share/doc /usr/share/man /tmp/* /var/tmp/* \
&& ifconfig | awk '/inet addr/{print substr($2,6)}' ## Display IP address (optional)

# Execute
RUN printf '{ "allow_root": true }' > /root/.bowerrc

# Cleaning
#RUN ./clean.sh
RUN rm -Rf npm/ .node_cache/ .node_tmp/ .tmp/ .bower/ bower_components/ node/ node_modules/ .sass-cache/ .scannerwork/ .repository/ target/ target-eclipse/ build/ phantomas/ dist/ docs/groovydocs/ docs/js/ docs/partials/ site/ coverage/

RUN chown -R "jenkins:docker" $JENKINS_USER_HOME/.* && chmod 777 ${HOME}

ENV WEBDRIVER_CHROME_VERSION=${WEBDRIVER_CHROME_VERSION:-"101.0.4951.64"}
RUN webdriver-manager update --versions.chrome ${WEBDRIVER_CHROME_VERSION}

# drop back to the regular jenkins user - good practice
USER jenkins

#ENV HOME=${JENKINS_USER_HOME}
# hadolint ignore=SC2015
RUN mkdir ${HOME}/workspace && mkdir ${HOME}/.sonar && mkdir -p ${HOME}/.m2/repository && mkdir -p ${HOME}/.config/configstore || true

RUN google-chrome --version
RUN ls -lrta /home/jenkins/.local/share/applications/mimeapps.list

#WARNING below give access to all servers
# hadolint ignore=SC2015
RUN chmod 700 ${HOME}/.ssh && chmod 600 ${HOME}/.ssh/id_rsa* && chmod 644 ${HOME}/.ssh/authorized_keys ${HOME}/.ssh/known_hosts || true

COPY --chown=jenkins:docker . $JENKINS_USER_HOME/

RUN ./mvnw -s settings.xml --batch-mode install -Dserver=jetty9x -DskipTests=true

#RUN ls -lrta -R $JENKINS_USER_HOME && ls -lrtan /home/jenkins/target/test.war

USER root

RUN rm -Rf /tmp/* /home/jenkins/.npm/ /home/jenkins/.git/ /home/jenkins/.node_cache || true
RUN chown "jenkins:docker" "$JENKINS_USER_HOME"
#RUN chmod g-w,o-w ${HOME} # Home directory on the server should not be writable by others

# drop back to the regular jenkins user - good practice
USER jenkins

EXPOSE 8080

# dockerfile_lint - ignore
FROM openjdk:11-jre-slim as RUNTIME

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

ARG JENKINS_USER_HOME=${JENKINS_USER_HOME:-/home/jenkins}

ARG USER=${USER:-jenkins}
ARG GROUP=${GROUP:-docker}
ARG UID=${UID:-2000}
ARG GID=${GID:-2000}
# hadolint ignore=SC2059
RUN printf "\033[1;32mFROM UID:GID: ${UID}:${GID}- JENKINS_USER_HOME: ${JENKINS_USER_HOME} \033[0m\n" && \
    printf "\033[1;32mWITH $USER\ngroup: $GROUP \033[0m\n"

# Add user jenkins to the image
RUN groupadd -g ${GID} docker && \
    adduser --quiet --uid ${UID} --gid ${GID} --home ${JENKINS_USER_HOME} jenkins && \
    echo 'ALL ALL = (ALL) NOPASSWD: ALL' >> /etc/sudoers
# Set password for the jenkins user (you may want to alter this).
RUN echo "jenkins:jenkins1234" | chpasswd
RUN usermod -a -G docker jenkins

USER jenkins

#RUN find / \( -uid 429679 \)  -ls 2>/dev/null || true

COPY --from=selenium /home/jenkins/target/test.war /home/jenkins/target/dependency/jetty-runner.jar /opt/
WORKDIR /opt/

VOLUME ["/sys/fs/cgroup", "/tmp", "/run"]

#java -jar target/dependency/jetty-runner.jar target/test.war

ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom", "-Djetty.base=/var/lib/jetty", "-jar", "/opt/jetty-runner.jar"]
#CMD ["/bin/bash"]
CMD ["/bin/bash", "-c", "find /opt/ -type f -name '*.war' | xargs java -jar /opt/jetty-runner.jar"]
EXPOSE 8080

#HEALTHCHECK NONE
HEALTHCHECK CMD curl --fail http://localhost:8080/ || exit 1
#HEALTHCHECK --interval=5m --timeout=3s CMD curl -f http://localhost:8080/actuator/health/ || exit 1
