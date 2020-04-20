#!/bin/bash
#set -xv
shopt -s extglob

#set -ueo pipefail
set -eo pipefail

WORKING_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}"  )" && pwd  )"

# shellcheck source=/dev/null
tput colors && source "${WORKING_DIR}/../step-0-color.sh"

export DOCKER_NAME=$1
export DOCKER_NAME=${DOCKER_NAME:-"ansible-jenkins-slave-test"}

echo "DOCKER_NAME : $DOCKER_NAME"

export DOCKER_TAG=$2
#if [[ $DOCKER_TAG == "" ]]; then
#    echo "Missing DOCKER_TAG"
#fi

echo "DOCKER_TAG : $DOCKER_TAG"

WORKING_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}"  )" && pwd  )"

# shellcheck source=/dev/null
source "${WORKING_DIR}/docker-env.sh"

WORKING_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}"  )" && pwd  )"

# shellcheck disable=SC2154
echo -e "${magenta} Testing TEST runtime image ${NC}"

#echo -e "docker pull gcr.io/gcp-runtimes/container-structure-test:latest ${NC}"
#docker pull gcr.io/gcp-runtimes/container-structure-test:latest

if [ -f /usr/local/bin/container-structure-test ]; then
  echo "container-structure-test file found"
else
  curl -LO https://storage.googleapis.com/container-structure-test/latest/container-structure-test-linux-amd64 && chmod +x container-structure-test-linux-amd64 && mkdir -p $HOME/bin && export PATH=$PATH:$HOME/bin && mv container-structure-test-linux-amd64 $HOME/bin/container-structure-test
  #curl -LO https://storage.googleapis.com/container-structure-test/latest/container-structure-test-linux-amd64 && chmod +x container-structure-test-linux-amd64 && sudo mv container-structure-test-linux-amd64 /usr/local/bin/container-structure-test
fi

echo -e "container-structure-test test --image ${DOCKER_REGISTRY}${DOCKER_ORGANISATION}/${DOCKER_NAME}:${DOCKER_TAG} --config ${WORKING_DIR}/../${CST_CONFIG} ${NC}"
/usr/local/bin/container-structure-test test --image "${DOCKER_REGISTRY}${DOCKER_ORGANISATION}/${DOCKER_NAME}:${DOCKER_TAG}" --config ${WORKING_DIR}/../${CST_CONFIG}

if [ -n "${MICROSCANNER_TOKEN}" ]; then
  # shellcheck disable=SC2154
  echo -e "${green} MICROSCANNER_TOKEN is defined ${happy_smiley} : ${MICROSCANNER_TOKEN} ${NC}"

  if [ -f ${WORKING_DIR}/microscanner-wrapper/scan.sh ]; then
    echo "aqua file found"
  else
    git clone https://github.com/lukebond/microscanner-wrapper ${WORKING_DIR}/microscanner-wrapper
  fi

  echo -e "${WORKING_DIR}/microscanner-wrapper/scan.sh ${DOCKER_REGISTRY}${DOCKER_ORGANISATION}/${DOCKER_NAME}:${DOCKER_TAG} ${NC}"

  export MICROSCANNER_OPTIONS="--html"
  cd ${WORKING_DIR}/microscanner-wrapper/
  #${WORKING_DIR}/microscanner-wrapper/scan.sh "${DOCKER_REGISTRY}${DOCKER_ORGANISATION}/${DOCKER_NAME}:${DOCKER_TAG}" | tee aqua-scan.log
  ${WORKING_DIR}/microscanner-wrapper/grabhtml.sh "${DOCKER_REGISTRY}${DOCKER_ORGANISATION}/${DOCKER_NAME}:${DOCKER_TAG}" > tee aqua-grabhtml.html

else
  # shellcheck disable=SC2154
  echo -e "${red} ${double_arrow} Undefined build parameter ${head_skull} : MICROSCANNER_TOKEN, use the default one ${NC}"
  export MICROSCANNER_TOKEN="NzdhNTQ2ZGZmYmEz"
  echo -e "${magenta} MICROSCANNER_TOKEN : ${MICROSCANNER_TOKEN} ${NC}"
fi

echo -e "docker pull registry.misys.global.ad/global-bakery/aquasec-scanner-cli:latest"
echo -e "docker run --rm --volume ${WORKING_DIR}:/mnt --volume /var/run/docker.sock:/var/run/docker.sock registry.misys.global.ad/global-bakery/aquasec-scanner-cli:latest scan --user scanner --password password --host http://aqua:8080 --local --direct-cc --jsonfile /mnt/test.AquaSec --htmlfile /mnt/test hub.docker.com/nabla/ansible-jenkins-slave-test:latest"

echo -e "http://aqua:8080/#!/app/images/hub-docker/nabla~2Fansible-jenkins-slave-test/latest"
echo -e "docker run -e BUILD_JOB_NAME=NABLA-aqua/nabla-servers-bower-sample/develop -e BUILD_URL=https://jenkins.nabla.mobi/jenkins/job/NABLA-aqua/job/nabla-servers-bower-sample/job/develop/62/ -e BUILD_NUMBER=62 --rm -v /var/run/docker.sock:/var/run/docker.sock registry.misys.global.ad/global-bakery/aquasec-scanner-cli:latest scan --host http://aqua:8080 --local hub.docker.com/nabla/ansible-jenkins-slave:latest --registry hub.docker.com --register --show-negligible --checkonly --no-verify --html --user scanner --password password"

exit 0
