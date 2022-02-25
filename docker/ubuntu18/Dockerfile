# syntax=docker/dockerfile:1.2.1

# This Dockerfile is used to build an image containing basic stuff to be used as a Jenkins slave build node.
# hadolint ignore=DL3007
#FROM ubuntu:18.04 as BUILD
FROM selenium/standalone-chrome:3.141.59-20201117 as BUILD

# dockerfile_lint - ignore
LABEL name="nabla-servers-bower-sample" vendor="TEST" version="1.0.0"
LABEL description="Image used by fusion-risk products to build Java/Javascript and CPP\
 this image is running on Ubuntu 18.04."

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

ARG JENKINS_USER_HOME=${JENKINS_USER_HOME:-/home/jenkins}
#ENV http_proxy=${http_proxy:-"http://127.0.0.1:3128"}
#ENV https_proxy=${https_proxy:-"${http_proxy}"}
ENV no_proxy=${no_proxy:-"localhost,127.0.0.1,.albandrieu.com,.azure.io,albandri,albandrieu"}

ENV JAVA_HOME=${JAVA_HOME:-"/usr/lib/jvm/java-1.8.0-openjdk-amd64"}

#ARG CERT_NAME=${CERT_NAME:-"NABLA.crt"}
#ARG CERT_URL=${CERT_URL:-"http://albandrieu.com/download/certs/"}

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
    apt-get -q install --no-install-recommends -y -o Dpkg::Options::="--force-confnew" -o APT::Install-Recommend=false -o APT::Install-Suggests=false \
    git bzip2 zip unzip python-yaml python-jinja2 python-pip rsyslog \
    apt-transport-https ca-certificates software-properties-common \
    locales xz-utils ksh tzdata sudo curl wget lsof sshpass gpg-agent \
    python3-setuptools python3 python3-pip python3-dev python3-apt \
    openjdk-8-dbg openjdk-11-dbg maven \
    net-tools iputils-ping x11-apps \
    ruby-full build-essential rubygems \
    libgtk-3-0 libgtk-3-dev libxss1

# Remove unnecessary getty and udev targets that result in high CPU usage when using
# multiple containers with Molecule (https://github.com/ansible/molecule/issues/1104)
RUN rm -f /lib/systemd/system/systemd*udev* \
  && rm -f /lib/systemd/system/getty.target

# Fix potential UTF-8 errors with ansible-test.
RUN dpkg-reconfigure --frontend noninteractive tzdata && date && locale-gen en_US.UTF-8

### PYTHON 3

RUN python3 -m pip install --no-cache-dir --upgrade pip==20.2.3 \
    && pip install --no-cache-dir ansible==2.9.1 zabbix-api==0.5.3 docker-compose==1.25.5 distro==1.5.0

# Install Ansible inventory file.
RUN mkdir -p /etc/ansible
RUN printf "[local]\nlocalhost ansible_connection=local" > /etc/ansible/hosts

### DOCKER

RUN wget --no-check-certificate -q -O - https://download.docker.com/linux/ubuntu/gpg | apt-key add - \
    && apt-key fingerprint 0EBFCD88 \
    && add-apt-repository \
    "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) \
    stable"
