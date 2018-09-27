#!/bin/bash
#set -xv

WORKING_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}"  )" && pwd  )"

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

export DOCKERUSERNAME="nabla"
export DOCKERREGISTRY="https://hub.docker.com/"
export DOCKERORGANISATION="nabla"
export DOCKERNAME="nabla-servers-bower-sample"
export DOCKERTAG="latest"

#docker build --target builder .
#docker build --target builder -t aandrieu/test:latest .
#docker build --target runner .

echo -e "${green} Building docker image ${NC}"
echo -e "${magenta} time docker build ${DOCKER_BUILD_ARGS} -f ${WORKING_DIR}/Dockerfile -t \"${DOCKERORGANISATION}/${DOCKERNAME}\" . --tag \"$DOCKERTAG\" ${NC}"
time docker build "${DOCKER_BUILD_ARGS}" -f "${WORKING_DIR}/Dockerfile" -t "${DOCKERORGANISATION}/${DOCKERNAME}" . --tag "${DOCKERTAG}"
RC=$?
if [ ${RC} -ne 0 ]; then
  echo ""
  echo -e "${red} ${head_skull} Sorry, build failed. ${NC}"
  exit 1
else
  echo -e "${green} The build completed successfully. ${NC}"
fi

echo -e ""
echo -e "${green} This image is a trusted docker Image. ${happy_smiley} ${NC}"
echo -e ""
echo -e "To push it"
echo -e "    docker login ${DOCKERREGISTRY} --username ${DOCKERUSERNAME} --password password"
echo -e "    docker tag ${DOCKERREGISTRY}${DOCKERORGANISATION}/${DOCKERNAME}:${DOCKERTAG} ${DOCKERREGISTRY}${DOCKERORGANISATION}/${DOCKERNAME}:${DOCKERTAG}"
echo -e "    docker push ${DOCKERREGISTRY}${DOCKERORGANISATION}/${DOCKERNAME}"
echo -e ""
echo -e "To pull it"
echo -e "    docker pull ${DOCKERREGISTRY}${DOCKERORGANISATION}/${DOCKERNAME}:${DOCKERTAG}"
echo -e ""
echo -e "To use this docker:"
echo -e "    docker run -d -P ${DOCKERORGANISATION}/${DOCKERNAME}"
echo -e " - to attach your container directly to the host's network interfaces"
echo -e "    docker run --net host -d -P ${DOCKERORGANISATION}/${DOCKERNAME}"
echo -e ""
echo -e "To run in interactive mode for debug:"
echo -e "    docker run -it -d ${DOCKERORGANISATION}/${DOCKERNAME} --name sandbox"
echo -e "    docker exec -it sandbox /bin/bash"
echo -e ""

exit 0
