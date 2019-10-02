#!/bin/bash
set -e

WORKING_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}"  )" && pwd  )"

# shellcheck source=/dev/null
tput colors && source "${WORKING_DIR}/step-0-color.sh"

echo -e "${magenta} Cleaning started. ${NC}"

#package-lock.json yarn.lock
rm -Rf npm/ .node_cache/ .node_tmp/ .tmp/ .bower/ bower_components/ node/ node_modules/ .sass-cache/ .scannerwork/ target/ target-eclipse/ build/ phantomas/ dist/ docs/groovydocs/ docs/js/ docs/partials/ site/ coverage/
#docs/
#dist/bower_components/ dist/fonts/

rm -f checkstyle.xml

echo -e "${green} Cleaning DONE. ${NC}"

exit 0
