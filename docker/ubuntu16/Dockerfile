# This Dockerfile is used to build an image containing basic stuff to be used as a Jenkins slave build node.
#FROM selenium/standalone-chrome:3.141.59-gold AS builder
#FROM ubuntu:18.04
FROM selenium/standalone-chrome:3.141.59-gold

ARG JENKINS_HOME=${JENKINS_HOME:-/home/jenkins}

ARG JDK8_VERSION=${JDK8_VERSION:-172}
ARG JAVA_URL="http://fr1cslfrbm0059.misys.global.ad/download/jdk/jdk-8u${JDK8_VERSION}-linux-x64.tar.gz"
ENV JDK_HOME=${JDK_HOME:-"/usr/local/jdk1.8.0_${JDK8_VERSION}"}
ENV JAVA_HOME=${JAVA_HOME:-$JDK_HOME}
ENV JAVA_TOOL_OPTIONS="-Dfile.encoding=UTF-8"
ARG CERT_NAME="UK1VSWCERT01-CA-5.crt"
ARG CERT_URL="http://fr1cslfrbm0059.misys.global.ad/download/certs/UK1VSWCERT01-CA-5.crt"

#MAINTAINER Alban Andrieu "https://github.com/AlbanAndrieu"
#LABEL vendor="TEST" version="1.0.0"
LABEL description="Image used by fusion-risk products to build Java/Javascript and CPP\
 this image is running on Ubuntu 16.04."

# Volume can be accessed outside of container
#VOLUME [${JENKINS_HOME}]

# No interactive frontend during docker build
ENV DEBIAN_FRONTEND=noninteractive \
    DEBCONF_NONINTERACTIVE_SEEN=true

ENV JENKINS_HOME=${JENKINS_HOME}

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
    apt-get -q upgrade -y -o Dpkg::Options::="--force-confnew" --no-install-recommends &&\
    apt-get -q install -y -o Dpkg::Options::="--force-confnew" -o APT::Install-Recommend=false -o APT::Install-Suggests=false \
    git bzip2 zip unzip python-yaml python-jinja2 python-pip openssh-server rsyslog \
    apt-transport-https ca-certificates software-properties-common \
    locales xz-utils ksh wget tzdata sudo curl lsof sshpass \
    python3-setuptools python3 python3-pip python3-dev python3-apt \
    openjdk-8-jdk maven \
    net-tools iputils-ping x11-apps

RUN dpkg-reconfigure --frontend noninteractive tzdata && date && locale-gen en_US.UTF-8

RUN python3 -m pip install --upgrade pip==9.0.3 \
    && pip install ansible==2.7.2 zabbix-api

RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
RUN sudo apt-key fingerprint 0EBFCD88
RUN add-apt-repository \
    "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) \
    stable"
