#Pre Steps

git clean -fdx
svn --version
echo USER $USER
bower cache clean
npm cache clean
echo PATH $PATH
export PATH=/zapSource/build/zap:$PATH
echo DISPLAY $DISPLAY

echo "ZAP_PORT : $ZAP_PORT"
echo "CARGO_RMI_PORT : $CARGO_RMI_PORT"
echo "JETTY_PORT : $JETTY_PORT"

#browser version
/usr/bin/firefox  -V
/usr/lib/firefox/firefox -V
/usr/bin/chromium-browser --version
/opt/google/chrome/chrome --version

lsof -i :$CARGO_RMI_PORT || true

#Run OWASP ZAP
#start zap using zapper plugin
#localhost:8090
#/zapSource

#TODO maven
#mvn -B -U -e -Dsurefire.useFile=false clean install -Dcargo.rmi.port=$CARGO_RMI_PORT -Djetty.port=$JETTY_PORT

#Post Steps

echo "ZAP_PORT : $ZAP_PORT"

# If Server is still running we will get its PID
PORT_WHERE_SERVER_MIGHT_RUN=$ZAP_PORT

PID=$(lsof -t -i:$PORT_WHERE_SERVER_MIGHT_RUN) || true

# -z is zero length (unset or empty string"
# if NOT zero length => then kill it...
if [ ! -z "$PID" ]; then
    echo "Found running Server at port: "$PORT_WHERE_SERVER_MIGHT_RUN" (PID: "$PID")"
    echo "I am killing that Server. A previous build seems to have gone wrong."
    # Kill it... hooray!
#    kill $PID

else
    echo "No running Server found at port "$PORT_WHERE_SERVER_MIGHT_RUN". This is what I'd anticipate. Great!"   
fi

#Post-build Actions

#Publish OWASP Dependency-Check analysis results
#target/**/dependency-check-report.xml

#Publish HTML reports
#build/reports/zaproxy/
#report.html
#ZaProxy Report
#Allow missing report

#Publish Performance test result report
#**/target/**/TEST-*.xml
