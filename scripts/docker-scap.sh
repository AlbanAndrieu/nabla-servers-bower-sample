#!/bin/bash
set -xve

echo ########### Check ubuntu security #######

cd ${WORKSPACE}

git clone https://github.com/GovReady/ubuntu-scap.git || true
cd ubuntu-scap || true
rm -f ubuntu-xccdf.xml || true
wget http://fr1cslfrbm0059/download/ubuntu-xccdf.xml || true

#${WORKSPACE}/ubuntu-scap/run_tests.sh || true
${WORKSPACE}/ubuntu-scap/run_tests.sh

exit 0
