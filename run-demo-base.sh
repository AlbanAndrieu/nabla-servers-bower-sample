#!/bin/bash
[[ -n "$DEBUG" ]] &&  set -x

export JETTY_VERSION=9.3.3.v20150827

#Start jetty demo-base sample using cargo

export PROJECT_HOME=`pwd`
export CARGO_HOME="${PROJECT_HOME}/target/cargo"
export JETTY_HOME="${CARGO_HOME}/installs/jetty-distribution-${JETTY_VERSION}/jetty-distribution-${JETTY_VERSION}"
#Start jetty demo-base sample
#export JETTY_BASE="./installs/jetty-distribution-${JETTY_VERSION}/jetty-distribution-${JETTY_VERSION}/demo-base"
#Start jetty sample project
export JETTY_BASE="${CARGO_HOME}/configurations/jetty9x"

cd ${JETTY_HOME}
java -jar ${JETTY_HOME}/start.jar -Djetty.home=${JETTY_HOME} -Djetty.base=${JETTY_BASE}
#--daemon

echo "https://localhost:8443/"