# Install Docker from Docker Inc. repositories.
RUN apt-get update -qq && apt-get install --no-install-recommends -qqy docker-ce=5:19.03.4~3-0~ubuntu-bionic && apt-get clean && rm -rf /var/lib/apt/lists/*

### JAVASCRIPT

# hadolint ignore=DL3008,DL3015
# See issue https://askubuntu.com/questions/1036278/npm-is-incorrect-version-on-latest-ubuntu-18-04-installation
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash - && \
    apt-get update && apt-get install --no-install-recommends -y nodejs=12* && apt-get clean && rm -rf /var/lib/apt/lists/* && \
    npm set progress=false && \
    npm config set depth 0;
#NOK npm@7.11.2 with imagemin
RUN npm install -g npm@6.14.16 && apt-get purge -y npm
RUN npm -v && command -v npm # 6.14.16
RUN npm install -g bower@1.8.13 grunt@1.4.1 grunt-cli@1.4.3 webdriver-manager@12.1.7 yarn@1.19.1 yo@latest shrinkwrap@0.4.0 json2csv@4.3.3 phantomas@1.20.1 dockerfile_lint@0.3.3 newman@5.2.2 newman-reporter-htmlextra@1.19.7 xunit-viewer@5.1.11 bower-nexus3-resolver@1.0.2

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

# Add java & root certs
#ADD ${CERT_URL}/${CERT_NAME} /etc/pki/ca-trust/source/anchors/
#RUN update-ca-trust

#RUN ln -sf /etc/ssl/certs/java/cacerts ${JAVA_HOME}/jre/lib/security/cacerts

# Update Java certs
#RUN keytool -v -noprompt \
#    -keystore ${JAVA_HOME}/jre/lib/security/cacerts \
#    -importcert \
#    -trustcacerts \
#    -file /usr/local/share/ca-certificates/${CERT_NAME} \
#    -alias test \
#    -keypass changeit \
#    -storepass changeit

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

#RUN curl https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 | bash

ENV KUBECTL_VERSION=${KUBECTL_VERSION:-"v1.18.3"}
ENV KUBECTL_URL=https://storage.googleapis.com/kubernetes-release/release/${KUBECTL_VERSION}/bin/linux/amd64/kubectl

# hadolint ignore=DL3020
ADD ${KUBECTL_URL} /tmp/kubectl
RUN chmod +x /tmp/kubectl \
  && mv /tmp/kubectl /bin/kubectl \
  && rm -rf /tmp/*

# COMPASS
# need rubygems
RUN gem install sass && gem install compass && gem cleanup all

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

#RUN pwd && ls -lrta ./
#RUN ls -lrta .cache/pip && ls -lrta .config/configstore && ls -lrta .npm
# TODO : Here takes too long
#RUN chmod -R 777 ${HOME}

ENV WEBDRIVER_CHROME_VERSION=${WEBDRIVER_CHROME_VERSION:-"98.0.4758.102"}
RUN webdriver-manager update --versions.chrome ${WEBDRIVER_CHROME_VERSION}

# drop back to the regular jenkins user - good practice
USER jenkins

#ENV HOME=${JENKINS_USER_HOME}
# hadolint ignore=SC2015
RUN mkdir ${HOME}/workspace && mkdir ${HOME}/.sonar && mkdir -p ${HOME}/.m2/repository && mkdir -p ${HOME}/.config/configstore || true

#RUN ls -lrta /home/jenkins/
RUN google-chrome --version
RUN ls -lrta /home/jenkins/.local/share/applications/mimeapps.list
#RUN chromium-browser --version

#WARNING below give access to all servers
# hadolint ignore=SC2015
RUN chmod 700 ${HOME}/.ssh && chmod 600 ${HOME}/.ssh/id_rsa* && chmod 644 ${HOME}/.ssh/authorized_keys ${HOME}/.ssh/known_hosts || true

COPY --chown=jenkins:docker . $JENKINS_USER_HOME/
# TODO : Here takes too long
#COPY . $JENKINS_USER_HOME/

RUN ls -lrta ./
RUN ./mvnw -s settings.xml --batch-mode install -Dserver=jetty9x -DskipTests=true

#RUN ls -lrta -R $JENKINS_USER_HOME && ls -lrtan /home/jenkins/target/test.war

USER root

RUN rm -Rf /tmp/* /home/jenkins/.npm/ /home/jenkins/.git/ /home/jenkins/.node_cache || true
RUN chown "jenkins:docker" "$JENKINS_USER_HOME"
#RUN chown -R "jenkins:docker" "$JENKINS_USER_HOME" && chmod -R 777 "$JENKINS_USER_HOME"
#RUN chmod g-w,o-w ${HOME} # Home directory on the server should not be writable by others

RUN rm -f /var/lib/dpkg/available-old /var/lib/dpkg/status-old /var/cache/debconf/config.dat-old /var/cache/debconf/config.dat /var/cache/debconf/templates.dat-old /var/cache/debconf/templates.dat /var/log/lastlog /var/log/faillog

# drop back to the regular jenkins user - good practice
USER jenkins

EXPOSE 8080

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

COPY --from=BUILD /home/jenkins/target/test.war /home/jenkins/target/dependency/jetty-runner.jar /opt/
WORKDIR /opt/

VOLUME ["/sys/fs/cgroup", "/tmp", "/run"]

#java -jar target/dependency/jetty-runner.jar target/test.war

ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom", "-Djetty.base=/var/lib/jetty", "-jar", "/opt/jetty-runner.jar"]
#CMD ["/bin/bash"]
CMD ["/bin/bash", "-c", "find /opt/ -type f -name '*.war' | xargs java -jar /opt/jetty-runner.jar"]
EXPOSE 8080

#HEALTHCHECK NONE
HEALTHCHECK CMD curl --fail http://localhost:8080/ || exit 1

