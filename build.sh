#!/bin/bash
set -xv

#sudo apt install phantomjs

./clean.sh

#mvn clean install -Dserver=jetty9x
mvnw install

#sudo npm install -g npm-license
npm-license || true

exit 0
