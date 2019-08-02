#!/bin/bash
#set -xv
#set -u
set -e

WORKING_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}"  )" && pwd  )"

# shellcheck source=/dev/null
source "${WORKING_DIR}/step-0-color.sh"

#mkdir ./target/ || true
#cp ${WORKING_DIR}/target/test.war ./target/

# shellcheck disable=SC2154
echo -e "${magenta} Building TEST runtime image ${NC}"
# shellcheck disable=SC2154
echo -e "${green} pip install docker-compose==1.22.0 ${NC}"

if [ -n "${DOCKER_BUILD_ARGS}" ]; then
  # shellcheck disable=SC2154
  echo -e "${green} DOCKER_BUILD_ARGS is defined ${happy_smiley} : ${DOCKER_BUILD_ARGS} ${NC}"
else
  # shellcheck disable=SC2154
  echo -e "${red} ${double_arrow} Undefined build parameter ${head_skull} : DOCKER_BUILD_ARGS, use the default one ${NC}"
  export DOCKER_BUILD_ARGS="--pull"
  #export DOCKER_BUILD_ARGS="--build-arg --no-cache"
  echo -e "${magenta} DOCKER_BUILD_ARGS : ${DOCKER_BUILD_ARGS} ${NC}"
fi

readonly DOCKER_REGISTRY=${DOCKER_REGISTRY:-"https://hub.docker.com/"}
readonly DOCKER_ORGANISATION=${DOCKER_ORGANISATION:-"nabla"}
readonly DOCKER_USERNAME=${DOCKER_USERNAME:-"nabla"}
readonly DOCKER_NAME=${DOCKER_NAME:-"nabla-servers-bower-sample"}
readonly DOCKER_TAG=${DOCKER_TAG:-"latest"}

#docker build --target builder .
#docker build --target builder -t aandrieu/test:latest .
#docker build --target runner .

echo -e "${green} Building docker image ${NC}"
echo -e "${magenta} time docker build ${DOCKER_BUILD_ARGS} -f ${WORKING_DIR}/Dockerfile -t \"${DOCKER_ORGANISATION}/${DOCKER_NAME}\" . --tag \"$DOCKER_TAG\" ${NC}"
time docker build ${DOCKER_BUILD_ARGS} -f "${WORKING_DIR}/Dockerfile" -t "${DOCKER_ORGANISATION}/${DOCKER_NAME}" . --tag "${DOCKER_TAG}"
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

exit 0
