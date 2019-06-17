#!/bin/bash
set -e

echo $* `whoami`

#which java
#ls -lrta /usr/lib/jvm/
echo "JAVA_HOME : ${JAVA_HOME}"
#ls -lrta /usr/bin/java
java -version

# check if there was a command passed
# required by Jenkins Docker plugin: https://github.com/docker-library/official-images#consistency
if [ "$1" ]; then
    # execute it
    exec "$@"
fi
