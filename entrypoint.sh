#!/bin/bash
set -e

echo $* $(whoami)

#which java
#ls -lrta /usr/lib/jvm/
echo "JAVA_HOME : ${JAVA_HOME}"
#ls -lrta /usr/bin/java
java -version

if ! type "$1" &>/dev/null; then
  set -- java -jar "-Djava.io.tmpdir=$JETTY_TMP" "-Djetty.base=$JETTY_BASE" "$JETTY_HOME/start.jar" "$@"
fi

exec "$@"
