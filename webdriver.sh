#!/bin/bash
set -eu

WORKING_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# shellcheck source=/dev/null
source "${WORKING_DIR}/scripts/step-0-color.sh"

export WEBDRIVER_CHROME_VERSION=${WEBDRIVER_CHROME_VERSION:-"101.0.4951.64"}

echo -e "${magenta} npm install -g bower@1.8.13 grunt-cli@1.4.3 webdriver-manager@12.1.8 ${NC}"

# NOK ./node_modules/webdriver-manager/bin/webdriver-manager update --versions.chrome ${WEBDRIVER_CHROME_VERSION}
echo -e "${magenta} ./node_modules/grunt-protractor-runner/node_modules/protractor/bin/webdriver-manager update --versions.chrome ${WEBDRIVER_CHROME_VERSION} ${NC}"
./node_modules/grunt-protractor-runner/node_modules/protractor/bin/webdriver-manager update --versions.chrome ${WEBDRIVER_CHROME_VERSION}

#npm run update-webdriver
echo -e "${magenta} webdriver-manager update --chrome --versions.chrome=${WEBDRIVER_CHROME_VERSION} ${NC}"

exit 0
