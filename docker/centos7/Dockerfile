# CentOS based image (RHEL7-compatible):
FROM centos:7.5.1804 as BUILD

LABEL Name="nabla-servers-bower-sample" Vendor="TEST" Version="1.0.0"

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

ARG JENKINS_USER_HOME=${JENKINS_USER_HOME:-/home/jenkins}

ENV JAVA_HOME=${JAVA_HOME:-"/usr/lib/jvm/java-openjdk"}
#ARG CERT_NAME=${CERT_NAME:-"NABLA.crt"}
#ARG CERT_URL=${CERT_URL:-"https://albandrieu.com/download/certs/${CERT_NAME}"}

ENV TERM="xterm-256color"
ENV JAVA_TOOL_OPTIONS="-Dfile.encoding=UTF-8"

# Install systemd -- See https://hub.docker.com/_/centos/
#RUN yum -y update; yum clean all; \
#(cd /lib/systemd/system/sysinit.target.wants/; for i in *; do [ $i == systemd-tmpfiles-setup.service ] || rm -f $i; done); \
#rm -f /lib/systemd/system/multi-user.target.wants/*;\
#rm -f /etc/systemd/system/*.wants/*;\
#rm -f /lib/systemd/system/local-fs.target.wants/*; \
#rm -f /lib/systemd/system/sockets.target.wants/*udev*; \
#rm -f /lib/systemd/system/sockets.target.wants/*initctl*; \
#rm -f /lib/systemd/system/basic.target.wants/*;\
#rm -f /lib/systemd/system/anaconda.target.wants/*;

RUN yum -y install epel-release && yum -y clean all

ADD https://repo.ius.io/ius-release-el7.rpm /tmp/ius-release-el7.rpm
RUN rpm -ivh /tmp/ius-release-el7.rpm && yum -y clean all

RUN yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo

# Add git lfs repo for yum
RUN curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.rpm.sh | bash
RUN rpm -U http://opensource.wandisco.com/centos/7/git/x86_64/wandisco-git-release-7-2.noarch.rpm

# Runtime tools
# hadolint ignore=DL3033
RUN yum makecache fast \
 && yum -y install \
    libicu \
    libtool-ltdl \
    unixODBC \
    libaio \
    freetds \
    java-1.8.0-openjdk-devel \
    wget \
# Compilation tools
    file \
    git \
    unzip \
    python-pip \
    docker-ce \
    docker-compose \
    && yum -y clean all

RUN localedef -i en_US -f UTF-8 en_US.UTF-8

# Disable requiretty.
#RUN sed -i -e 's/^\(Defaults\s*requiretty\)/#--- \1/'  /etc/sudoer

# Add root certificate
#ADD ${CERT_URL} /etc/pki/ca-trust/source/anchors/
#RUN update-ca-trust

RUN echo "export JAVA_HOME=${JAVA_HOME}" >> /etc/environment && \
    echo "export JRE_HOME=${JAVA_HOME}/jre" >> /etc/environment && \
    echo "export PATH=$PATH:${JAVA_HOME}/bin:${JAVA_HOME}/jre/bin" >>/etc/environment

RUN alternatives --list
RUN ls -lrta /usr/lib/jvm/
RUN ln -sf /etc/pki/java/cacerts ${JAVA_HOME}/jre/lib/security/cacerts


ENV HELM_VERSION=${HELM_VERSION:-"v3.4.0"}
ENV HELM_FILENAME=helm-${HELM_VERSION}-linux-amd64.tar.gz
ENV HELM_URL=https://get.helm.sh/${HELM_FILENAME}

# Kubernetes tools
# hadolint ignore=DL3020
ADD ${HELM_URL} /tmp/${HELM_FILENAME}
RUN tar -zxvf /tmp/${HELM_FILENAME} -C /tmp \
  && chmod +x /tmp/linux-amd64/helm \
  && mv /tmp/linux-amd64/helm /bin/helm \
  && rm -rf /tmp

ENV KUBECTL_VERSION=v1.18.3

