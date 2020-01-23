#!/bin/sh

git clone https://github.com/stevespringett/nist-data-mirror.git
cd nist-data-mirro || exit 1
mvn clean package

NVD_ROOT=$1/`date -I`
mkdir target/$NVD_ROOT
JAR_PATH=target/nist-data-mirror.jar
java -jar $JAR_PATH target/$NVD_ROOT
cd target/$NVD_ROOT || exit 2
wget http://mirror.ufs.ac.za/misc/openvas-scap-data/nvdcve-2.0-2020.xml
#rm target/$NVD_ROOT/*.xml || true # D-C works directly with .gz files anyway.

exit 0
