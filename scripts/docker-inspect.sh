#!/bin/bash
#set -xv
shopt -s extglob

#set -ueo pipefail
set -eo pipefail

WORKING_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}"  )" && pwd  )"

# shellcheck source=/dev/null
source "${WORKING_DIR}/step-0-color.sh"

echo -e "${green} Security ${NC}"
echo -e "${magenta} docker_bench_security ${NC}"

docker run -it --net host --pid host --userns host --cap-add audit_control \
-e DOCKER_CONTENT_TRUST=$DOCKER_CONTENT_TRUST \
-v /var/lib:/var/lib \
-v /var/run/docker.sock:/var/run/docker.sock \
-v /usr/lib/systemd:/usr/lib/systemd \
-v /etc:/etc --label docker_bench_security \
docker/docker-bench-security

echo -e "${green} Quality ${NC}"
echo -e "${magenta} docker run --rm  -v /home/jenkins/.kube:/root/.kube -v $(pwd):/tmp --workdir /tmp -v /etc/passwd:/etc/passwd:ro -v /etc/group:/etc/group:ro --group-add 2000 --group-add 1101 --group-add 998 --group-add 789 quay.io/derailed/popeye --save --out html --output-file popeye.html --context devops-nabla --namespace nabla-standalone-aandrieu-pr -f k8s/spinach.yml  ${NC}"
docker run --rm  -v /home/jenkins/.kube:/root/.kube -v $(pwd):/tmp --workdir /tmp -v /etc/passwd:/etc/passwd:ro -v /etc/group:/etc/group:ro --group-add 2000 --group-add 1101 --group-add 998 --group-add 789 quay.io/derailed/popeye --save --out "html" --output-file "popeye.html" --context "devops-nabla" --namespace "nabla-standalone-aandrieu-pr" -f k8s/spinach.yml

echo -e "${magenta} sudo lynis audit dockerfile docker/ubuntu20/Dockerfile ${NC}"

exit 0
