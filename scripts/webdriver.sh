#!/bin/bash
set -eu

WORKING_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# shellcheck source=/dev/null
source "${WORKING_DIR}/step-0-color.sh"

# 116.0.5845.110
echo -e "${magenta} https://getwebdriver.com/ ${NC}"

# export WEBDRIVER_CHROME_VERSION=${WEBDRIVER_CHROME_VERSION:-"114.0.5735.90"}
# export WEBDRIVER_CHROME_VERSION=${WEBDRIVER_CHROME_VERSION:-"123.0.6312.122"}
# export WEBDRIVER_CHROME_VERSION=${WEBDRIVER_CHROME_VERSION:-"124.0.6367.207"} # stable
export WEBDRIVER_CHROME_VERSION=${WEBDRIVER_CHROME_VERSION:-"125.0.6422.41"} # beta

echo -e "${magenta} npm install -g bower@1.8.14 grunt@1.5.3 webdriver-manager@13.0.2 ${NC}"

# NOK ./node_modules/webdriver-manager/bin/webdriver-manager update --versions.chrome ${WEBDRIVER_CHROME_VERSION}
echo -e "${magenta} ./node_modules/grunt-protractor-runner/node_modules/protractor/bin/webdriver-manager update --versions.chrome ${WEBDRIVER_CHROME_VERSION} ${NC}"
./node_modules/grunt-protractor-runner/node_modules/protractor/bin/webdriver-manager clean
./node_modules/grunt-protractor-runner/node_modules/protractor/bin/webdriver-manager update # --versions.chrome ${WEBDRIVER_CHROME_VERSION}

#npm run update-webdriver
echo -e "${magenta} webdriver-manager update --chrome --versions.chrome=${WEBDRIVER_CHROME_VERSION} ${NC}"

exit 0
