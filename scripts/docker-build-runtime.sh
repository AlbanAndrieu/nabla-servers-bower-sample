#!/bin/bash
#set -xv
shopt -s extglob

#set -ueo pipefail
set -eo pipefail

WORKING_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}"  )" && pwd  )"

export DOCKER_NAME=${DOCKER_NAME:-"bower-fr-integration-test"}

# shellcheck source=/dev/null
source "${WORKING_DIR}/docker-env.sh"

#docker build --target builder .
#docker build --target builder -t aandrieu/test:latest .
#docker build --target runner .

echo -e "${green} Building docker image ${NC}"
echo -e "${magenta} time docker build ${DOCKER_BUILD_ARGS} -f ${WORKING_DIR}/../docker/centos7/Dockerfile -t \"${DOCKER_ORGANISATION}/${DOCKER_NAME}\" \"${WORKING_DIR}/..\" --tag \"$DOCKER_TAG\" ${NC}"
time docker build ${DOCKER_BUILD_ARGS} -f "${WORKING_DIR}/../docker/centos7/Dockerfile" -t "${DOCKER_ORGANISATION}/${DOCKER_NAME}" "${WORKING_DIR}/.." --tag "${DOCKER_TAG}"
RC=$?
if [ ${RC} -ne 0 ]; then
  echo ""
  # shellcheck disable=SC2154
  echo -e "${red} ${head_skull} Sorry, build failed. ${NC}"
  exit 1
else
  echo -e "${green} The build completed successfully. ${NC}"
fi

echo -e ""
echo -e "${green} This image is a trusted docker Image. ${happy_smiley} ${NC}"
echo -e ""
echo -e "To push it"
echo -e "    docker login ${DOCKER_REGISTRY} --username ${DOCKER_USERNAME} --password password"
echo -e "    docker tag ${DOCKER_ORGANISATION}/${DOCKER_NAME}:latest ${DOCKER_REGISTRY}${DOCKER_ORGANISATION}/${DOCKER_NAME}:${DOCKER_TAG}"
echo -e "    docker push ${DOCKER_REGISTRY}${DOCKER_ORGANISATION}/${DOCKER_NAME}"
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
echo -e ""

echo -e "docker build -t ${DOCKER_ORGANISATION}/${DOCKER_NAME}:latest --pull -f ${WORKING_DIR}/../docker/centos7/Dockerfile ./"
echo -e "docker run -p 8080:8080 -t ${DOCKER_ORGANISATION}/${DOCKER_NAME}:latest --version"
echo -e "docker run -p 8080:8080 -t ${DOCKER_ORGANISATION}/${DOCKER_NAME}:latest /home/jenkins/test.war"
echo -e ""

exit 0
