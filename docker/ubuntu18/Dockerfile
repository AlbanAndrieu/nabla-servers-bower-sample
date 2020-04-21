# This Dockerfile is used to build an image containing basic stuff to be used as a Jenkins slave build node.
FROM selenium/standalone-chrome:3.141.59-yttrium as build

ARG JENKINS_USER_HOME=${JENKINS_USER_HOME:-/home/jenkins}

ARG JAVA_HOME=${JAVA_HOME:-"/usr/lib/jvm/java-1.8.0-openjdk-amd64"}
ENV JAVA_TOOL_OPTIONS="-Dfile.encoding=UTF-8"

ARG CERT_NAME=${CERT_NAME:-"UK1VSWCERT01-CA-5.crt"}
ARG CERT_URL=${CERT_URL:-"http://FR1CSLFRBM0060.misys.global.ad/download/certs/${CERT_NAME}"}

ARG MICROSCANNER_TOKEN=${MICROSCANNER_TOKEN:-"NzdhNTQ2ZGZmYmEz"}

LABEL Name="bower-fr-integration-test" Vendor="TEST" Version="1.0.0"
LABEL description="Image used by fusion-risk products to build Java/Javascript and CPP\
 this image is running on Ubuntu 16.04."

# No interactive frontend during docker build
ENV DEBIAN_FRONTEND=noninteractive \
    DEBCONF_NONINTERACTIVE_SEEN=true

ENV HOME=${JENKINS_USER_HOME}

USER 0

ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8
ENV TERM="xterm-256color"
ENV TZ=Europe/Paris

#===================
# Timezone settings
# Possible alternative: https://github.com/docker/docker/issues/3359#issuecomment-32150214
#===================
RUN ln -sf /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone

RUN apt-get -q update &&\
    apt-get -q install -y -o Dpkg::Options::="--force-confnew" -o APT::Install-Recommend=false -o APT::Install-Suggests=false \
    git bzip2 zip unzip python-yaml python-jinja2 python-pip rsyslog \
    apt-transport-https ca-certificates software-properties-common \
    locales xz-utils ksh tzdata sudo curl lsof sshpass \
    python3-setuptools python3 python3-pip python3-dev python3-apt \
    openjdk-8-jdk maven \
    net-tools iputils-ping x11-apps

# Fix potential UTF-8 errors with ansible-test.
RUN dpkg-reconfigure --frontend noninteractive tzdata && date && locale-gen en_US.UTF-8

RUN python3 -m pip install --upgrade pip==20.0.2 \
    && pip install ansible==2.9.1 zabbix-api==0.5.3 docker-compose==1.25.3

# Install Ansible inventory file.
RUN mkdir -p /etc/ansible
RUN echo "[local]\nlocalhost ansible_connection=local" > /etc/ansible/hosts

RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
RUN sudo apt-key fingerprint 0EBFCD88
RUN add-apt-repository \
    "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) \
    stable"
