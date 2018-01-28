#!/bin/bash
set -xv

./clean.sh

mvn clean install -Dserver=jetty9x

exit 0
