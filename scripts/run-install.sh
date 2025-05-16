#!/bin/bash
set -e

WORKING_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# shellcheck source=/dev/null
source "${WORKING_DIR}/step-0-color.sh"

# shellcheck disable=SC2154
echo -e "${magenta} sudo apt install chromium-chromedriver ${NC}"

nvm install 20.19.1

npm install -g grunt@1.5.3
npm install -g grunt-cli@1.4.3
npm install -g bower@1.8.13
# npm install -g bower-nexus3-resolver@1.0.4

gem cleanup all

# shellcheck disable=SC2154
echo -e "${magenta} sudo gem un install compass"
echo -e "${magenta} direnv allow"
gem update --system
sudo gem install ffi -v 1.17.0
gem install sass compass

echo -e "${green} Installing DONE. ${NC}"

exit 0
