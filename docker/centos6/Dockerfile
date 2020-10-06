# CentOS based image (RHEL6-compatible):
FROM centos:6.9

LABEL Name="nabla-servers-bower-sample" Vendor="TEST" Version="1.0.0"

ARG JENKINS_HOME=${JENKINS_HOME:-/home/jenkins}
ARG UID=1003
ARG GID=1002

ENV JAVA_HOME="/usr/lib/jvm/java-openjdk"
ARG CERT_NAME=${CERT_NAME:-"NABLA.crt"}
ARG CERT_URL=${CERT_URL:-"http://albandrieu.com/download/certs/${CERT_NAME}"}

ENV TERM="xterm-256color"
ENV JAVA_TOOL_OPTIONS="-Dfile.encoding=UTF-8"

# EPEL / IUS repositories and dependencies to install
RUN yum -y update ;\
    yum -y install \
    ca-certificates \
    wget \
    which \
    centos-release-SCL \
    http://opensource.wandisco.com/centos/6/git/x86_64/wandisco-git-release-6-1.noarch.rpm # for git

# Add root certificate
RUN cd /etc/pki/ca-trust/source/anchors/ && wget --no-check-certificate ${CERT_URL}
RUN update-ca-trust

ADD https://dl.fedoraproject.org/pub/epel/epel-release-latest-6.noarch.rpm /tmp
RUN yum -y install /tmp/epel-release-latest-6.noarch.rpm && yum -y clean all

ADD https://repo.ius.io/ius-release-el6.rpm /tmp/ius-release-el6.rpm
RUN rpm -ivh /tmp/ius-release-el6.rpm && yum -y clean all

ADD http://people.centos.org/tru/devtools-2/devtools-2.repo/etc/yum.repos.d/devtools-2.repo

# Compilation tools
RUN yum -y install \
    file \
    openssl-devel \
    util-linux \
    apr \
    apr-util \
    libssh2 \
    openssl-devel \
    openldap-devel \
    libcurl-devel \
    libzip \
    libxml2-devel \
    unzip \
    devtoolset-2-gcc \
    devtoolset-2-binutils \
    devtoolset-2-gcc-c++ \
    bison \
    flex \
    doxygen \
    cmake \
    make \
    clang-devel \
    clang-analyzer \
    libclang-dev \
    iwyu \
    unixODBC-devel \
    libuuid-devel \
    libicu-devel \
    libtool-ltdl \
    libobjc \
    rsync \
    git \
    maven \
    python27 \
    java-1.8.0-openjdk-devel \
    python27 \
    scl-utils \
    git \
    && yum -y clean all

#RUN mkdir -p "/toolchain/lib/gcc/$(arch)-redhat-linux"
#RUN ln -sfn "/opt/rh/devtoolset-2/root/usr/lib/gcc/$(arch)-redhat-linux/4.8.2" "/toolchain/lib/gcc/$(arch)-redhat-linux/"

RUN ls -lrta /etc/scl &&\
    echo /opt/rh > /etc/scl/prefixes/python27 &&\
    mkdir /opt/rh/python27 &&\
    touch /opt/rh/python27/enable
RUN scl enable python27 bash && python -V && python2 -V && ls -lrta /usr/bin/python* && /usr/bin/python2.7 -V
#RUN scl enable devtoolset-2 bash

#SHELL [ "/usr/bin/scl", "enable", "devtoolset-2"]
RUN echo "source scl_source enable devtoolset-2" >> /etc/bashrc
RUN source /etc/bashrc
#RUN which gcc
#RUN gcc --version

# entrypoint to enable slc at startup of image
#COPY ./entrypoint.sh /usr/bin/entrypoint.sh
#RUN chmod +x /usr/bin/entrypoint.sh

RUN localedef -i en_US -f UTF-8 en_US.UTF-8

RUN echo "export JAVA_HOME=${JAVA_HOME}" >> /etc/environment && \
    echo "export JRE_HOME=${JAVA_HOME}/jre" >> /etc/environment && \
    echo "export PATH=$PATH:${JAVA_HOME}/bin:${JAVA_HOME}/jre/bin" >>/etc/environment

RUN ln -sf /etc/pki/java/cacerts ${JAVA_HOME}/jre/lib/security/cacerts

# Add user jenkins to the image
RUN groupadd -g ${GID} docker && \
    adduser --uid ${UID} --gid ${GID} --home ${JENKINS_HOME} jenkins && \
    echo 'ALL ALL = (ALL) NOPASSWD: ALL' >> /etc/sudoers
# Set password for the jenkins user (you may want to alter this).
RUN echo "jenkins:jenkins1234" | chpasswd

USER jenkins

CMD ["/bin/bash"]
EXPOSE 8080