# Install Docker from Docker Inc. repositories.
RUN apt-get update -qq && apt-get install -qqy docker-ce=5:18.09.0~3-0~ubuntu-bionic && rm -rf /var/lib/apt/lists/*

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash - ;\
    apt-get update && apt-get install -y nodejs ;\
    npm install -g bower@1.8.8 grunt@1.0.3 grunt-cli@1.3.2 nsp@3.2.1 webdriver-manager@12.1.0 npm@6.4.1 yo@2.0.5 json2csv@4.3.3 shrinkwrap@0.4.0

ARG UID=${UID:-1003}
ARG GID=${GID:-1002}
RUN printf "\033[1;32mFROM UID:GID: ${UID}:${GID}- JENKINS_HOME: ${JENKINS_HOME} \033[0m\n"

RUN groupmod -g ${GID} docker
RUN cat /etc/group | grep docker || true
#RUN id docker
RUN getent passwd 1002 || true

# Add user jenkins to the image
#RUN groupadd -g ${GID} docker && \
RUN adduser --quiet --uid ${UID} --gid ${GID} --home ${JENKINS_HOME} jenkins && \
    echo 'ALL ALL = (ALL) NOPASSWD: ALL' >> /etc/sudoers
# Set password for the jenkins user (you may want to alter this).
RUN echo "jenkins:jenkins1234" | chpasswd
RUN usermod -a -G docker jenkins

RUN mkdir ${JDK_HOME} && \
    curl ${JAVA_URL} | tar xzC ${JDK_HOME} --strip-components=1

# env variables
#ENV PATH=${JAVA_HOME}/bin:$PATH

# Add java & root certs
RUN cd /etc/ssl/certs/ && curl -L -O ${CERT_URL}
RUN update-ca-certificates

#RUN ln -sf /etc/ssl/certs/java/cacerts /usr/lib/jvm/java-8-oracle/jre/lib/security/cacerts

# Update Java certs
RUN keytool -v -noprompt \
    -keystore $JAVA_HOME/jre/lib/security/cacerts \
    -importcert \
    -trustcacerts \
    -file /etc/ssl/certs/${CERT_NAME} \
    -alias test \
    -keypass changeit \
    -storepass changeit

# Working dir
WORKDIR $JENKINS_HOME

#RUN cat /etc/resolv.conf

# Install a basic SSH server
RUN sed -i 's|session    required     pam_loginuid.so|session    optional     pam_loginuid.so|g' /etc/pam.d/sshd
RUN mkdir -p /var/run/sshd
#RUN chmod 0755 /var/run/sshd

# Clean up APT when done.
#RUN AUTO_ADDED_PACKAGES=$(apt-mark showauto) \
#&& apt-get remove --purge -y $BUILD_PACKAGES $AUTO_ADDED_PACKAGES &&
RUN apt-get autoremove -y && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* \
&& ifconfig | awk '/inet addr/{print substr($2,6)}' ## Display IP address (optional)

#COPY --chown=jenkins:$(id -gn jenkins) . $JENKINS_HOME/
COPY . $JENKINS_HOME/

# Execute
RUN echo '{ "allow_root": true }' > /root/.bowerrc
RUN ./clean.sh
RUN chown -R jenkins:$(id -gn jenkins) $JENKINS_HOME && chmod -R 777 $JENKINS_HOME

# drop back to the regular jenkins user - good practice
USER jenkins
ENV HOME=${JENKINS_HOME}
# && chmod -R 777 ${HOME}/.npm && chmod -R 777 ${HOME}/.m2
# && mkdir ${HOME}/.config && mkdir ${HOME}/.local
RUN mkdir ${HOME}/workspace && mkdir ${HOME}/.sonar && mkdir -p ${HOME}/.m2/repository && chmod -R 777 ${HOME}
#RUN id jenkins && ls -lrtai $HOME/ && ls -lrtai $HOME/.sonar

#RUN chown -R jenkins:$(id -gn jenkins) $JENKINS_HOME/.[^.]* && chmod -R 777 $JENKINS_HOME/.[^.]* && ls -lrta -R $JENKINS_HOME
#RUN ls -lrta -R $JENKINS_HOME
#RUN chown -R jenkins:$(id -gn jenkins) $JENKINS_HOME && chmod 777 $JENKINS_HOME

#RUN npm install --only=production
#TODO -Dserver=tomcat8x
RUN ./mvnw install -Dserver=jetty9x -Dmaven.test.skip=true

# Standard SSH port
EXPOSE 22

CMD ["/bin/bash"]

# This Dockerfile is used to build an image containing basic stuff to be used as a Jenkins slave build node.
#FROM selenium/standalone-chrome:3.12.0-cobalt as tester
#RUN apk --no-cache add ca-certificates
#
#COPY --from=builder /go/src/github.com/alexellis/href-counter/app .
#CMD ["./app"]

## This Dockerfile is used to build an image containing basic stuff to be used as a Jenkins slave build node.
#FROM tomcat:8-jre8 as runner
#
#MAINTAINER Alban Andrieu "https://github.com/AlbanAndrieu"
#
#LABEL vendor="TEST" version="1.0.0"
#LABEL description="Image used by fusion-risk products to build Java/Javascript and CPP\
# this image is running on Ubuntu 16.04."
#
#ARG JENKINS_HOME=${JENKINS_HOME:-/home/jenkins}
#
##ENV LANG en_US.UTF-8
#ENV TERM="xterm-256color"
#
##USER 0
#
#RUN printf "\033[1;32mFROM JENKINS_HOME: ${JENKINS_HOME} \033[0m\n"
#
## Install ansible
#RUN apt-get clean && apt-get -y update && apt-get install -y \
#    -o APT::Install-Recommend=false -o APT::Install-Suggests=false \
#    $BUILD_PACKAGES git zip unzip python-yaml python-jinja2 python-pip openssh-server rsyslog \
#   && apt-get install -y xz-utils wget curl lsof sshpass \
#   net-tools iputils-ping x11-apps
#
##RUN curl -sL https://deb.nodesource.com/setup_8.x | bash - ;\
##    apt-get update && apt-get install -y nodejs ;\
##    npm set progress=false && \
##    npm config set depth 0 && \
##    npm install -g bower grunt grunt-cli nsp
#
## Copy to images tomcat path
##ADD web.xml /usr/local/tomcat/conf/
##ADD obclient.properties /etc/
##ADD WebClient.properties /etc/
#
##COPY --chown=jenkins:$(id -gn jenkins) --from=builder $JENKINS_HOME/target/*.war /usr/local/tomcat/webapps/
##COPY --chown=jenkins:$(id -gn jenkins) --from=0 $JENKINS_HOME/target/*.war /usr/local/tomcat/webapps/
##ADD ./target/test.war /usr/local/tomcat/webapps/
#COPY --from=0 $JENKINS_HOME/target/test.war $CATALINA_HOME/webapps/test.war
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
