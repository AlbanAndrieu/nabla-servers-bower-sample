#/bin/bash

#docker build -t my-haproxy -f ./debian/Dockerfile-haproxy .
#docker build -t server1 -f ./debian/Dockerfile-nginx1 .
#docker build -t server2 -f ./debian/Dockerfile-nginx2 .

docker network create test

docker run -d --name web1 --net test server1
docker run -d --name web2 --net test server2
#docker cp ./static-html-directory/index1.html web1:/usr/share/nginx/html/index.html
#docker cp ./static-html-directory/index2.html web2:/usr/share/nginx/html/index.html
docker run -d -p 80:80 --net test my-haproxy
docker ps
docker logs web1
docker logs web2

echo "http://192.168.56.101/"

exit 0
