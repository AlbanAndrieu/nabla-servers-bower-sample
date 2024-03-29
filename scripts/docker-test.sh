#!/bin/bash
#set -xv
shopt -s extglob

#set -ueo pipefail
set -eo pipefail

WORKING_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# shellcheck source=/dev/null
source "${WORKING_DIR}/step-0-color.sh"

export DOCKER_NAME=$1

echo "DOCKER_NAME : $DOCKER_NAME"

if [[ $DOCKER_NAME == "" ]]; then
  echo "Missing DOCKER_NAME"
  #exit 1
fi

export DOCKER_TAG=$2
if [[ $DOCKER_TAG == "" ]]; then
  echo "Missing DOCKER_TAG"
fi

echo "DOCKER_TAG : $DOCKER_TAG"

WORKING_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# shellcheck source=/dev/null
source "${WORKING_DIR}/docker-env.sh"

WORKING_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

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

export DOCKER_IMAGE="${DOCKER_ORGANISATION}/${DOCKER_NAME}:${DOCKER_TAG}"

if [ -n "${BUILD_NUMBER}" ]; then
  # shellcheck disable=SC2154
  # Add DOCKER_REGISTRY to DOCKER_IMAGE
  #export DOCKER_IMAGE="${DOCKER_REGISTRY}${DOCKER_ORGANISATION}/${DOCKER_NAME}:${DOCKER_TAG}"
  echo -e "${green} BUILD_NUMBER is defined ${happy_smiley} : ${BUILD_NUMBER} ${NC}"
else
  # shellcheck disable=SC2154
  echo -e "${red} ${double_arrow} Undefined build parameter ${head_skull} : BUILD_NUMBER, use the default one ${NC}"
  echo -e "${magenta} BUILD_NUMBER : ${BUILD_NUMBER} ${NC}"
fi

echo -e "container-structure-test test --image ${DOCKER_IMAGE} --config ${WORKING_DIR}/../${CST_CONFIG} ${NC}"
/usr/local/bin/container-structure-test test --image "${DOCKER_IMAGE}" --config ${WORKING_DIR}/../${CST_CONFIG}

if [ -n "${MICROSCANNER_TOKEN}" ]; then
  # shellcheck disable=SC2154
  echo -e "${green} MICROSCANNER_TOKEN is defined ${happy_smiley} : ${MICROSCANNER_TOKEN} ${NC}"

  if [ -f ${WORKING_DIR}/microscanner-wrapper/scan.sh ]; then
    echo "aqua file found"
  else
    git clone https://github.com/lukebond/microscanner-wrapper ${WORKING_DIR}/microscanner-wrapper
  fi

  echo -e "${WORKING_DIR}/microscanner-wrapper/scan.sh ${DOCKER_IMAGE} ${NC}"

  export MICROSCANNER_OPTIONS="--html"
  cd ${WORKING_DIR}/microscanner-wrapper/
  #${WORKING_DIR}/microscanner-wrapper/scan.sh "${DOCKER_IMAGE}" | tee aqua-scan.log
  echo -e "${WORKING_DIR}/microscanner-wrapper/grabhtml.sh \"${DOCKER_IMAGE}\" > aqua-grab.html ${NC}"
  #${WORKING_DIR}/microscanner-wrapper/grabhtml.sh "${DOCKER_IMAGE}" > aqua-grab.html

else
  # shellcheck disable=SC2154
  echo -e "${red} ${double_arrow} Undefined build parameter ${head_skull} : MICROSCANNER_TOKEN, use the default one ${NC}"
  export MICROSCANNER_TOKEN="NzdhNTQ2ZGZmYmEz"
  echo -e "${magenta} MICROSCANNER_TOKEN : ${MICROSCANNER_TOKEN} ${NC}"
fi

export AQUA_URL=${AQUA_URL:-"http://albandrieu.com:8080"}

echo -e "docker pull nabla/aquasec-scanner-cli:latest"
echo -e "docker run --rm --volume ${WORKING_DIR}:/mnt --volume /var/run/docker.sock:/var/run/docker.sock nabla/aquasec-scanner-cli:latest scan --user scanner --password password --host http://aqua:8080 --local --direct-cc --jsonfile /mnt/test.AquaSec --htmlfile /mnt/test ${DOCKER_REGISTRY}/${DOCKER_ORGANISATION}/${DOCKER_NAME}:latest"

#echo -e "${AQUA_URL}/#!/app/images/${DOCKER_REGISTRY}/${DOCKER_ORGANISATION}/${DOCKER_NAME}/latest"
echo -e "docker run -e BUILD_JOB_NAME=NABLA-aqua/${DOCKER_NAME}/develop -e BUILD_URL=${JENKINS_URL}/job/NABLA-aqua/job//${DOCKER_NAME}/job/develop/62/ -e BUILD_NUMBER=62 --rm -v /var/run/docker.sock:/var/run/docker.sock nabla/aquasec-scanner-cli:latest scan --host ${AQUA_URL} --local ${DOCKER_REGISTRY}/${DOCKER_ORGANISATION}/${DOCKER_NAME}:latest --registry ${DOCKER_REGISTRY} --register --show-negligible --checkonly --no-verify --html --user scanner --password password"

exit 0
