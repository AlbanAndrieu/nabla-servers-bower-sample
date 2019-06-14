#!/bin/bash
#set -xv
set -eu

#docker build -t my-haproxy -f ./debian/Dockerfile-haproxy .
#docker build -t server1 -f ./debian/Dockerfile-nginx1 .
#docker build -t server2 -f ./debian/Dockerfile-nginx2 .

docker network create test

docker volume create --opt type=btrfs --opt device=/dev/dbb1 data1

docker run -d -v sdb1:/mnt --name web0 --net test alpine ping 127.0.0.1

docker run -d --name web1 --net test server1
docker run -d --name web2 --net test server2
#docker cp ./static-html-directory/index1.html web1:/usr/share/nginx/html/index.html
#docker cp ./static-html-directory/index2.html web2:/usr/share/nginx/html/index.html
docker run -d --name my-haproxy -p 80:80 --net test -v /home/jenkins/nabla-servers-bower-sample/docker/etc/haproxy/:/usr/local/etc/haproxy:ro haproxy:1.9 haproxy -c -f /usr/local/etc/haproxy/haproxy.cfg
docker ps
docker logs web1
docker logs web2

echo "http://192.168.56.101/"

exit 0
