#!/bin/bash
set -xv

#package-lock.json yarn.lock
rm -Rf npm/ .node_cache/ .node_tmp/  .tmp/ .bower/ bower_components/ node node_modules/ .sass-cache/ target/ target-eclipse/ build/ phantomas/ dist/ docs/groovydocs/ docs/js/ docs/partials/ site/ coverage/
#docs/
#dist/bower_components/ dist/fonts/

rm -f checkstyle.xml

exit 0