# Install Docker from Docker Inc. repositories.
RUN apt-get update -qq && apt-get install -qqy docker-ce=5:19.03.4~3-0~ubuntu-bionic && apt-get clean && rm -rf /var/lib/apt/lists/*

# hadolint ignore=DL3008,DL3015
# See issue https://askubuntu.com/questions/1036278/npm-is-incorrect-version-on-latest-ubuntu-18-04-installation
#RUN curl -sL https://deb.nodesource.com/setup_12.x | bash - && \
RUN apt-get update && apt-get install -y nodejs=8.10.0~dfsg-2ubuntu0.4 npm=3.5.2-0ubuntu4 && apt-get clean && rm -rf /var/lib/apt/lists/*
#     && \
#    npm set progress=false && \
#    npm config set depth 0;
#npm@6.14.4    
RUN npm install -g npm
RUN apt purge -y npm && ln -s /usr/local/bin/npm /usr/bin/npm
#hash -d npm
RUN npm -v && command -v npm
RUN npm install -g bower@1.8.8 grunt@1.0.4 grunt-cli@1.3.2 webdriver-manager@12.1.7 yarn@1.19.1 yo@3.1.1
RUN npm install -g nsp@3.2.1 shrinkwrap@0.4.0 newman@4.5.5 xunit-viewer@5.1.11
RUN npm install -g json2csv@4.3.3 phantomas@1.20.1

ARG USER=${USER:-jenkins}
ARG GROUP=${GROUP:-docker}
ARG UID=${UID:-2000}
ARG GID=${GID:-2000}
RUN printf "\033[1;32mFROM UID:GID: ${UID}:${GID}- JENKINS_USER_HOME: ${JENKINS_USER_HOME} \033[0m\n" && \
    printf "\033[1;32mWITH $USER\ngroup: $GROUP \033[0m\n"

RUN groupmod -g ${GID} docker

# Add user jenkins to the image
RUN adduser --quiet --uid ${UID} --gid ${GID} --home ${JENKINS_USER_HOME} jenkins && \
    echo 'ALL ALL = (ALL) NOPASSWD: ALL' >> /etc/sudoers
# Set password for the jenkins user (you may want to alter this).
RUN echo "jenkins:jenkins1234" | chpasswd
RUN usermod -a -G docker jenkins

# Add java & root certs
#ADD ${CERT_URL} /etc/pki/ca-trust/source/anchors/
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

# Working dir
WORKDIR $JENKINS_USER_HOME

# Clean up APT when done.
#RUN AUTO_ADDED_PACKAGES=$(apt-mark showauto) \
#&& apt-get remove --purge -y $BUILD_PACKAGES $AUTO_ADDED_PACKAGES &&
RUN apt-get autoremove -y && apt-get clean && rm -rf /var/lib/apt/lists/* /usr/share/doc /usr/share/man /tmp/* /var/tmp/* \
&& ifconfig | awk '/inet addr/{print substr($2,6)}' ## Display IP address (optional)

#COPY --chown=jenkins:$(id -gn jenkins) . $JENKINS_USER_HOME/
COPY . $JENKINS_USER_HOME/

# Execute
RUN echo '{ "allow_root": true }' > /root/.bowerrc
#RUN ./clean.sh

ADD https://get.aquasec.com/microscanner /
RUN chmod +x /microscanner

#ADD http://albandrieu.com/download/docker/config.json ${JENKINS_USER_HOME}/.docker/config.json
#RUN chown -R ${UID}:${GID} ${JENKINS_USER_HOME}/.docker

ENV HOME=${JENKINS_USER_HOME}
RUN mkdir ${HOME}/workspace && mkdir ${HOME}/.sonar && mkdir -p ${HOME}/.m2/repository && chmod -R 777 ${HOME} && mkdir -p ${HOME}/.config/configstore || true

#WARNING below give access to all servers
RUN chmod 700 ${HOME}/.ssh && chmod 600 ${HOME}/.ssh/id_rsa* && chmod 644 ${HOME}/.ssh/authorized_keys ${HOME}/.ssh/known_hosts || true

# drop back to the regular jenkins user - good practice
USER jenkins

#RUN npm install --only=production
#TODO -Dserver=tomcat8x
RUN ./mvnw --batch-mode install -Dserver=jetty9x -Dmaven.test.skip=true

#RUN ls -lrta -R $JENKINS_USER_HOME && ls -lrtan /home/jenkins/target/test.war

USER root

#RUN /microscanner ${MICROSCANNER_TOKEN} --continue-on-failure 2>&1 > ${JENKINS_USER_HOME}/microscanner.log
#RUN echo "No vulnerabilities!"
RUN rm /microscanner || true

RUN rm -Rf /tmp/* /home/jenkins/.npm/ /home/jenkins/.git/ /home/jenkins/.node_cache || true
#RUN chown -R jenkins:$(id -gn jenkins) $JENKINS_USER_HOME/.[^.]* && chmod -R 777 $JENKINS_USER_HOME/.[^.]* && ls -lrta -R $JENKINS_USER_HOME
RUN chown -R "jenkins:$(id -gn jenkins)" "$JENKINS_USER_HOME" && chmod -R 777 "$JENKINS_USER_HOME"
#RUN chmod g-w,o-w ${HOME} # Home directory on the server should not be writable by others

# drop back to the regular jenkins user - good practice
USER jenkins

EXPOSE 8080

FROM openjdk:11-jre-slim as runtime

ARG JENKINS_USER_HOME=${JENKINS_USER_HOME:-/home/jenkins}

ARG USER=${USER:-jenkins}
ARG GROUP=${GROUP:-docker}
ARG UID=${UID:-2000}
ARG GID=${GID:-2000}
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

COPY --from=build /home/jenkins/target/test.war /home/jenkins/target/dependency/jetty-runner.jar /opt/
WORKDIR /opt/

VOLUME ["/sys/fs/cgroup", "/tmp", "/run"]

#java -jar target/dependency/jetty-runner.jar target/test.war

#CMD ["/bin/bash"]
CMD ["/bin/bash", "-c", "find /opt/ -type f -name '*.war' | xargs java -jar /opt/jetty-runner.jar"]
#CMD ["/lib/systemd/systemd"]
EXPOSE 8080

# This Dockerfile is used to build an image containing basic stuff to be used as a Jenkins slave build node.
#FROM selenium/standalone-chrome:3.12.0-cobalt as tester
#RUN apk --no-cache add ca-certificates
#
#COPY --from=builder /go/src/github.com/alexellis/href-counter/app .
#CMD ["./app"]

## This Dockerfile is used to build an image containing basic stuff to be used as a Jenkins slave build node.
#FROM tomcat:8-jre8 as runner
#
#LABEL Name="TEST" Vendor="TEST" Version="1.0.0"
#LABEL description="Image used by fusion-risk products to build Java/Javascript and CPP\
# this image is running on Ubuntu 16.04."
#
#ARG JENKINS_USER_HOME=${JENKINS_USER_HOME:-/home/jenkins}
#
##ENV LANG en_US.UTF-8
#ENV TERM="xterm-256color"
#
##USER 0
#
#RUN printf "\033[1;32mFROM JENKINS_USER_HOME: ${JENKINS_USER_HOME} \033[0m\n"
#
## Install ansible
#RUN apt-get clean && apt-get -y update && apt-get install -y \
#    -o APT::Install-Recommend=false -o APT::Install-Suggests=false \
#    $BUILD_PACKAGES git zip unzip python-yaml python-jinja2 python-pip openssh-server rsyslog \
#    && apt-get install -y xz-utils curl lsof sshpass \
#    net-tools iputils-ping x11-apps
#
## Copy to images tomcat path
##ADD web.xml /usr/local/tomcat/conf/
##ADD obclient.properties /etc/
##ADD WebClient.properties /etc/
#
##COPY --chown=jenkins:$(id -gn jenkins) --from=builder $JENKINS_USER_HOME/target/*.war /usr/local/tomcat/webapps/
##COPY --chown=jenkins:$(id -gn jenkins) --from=0 $JENKINS_USER_HOME/target/*.war /usr/local/tomcat/webapps/
##ADD ./target/test.war /usr/local/tomcat/webapps/
#COPY --from=0 $JENKINS_USER_HOME/target/test.war $CATALINA_HOME/webapps/test.war
##COPY target/test.war $CATALINA_HOME/webapps/test.war
#
## Clean up APT when done.
#RUN apt-get autoremove -y && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* \
#&& ifconfig | awk '/inet addr/{print substr($2,6)}' ## Display IP address (optional)
#
## Standard SSH port AND 8080
##EXPOSE 22
#EXPOSE 22 8080
#
## set a health check
#HEALTHCHECK --interval=1m \
#            --timeout=5s \
#CMD curl -f http://127.0.0.1:8080 || exit 1
##CMD wget --quiet --tries=1 --spider http://localhost:8080/wizard/ || exit 1
#
##CMD ["/usr/sbin/sshd", "-D"]
#CMD ["/bin/bash"]
##CMD ["-g", "deamon off;"]
#
##docker build --tag mywebserver .
##docker run -it --rm -p 8888:8080 mywebserver
