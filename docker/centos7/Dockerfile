# CentOS based image (RHEL7-compatible):
FROM centos:7.5.1804

LABEL Name="nabla-servers-bower-sample" Vendor="TEST" Version="1.0.0"

ARG JENKINS_USER_HOME=${JENKINS_USER_HOME:-/home/jenkins}

ARG JAVA_HOME=${JAVA_HOME:-"/usr/lib/jvm/java-openjdk"}
ARG CERT_NAME=${CERT_NAME:-"NABLA.crt"}
ARG CERT_URL=${CERT_URL:-"https://home.albandrieu.com/download/certs/${CERT_NAME}"}

ARG HELM_VERSION=${HELM_VERSION:-"v2.14.1"}
ENV FILENAME=helm-${HELM_VERSION}-linux-amd64.tar.gz
ENV HELM_URL=https://storage.googleapis.com/kubernetes-helm/${FILENAME}

ENV TERM="xterm-256color"
ENV JAVA_TOOL_OPTIONS="-Dfile.encoding=UTF-8"

# Install systemd -- See https://hub.docker.com/_/centos/
RUN yum -y update; yum clean all; \
(cd /lib/systemd/system/sysinit.target.wants/; for i in *; do [ $i == systemd-tmpfiles-setup.service ] || rm -f $i; done); \
rm -f /lib/systemd/system/multi-user.target.wants/*;\
rm -f /etc/systemd/system/*.wants/*;\
rm -f /lib/systemd/system/local-fs.target.wants/*; \
rm -f /lib/systemd/system/sockets.target.wants/*udev*; \
rm -f /lib/systemd/system/sockets.target.wants/*initctl*; \
rm -f /lib/systemd/system/basic.target.wants/*;\
rm -f /lib/systemd/system/anaconda.target.wants/*;

ADD https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm /tmp
RUN yum -y install /tmp/epel-release-latest-7.noarch.rpm && yum -y clean all

ADD https://centos7.iuscommunity.org/ius-release.rpm /tmp
RUN rpm -ivh /tmp/ius-release.rpm && yum -y clean all

RUN yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo

# Add git lfs repo for yum
RUN curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.rpm.sh | bash
RUN rpm -U http://opensource.wandisco.com/centos/7/git/x86_64/wandisco-git-release-7-2.noarch.rpm

# Runtime tools
RUN yum makecache fast \
 && yum -y install \
    libicu \
    libtool-ltdl \
    unixODBC \
    libaio \
    freetds \
    java-1.8.0-openjdk-devel \
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

# Kubernetes tools
RUN curl -L -o /tmp/${FILENAME} ${HELM_URL} \
  && tar -zxvf /tmp/${FILENAME} -C /tmp \
  && chmod +x /tmp/linux-amd64/helm \
  && mv /tmp/linux-amd64/helm /bin/helm

RUN curl -L -o /tmp/kubectl  https://storage.googleapis.com/kubernetes-release/release/v1.16.1/bin/linux/amd64/kubectl \
  && chmod +x /tmp/kubectl \
  && mv /tmp/kubectl /bin/kubectl \
  && rm -rf /tmp

RUN helm init --client-only

# Sonar tools
ARG SONAR_SCANNER_URL="https://sonarsource.bintray.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-4.2.0.1873.zip"
ARG SONAR_WRAPPER_URL="https://sonarcloud.io/static/cpp/build-wrapper-linux-x86.zip"

ADD ${SONAR_SCANNER_URL} /tmp/
RUN unzip /tmp/*.zip ;\
    rm /tmp/*.zip ;\
    sonar_scanner=$( ls -d /sonar-scanner*) ;\
    mv ${sonar_scanner} /usr/local/sonar-runner/

ADD ${SONAR_WRAPPER_URL} /tmp/
RUN unzip /tmp/*.zip ;\
    rm /tmp/*.zip ;\
    sonar_build_wrapper=$( ls -d /build-wrapper*) ;\
    mv ${sonar_build_wrapper} /usr/local/sonar-build-wrapper/

# Install Ansible via Pip.
RUN pip install ansible==2.9.1

# Install Ansible inventory file.
RUN mkdir -p /etc/ansible
RUN echo "[local]\nlocalhost ansible_connection=local" > /etc/ansible/hosts

# Add user jenkins to the image
ARG USER=${USER:-jenkins}
ARG GROUP=${GROUP:-docker}
ARG UID=${UID:-1100}
ARG GID=${GID:-1101}
RUN printf "\033[1;32mFROM UID:GID: ${UID}:${GID}- JENKINS_USER_HOME: ${JENKINS_USER_HOME} \033[0m\n" && \
    printf "\033[1;32mWITH $USER\n AND GROUP: $GROUP \033[0m\n"

# Add user jenkins to the image
RUN groupmod -g ${GID} docker
#RUN groupadd -g ${GID} ${GROUP} && \
RUN adduser --uid ${UID} --gid ${GID} --home ${JENKINS_USER_HOME} ${USER} && \
    echo 'ALL ALL = (ALL) NOPASSWD: ALL' >> /etc/sudoers
# Set password for the jenkins user (you may want to alter this).
RUN echo "jenkins:jenkins1234" | chpasswd

#ADD https://albandri/download/docker/config.json ${JENKINS_USER_HOME}/.docker/config.json
#RUN chown -R ${UID}:${GID} ${JENKINS_USER_HOME}/.docker

USER jenkins

# Working dir
WORKDIR $JENKINS_USER_HOME

COPY --chown=jenkins:docker target/dependency/jetty-runner.jar target/test.war ${JENKINS_USER_HOME}/

VOLUME ["/sys/fs/cgroup"]

ENTRYPOINT ["java", "-jar", "/home/jenkins/jetty-runner.jar"]
CMD ["/home/jenkins/test.war"]
EXPOSE 8080
