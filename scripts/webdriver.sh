#!/bin/bash
set -eu

WORKING_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# shellcheck source=/dev/null
source "${WORKING_DIR}/step-0-color.sh"

# 116.0.5845.110
echo -e "${magenta} https://getwebdriver.com/ ${NC}"

# export WEBDRIVER_CHROME_VERSION=${WEBDRIVER_CHROME_VERSION:-"114.0.5735.90"} # 115.0.5790.98
# export WEBDRIVER_CHROME_VERSION=${WEBDRIVER_CHROME_VERSION:-"123.0.6312.122"}
# export WEBDRIVER_CHROME_VERSION=${WEBDRIVER_CHROME_VERSION:-"124.0.6367.207"} # stable
# export WEBDRIVER_CHROME_VERSION=${WEBDRIVER_CHROME_VERSION:-"125.0.6422.41"} # beta
export WEBDRIVER_CHROME_VERSION=${WEBDRIVER_CHROME_VERSION:-"126.0.6478.126"}

# echo -e "${magenta} npm install -g bower@1.8.14 grunt@1.5.3 webdriver-manager@13.0.2 ${NC}"

# See https://github.com/angular/protractor/issues/5563

# echo -e "${magenta} ./node_modules/grunt-protractor-runner/node_modules/protractor/bin/webdriver-manager update --versions.chrome ${WEBDRIVER_CHROME_VERSION} ${NC}"
# ./node_modules/grunt-protractor-runner/node_modules/protractor/bin/webdriver-manager clean
# ./node_modules/grunt-protractor-runner/node_modules/protractor/bin/webdriver-manager update # --versions.chrome ${WEBDRIVER_CHROME_VERSION}

#npm run update-webdriver
echo -e "${magenta} webdriver-manager update --chrome --versions.chrome=${WEBDRIVER_CHROME_VERSION} ${NC}"

# See https://www.npmjs.com/package/chromedriver

export CHROMEDRIVER_VERSION=${CHROMEDRIVER_VERSION:-"LATEST"}

echo -e "${magenta} npm install chromedriver ${NC}"

exit 0
