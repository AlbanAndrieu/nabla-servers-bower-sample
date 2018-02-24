#!/bin/bash
set -xv

#sudo apt install phantomjs

./clean.sh

mvn clean install -Dserver=jetty9x

exit 0
