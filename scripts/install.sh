#!/bin/bash
set -e

WORKING_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# shellcheck source=/dev/null
source "${WORKING_DIR}/step-0-color.sh"

# shellcheck disable=SC2154
echo -e "${magenta} sudo apt install chromium-chromedriver ${NC}"

nvm install 20.19.1

gem cleanup all

# shellcheck disable=SC2154
echo -e "${magenta} sudo gem un install compass"
gem install sass compass

echo -e "${green} Installing DONE. ${NC}"

exit 0
