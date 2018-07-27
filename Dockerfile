# This Dockerfile is used to build an image containing basic stuff to be used as a Jenkins slave build node.
FROM selenium/standalone-chrome:3.12.0-cobalt as builder

ARG FILEBEAT_VERSION=${FILEBEAT_VERSION:-6.3.2}
ARG JENKINS_HOME=${JENKINS_HOME:-/home/jenkins}
ARG UID=1003
ARG GID=1002
ARG JDK8_VERSION=${JDK8_VERSION:-172}
ARG JAVA_URL="http://fr1cslfrbm0059.misys.global.ad/download/jdk/jdk-8u${JDK8_VERSION}-linux-x64.tar.gz"
ENV JDK_HOME="/usr/local/jdk1.8.0_${JDK8_VERSION}"
ENV JAVA_HOME=${JDK_HOME}
ARG CERT_NAME="UK1VSWCERT01-CA-5.crt"
ARG CERT_URL="http://fr1cslfrbm0059.misys.global.ad/download/certs/UK1VSWCERT01-CA-5.crt"

#MAINTAINER Alban Andrieu "https://github.com/AlbanAndrieu"
#LABEL vendor="TEST" version="1.0"
LABEL description="Image used by fusion-risk products to build Java/Javascript and CPP\
 this image is running on Ubuntu 16.04."

# Volume can be accessed outside of container
#VOLUME [${JENKINS_HOME}]

#ENV DEBIAN_FRONTEND noninteractive
ENV JENKINS_HOME=${JENKINS_HOME} \
WORKSPACE=$JENKINS_HOME \
HOME=${JENKINS_HOME}

#ENV LANG en_US.UTF-8
ENV TERM="xterm-256color"

USER 0

RUN printf "\033[1;32mFROM FILEBEAT: ${FILEBEAT_VERSION} - JENKINS_HOME: ${JENKINS_HOME} \033[0m\n"

# Install ansible
ENV BUILD_PACKAGES=python3 python3-pip python3-dev"
RUN apt-get clean && apt-get -y update && apt-get install -y \
    -o APT::Install-Recommend=false -o APT::Install-Suggests=false \
    $BUILD_PACKAGES git zip unzip python-yaml python-jinja2 python-pip openssh-server rsyslog && pip install ansible==2.4.3.0 \
	&& apt-get install -y xz-utils wget curl lsof sshpass \
	openjdk-8-jdk maven \
	net-tools iputils-ping x11-apps

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash - ;\
    apt-get update && apt-get install -y nodejs ;\
    npm install -g bower grunt grunt-cli nsp

RUN mkdir ${JDK_HOME} && \
    curl ${JAVA_URL} | tar xzC ${JDK_HOME} --strip-components=1

# env variables
#TODO????
#ENV PATH=${JAVA_HOME}/bin:$PATH

# Add java & root certs
RUN cd /etc/ssl/certs/ && curl -L -O ${CERT_URL}
RUN update-ca-certificates

# Update Java certs
RUN keytool -v -noprompt \
    -keystore $JAVA_HOME/jre/lib/security/cacerts \
    -importcert \
    -trustcacerts \
    -file /etc/ssl/certs/${CERT_NAME} \
    -alias misys \
    -keypass changeit \
    -storepass changeit

# Add user jenkins to the image
RUN groupadd -g ${GID} docker && \
    adduser --quiet --uid ${UID} --gid ${GID} --home ${JENKINS_HOME} jenkins && \
    echo 'ALL ALL = (ALL) NOPASSWD: ALL' >> /etc/sudoers
# Set password for the jenkins user (you may want to alter this).
RUN echo "jenkins:jenkins1234" | chpasswd

# Working dir
WORKDIR $JENKINS_HOME

#COPY --chown=jenkins:$(id -gn jenkins) . $JENKINS_HOME
#RUN chown -R jenkins:$(id -gn jenkins) $JENKINS_HOME/.[^.]* && chmod -R 777 $JENKINS_HOME/.[^.]* && ls -lrta -R $JENKINS_HOME
RUN chown -R jenkins:$(id -gn jenkins) $JENKINS_HOME && chmod -R 777 $JENKINS_HOME && ls -lrta -R $JENKINS_HOME

#===================
# Timezone settings
# Possible alternative: https://github.com/docker/docker/issues/3359#issuecomment-32150214
#===================
ENV TZ "UTC"
RUN echo "${TZ}" > /etc/timezone \
  && dpkg-reconfigure --frontend noninteractive tzdata

# Execute
#RUN ansible-galaxy install -r $WORKDIR/requirements.yml -p $WORKDIR/roles/ --ignore-errors \
# && ansible-playbook $WORKDIR/jenkins-slave.yml -i $WORKDIR/hosts -c local -vvvv -e "jenkins_ssh_key_file={{ jenkins_home }}/.ssh/id_rsa" -e "workspace=/tmp"

#RUN cat /etc/resolv.conf

