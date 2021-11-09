#!/bin/bash
#set -xv
shopt -s extglob

#set -ueo pipefail
set -eo pipefail

WORKING_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}"  )" && pwd  )"

export DOCKER_TAG=${DOCKER_TAG:-"2.0.0"}

export DOCKER_NAME=${DOCKER_NAME:-"bower-fr-integration-test"}
#export DOCKER_FILE="docker/centos7/Dockerfile"
#export CST_CONFIG="docker/centos7/config.yaml"
export DOCKER_FILE="docker/ubuntu20/Dockerfile"
export CST_CONFIG="docker/ubuntu20/config.yaml"

# shellcheck source=/dev/null
source "${WORKING_DIR}/docker-env.sh"

WORKING_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}"  )" && pwd  )"

echo -e "${green} Building docker image ${NC}"
echo -e "${magenta} time docker build ${DOCKER_BUILD_ARGS} -f ${WORKING_DIR}/../${DOCKER_FILE} -t \"${DOCKER_ORGANISATION}/${DOCKER_NAME}\" \"${WORKING_DIR}/..\" --tag \"$DOCKER_TAG\" ${NC}"
time docker build ${DOCKER_BUILD_ARGS} -f "${WORKING_DIR}/../${DOCKER_FILE}" -t "${DOCKER_ORGANISATION}/${DOCKER_NAME}" "${WORKING_DIR}/.." --tag "${DOCKER_TAG}"
RC=$?
if [ ${RC} -ne 0 ]; then
  echo ""
  # shellcheck disable=SC2154
  echo -e "${red} ${head_skull} Sorry, build failed. ${NC}"
  exit 1
else
  echo -e "${green} The build completed successfully. ${NC}"

  echo -e "${green} Tagging the image. ${NC}"
  docker tag "${DOCKER_ORGANISATION}/${DOCKER_NAME}:latest" "${DOCKER_REGISTRY}${DOCKER_ORGANISATION}/${DOCKER_NAME}:${DOCKER_TAG}"
fi

echo -e ""
echo -e "${green} This image is a trusted docker Image. ${happy_smiley} ${NC}"
echo -e ""
echo -e "To push it"
echo -e "    docker login ${DOCKER_REGISTRY} --username ${DOCKER_USERNAME} --password password"
echo -e "    docker tag ${DOCKER_ORGANISATION}/${DOCKER_NAME}:latest ${DOCKER_REGISTRY}${DOCKER_ORGANISATION}/${DOCKER_NAME}:${DOCKER_TAG}"
echo -e "    docker push ${DOCKER_REGISTRY}${DOCKER_ORGANISATION}/${DOCKER_NAME}:${DOCKER_TAG}"
echo -e ""
echo -e "To pull it"
echo -e "    docker pull ${DOCKER_REGISTRY}${DOCKER_ORGANISATION}/${DOCKER_NAME}:${DOCKER_TAG}"
echo -e ""
echo -e "To use this docker:"
echo -e "    docker run -d -P ${DOCKER_ORGANISATION}/${DOCKER_NAME}"
echo -e " - to attach your container directly to the host's network interfaces"
echo -e "    docker run --net host -d -P ${DOCKER_ORGANISATION}/${DOCKER_NAME}"
echo -e ""
echo -e "To run in interactive mode for debug:"
echo -e "    docker run -it --entrypoint /bin/bash ${DOCKER_ORGANISATION}/${DOCKER_NAME}:latest"
echo -e "    docker run -it -d --name sandbox ${DOCKER_ORGANISATION}/${DOCKER_NAME}:latest"
echo -e "    docker exec -it sandbox /bin/bash"
echo -e " ${NC}"

echo -e "docker build -t ${DOCKER_ORGANISATION}/${DOCKER_NAME}:latest --pull -f ${DOCKER_FILE} ./ ${NC}"
echo -e "docker run -p 9090:8080 -t ${DOCKER_ORGANISATION}/${DOCKER_NAME}:latest --version"
echo -e "docker run -p 9090:8080 -t ${DOCKER_ORGANISATION}/${DOCKER_NAME}:latest /home/jenkins/test.war"
echo -e " ${NC}"

"${WORKING_DIR}/docker-test.sh" "${DOCKER_NAME}"

echo -e "${green} docker save ${DOCKER_REGISTRY}${DOCKER_ORGANISATION}/${DOCKER_NAME}:${DOCKER_TAG} > bower.tar ${NC}"
echo -e "${magenta} microk8s ctr image import bower.tar ${NC}"
echo -e "${magenta} microk8s ctr images ls ${NC}"

exit 0
