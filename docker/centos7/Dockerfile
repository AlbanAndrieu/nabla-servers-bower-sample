# CentOS based image (RHEL7-compatible):
FROM centos:7.5.1804

ARG JENKINS_HOME=${JENKINS_HOME:-/home/jenkins}
ARG UID=1003
ARG GID=1002

ARG JAVA_HOME=${JAVA_HOME:-"/usr/lib/jvm/java-openjdk"}
ARG CERT_NAME=${CERT_NAME:-"NABLA.crt"}
ARG CERT_URL=${CERT_URL:-"https://home.nabla.mobi/download/certs/${CERT_NAME}"}

ENV TERM="xterm-256color"
ENV JAVA_TOOL_OPTIONS="-Dfile.encoding=UTF-8"

# EPEL / IUS repositories and dependencies to install
RUN yum -y update ;\
    yum -y install \
    wget \
    which

RUN cd /tmp &&\
    wget https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm &&\
    yum -y install epel-release-latest-7.noarch.rpm

RUN cd /tmp &&\
    wget https://centos7.iuscommunity.org/ius-release.rpm &&\
    rpm -ivh ius-release.rpm

# Runtime tools
RUN yum -y install \
    libicu \
    libtool-ltdl \
    unixODBC \
    libaio \
    freetds \
    java-1.8.0-openjdk-devel \
# Compilation tools
    file \
    git \
    docker-compose \
    && yum -y clean all

RUN localedef -i en_US -f UTF-8 en_US.UTF-8

# Add root certificate
#RUN cd /etc/pki/ca-trust/source/anchors/ && wget --no-check-certificate ${CERT_URL}
#RUN update-ca-trust

RUN echo "export JAVA_HOME=${JAVA_HOME}" >> /etc/environment && \
    echo "export JRE_HOME=${JAVA_HOME}/jre" >> /etc/environment && \
    echo "export PATH=$PATH:${JAVA_HOME}/bin:${JAVA_HOME}/jre/bin" >>/etc/environment

RUN alternatives --list
RUN ls -lrta /usr/lib/jvm/
RUN ln -sf /etc/pki/java/cacerts ${JAVA_HOME}/jre/lib/security/cacerts

# Add user jenkins to the image
RUN groupadd -g ${GID} docker && \
    adduser --uid ${UID} --gid ${GID} --home ${JENKINS_HOME} jenkins && \
    echo 'ALL ALL = (ALL) NOPASSWD: ALL' >> /etc/sudoers
# Set password for the jenkins user (you may want to alter this).
RUN echo "jenkins:jenkins1234" | chpasswd

USER jenkins

COPY --chown=jenkins:docker target/dependency/jetty-runner.jar target/test.war ${JENKINS_HOME}/

ENTRYPOINT ["java", "-jar", "/home/jenkins/jetty-runner.jar"]
CMD [""/home/jenkins/test.war""]

EXPOSE 8080