# Install a basic SSH server
RUN sed -i 's|session    required     pam_loginuid.so|session    optional     pam_loginuid.so|g' /etc/pam.d/sshd
RUN mkdir -p /var/run/sshd
#RUN chmod 0755 /var/run/sshd

RUN curl -L -O https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-${FILEBEAT_VERSION}-amd64.deb && sudo dpkg -i filebeat-${FILEBEAT_VERSION}-amd64.deb

# Clean up APT when done.
#RUN AUTO_ADDED_PACKAGES=$(apt-mark showauto) \
#&& apt-get remove --purge -y $BUILD_PACKAGES $AUTO_ADDED_PACKAGES &&
RUN apt-get autoremove -y && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* \
&& ifconfig | awk '/inet addr/{print substr($2,6)}' ## Display IP address (optional)

USER jenkins # drop back to the regular jenkins user - good practice

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
##FROM ubuntu:16.04 as runner
#FROM alpine:3.7 as runner
#
#MAINTAINER Alban Andrieu "https://github.com/AlbanAndrieu"
#
#LABEL vendor="TEST" version="1.0"
#LABEL description="Image used by fusion-risk products to build Java/Javascript and CPP\
# this image is running on Ubuntu 16.04."
#
## Volume can be accessed outside of container
##VOLUME [${JENKINS_HOME}]
#
##ENV DEBIAN_FRONTEND noninteractive
#ENV WORKDIR $JENKINS_HOME
##ENV LANG en_US.UTF-8
#ENV TERM="xterm-256color"
#
## Working dir
#WORKDIR $JENKINS_HOME
#
##ADD . $WORKDIR/
#
#USER 0
#
#COPY --chown=2000:0 . $JENKINS_HOME
#RUN chown -R 2000:0 $JENKINS_HOME
#
## Install ansible
#ENV BUILD_PACKAGES="python3 python3-pip python3-dev"
#RUN apt-get clean && apt-get -y update && apt-get install -y \
#    -o APT::Install-Recommend=false -o APT::Install-Suggests=false \
#    $BUILD_PACKAGES git zip unzip python-yaml python-jinja2 python-pip openssh-server rsyslog \
#	&& apt-get install -y clinfo numactl libnuma1 pciutils \
#	xz-utils lsof \
#	openjdk-8-jdk maven \
#	net-tools x11-apps
#
## Add user jenkins to the image
#RUN groupadd -g 2000 docker && \
#    adduser --quiet --uid 2000 --gid 2000 --home ${JENKINS_HOME} jenkins && \
#    echo 'ALL ALL = (ALL) NOPASSWD: ALL' >> /etc/sudoers
## Set password for the jenkins user (you may want to alter this).
#RUN echo "jenkins:jenkins1234" | chpasswd
#
## Use tini as subreaper in Docker container to adopt zombie processes
#ARG TINI_VERSION=v0.16.1
#COPY tini_pub.gpg ${JENKINS_HOME}/tini_pub.gpg
#RUN curl -fsSL https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini-static-$(dpkg --print-architecture) -o /sbin/tini \
#  && curl -fsSL https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini-static-$(dpkg --print-architecture).asc -o /sbin/tini.asc \
#  && gpg --import ${JENKINS_HOME}/tini_pub.gpg \
#  && gpg --verify /sbin/tini.asc \
#  && rm -rf /sbin/tini.asc /root/.gnupg \
#  && chmod +x /sbin/tini
#
##===================
## Timezone settings
## Possible alternative: https://github.com/docker/docker/issues/3359#issuecomment-32150214
##===================
#ENV TZ "UTC"
#RUN echo "${TZ}" > /etc/timezone \
#  && dpkg-reconfigure --frontend noninteractive tzdata
## Execute
##RUN INSTALL
#
## Install a basic SSH server
#RUN sed -i 's|session    required     pam_loginuid.so|session    optional     pam_loginuid.so|g' /etc/pam.d/sshd
#RUN mkdir -p /var/run/sshd
##RUN chmod 0755 /var/run/sshd
#
#RUN curl -L -O https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-6.3.0-amd64.deb && sudo dpkg -i filebeat-6.3.0-amd64.deb
#
## Clean up APT when done.
##RUN AUTO_ADDED_PACKAGES=$(apt-mark showauto) \
##&& apt-get remove --purge -y $BUILD_PACKAGES $AUTO_ADDED_PACKAGES &&
#RUN apt-get autoremove -y && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* \
#&& ifconfig | awk '/inet addr/{print substr($2,6)}' ## Display IP address (optional)
#
#USER 2000
#
## Standard SSH port
#EXPOSE 22
#
## set a health check
#HEALTHCHECK --interval=5s \
#            --timeout=5s \
#CMD curl -f http://127.0.0.1:9090 || exit 1
#
#COPY tini-shim.sh /bin/tini
##ENTRYPOINT ["/sbin/tini", "--"]
#ENTRYPOINT ["/sbin/tini", "--", "mvn jetty:run"]
##CMD ["/usr/sbin/sshd", "-D"]
#CMD ["/bin/bash"]
##CMD ["-g", "deamon off;"]