ADD https://storage.googleapis.com/kubernetes-release/release/${KUBECTL_VERSION}/bin/linux/amd64/kubectl /tmp/kubectl
RUN chmod +x /tmp/kubectl \
  && mv /tmp/kubectl /bin/kubectl \
  && rm -rf /tmp

# Sonar tools
#ARG SONAR_SCANNER_URL="https://sonarsource.bintray.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-4.2.0.1873.zip"
ARG SONAR_SCANNER_URL="https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-4.2.0.1873.zip"
ARG SONAR_WRAPPER_URL="https://sonarcloud.io/static/cpp/build-wrapper-linux-x86.zip"
#
## hadolint ignore=DL3020
#ADD ${SONAR_SCANNER_URL} /tmp/
#RUN unzip /tmp/*.zip \
#    && rm /tmp/*.zip \
#    && sonar_scanner=$( ls -d /sonar-scanner*) \
#    && mv "${sonar_scanner}" /usr/local/sonar-runner/
#
## hadolint ignore=DL3020
#ADD "${SONAR_WRAPPER_URL}" /tmp/
#RUN unzip /tmp/*.zip \
#    && rm /tmp/*.zip \
#    && sonar_build_wrapper=$( ls -d /build-wrapper*) \
#    && mv "${sonar_build_wrapper}" /usr/local/sonar-build-wrapper/

# Install Ansible via Pip.
RUN python3 -m pip install --no-cache-dir --proxy=${http_proxy} --upgrade pip==20.2.3 \
    && pip install --no-cache-dir --proxy=${http_proxy} ansible==2.9.1 zabbix-api==0.5.3 docker-compose==1.25.5 distro==1.5.0

# Install Ansible inventory file.
RUN mkdir -p /etc/ansible
RUN printf "[local]\nlocalhost ansible_connection=local" > /etc/ansible/hosts

# Add user jenkins to the image
ARG USER=${USER:-jenkins}
ARG GROUP=${GROUP:-docker}
ARG UID=${UID:-1100}
ARG GID=${GID:-1101}
# hadolint ignore=SC2059
RUN printf "\033[1;32mFROM UID:GID: ${UID}:${GID}- JENKINS_USER_HOME: ${JENKINS_USER_HOME} \033[0m\n" && \
    printf "\033[1;32mWITH $USER\n AND GROUP: $GROUP \033[0m\n"

# Add user jenkins to the image
RUN groupmod -g ${GID} docker
#RUN groupadd -g ${GID} ${GROUP} && \
RUN adduser --uid ${UID} --gid ${GID} --home ${JENKINS_USER_HOME} ${USER} && \
    echo 'ALL ALL = (ALL) NOPASSWD: ALL' >> /etc/sudoers
# Set password for the jenkins user (you may want to alter this).
RUN echo "jenkins:jenkins1234" | chpasswd

ENV JETTY_TMP /tmp/jetty
RUN mkdir ${JETTY_TMP} && chown -R ${USER}:${GROUP} ${JETTY_TMP}
ENV JETTY_BASE /var/lib/jetty
RUN mkdir ${JETTY_BASE} && chown -R ${USER}:${GROUP} ${JETTY_BASE}
ENV JETTY_HOME /usr/local/jetty
RUN mkdir ${JETTY_HOME} && chown -R ${USER}:${GROUP} ${JETTY_HOME}

USER jenkins

#RUN helm init --client-only
RUN helm plugin install https://github.com/chartmuseum/helm-push.git

# Working dir
WORKDIR $JENKINS_USER_HOME

COPY --chown=jenkins:docker target/dependency/jetty-runner.jar target/test.war ${JENKINS_USER_HOME}/

VOLUME ["/sys/fs/cgroup", "/tmp", "/run"]

#ENTRYPOINT ["java", "-Djava.io.tmpdir=/tmp/jetty", "-Djetty.base=/var/lib/jetty", "-jar", "/home/jenkins/jetty-runner.jar"]
ENTRYPOINT ["java", "-Djetty.base=/var/lib/jetty", "-jar", "/home/jenkins/jetty-runner.jar"]
CMD ["/home/jenkins/test.war"]
EXPOSE 8080
