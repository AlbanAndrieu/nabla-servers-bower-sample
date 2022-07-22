#!/bin/bash
set -e

WORKING_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# shellcheck source=/dev/null
source "${WORKING_DIR}/step-0-color.sh"

cd "${WORKING_DIR}/../"

echo -e "${magenta} Cleaning started. ${NC}"

#package-lock.json yarn.lock
rm -Rf npm/ .node_cache/ .node_tmp/ .tmp/ .bower/ bower_components/ node/ node_modules/ .sass-cache/ .scannerwork/ .repository/ target/ target-eclipse/ build/ phantomas/ dist/ docs/groovydocs/ docs/js/ docs/partials/ site/ coverage/ report/
#docs/
#dist/bower_components/ dist/fonts/

rm -f checkstyle.xml docker-dockerfilelint.json || true
rm -f package-lock.json Pipfile.lock || true

echo -e "${magenta} NPM cleaning started. ${NC}"

npm --version
#npm cache clean || true
#npm cache verify

cd "${WORKING_DIR}"

echo -e "${green} Cleaning DONE. ${NC}"

exit 0
