REM OK TO RUN SERVER mvn clean install org.codehaus.cargo:cargo-maven2-plugin:run -Dserver=jetty9x -Pjacoco > deploy.log 2>&1

grunt phantomflow:websitetests --report

sudo apt-get install graphicsmagick

# examples/wraith
gem install wraith

# run the capture process
wraith capture demo

# view results in the browser
open shots/gallery.html
