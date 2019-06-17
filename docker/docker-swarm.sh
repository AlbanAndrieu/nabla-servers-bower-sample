#!/bin/bash
#set -xv
set -eu

docker swarm init --advertise-addr 192.168.99.100
docker swarm join-token manager
docker swarm join --token SWMTKN-1-1boem8bc83efxtic9g9kxjfrlpqqpb2la3u3iqvfpfe2k61eiq-dsk0b7mlreg8n4t3t70w7ie6n 192.168.99.100:2377
docker swarm join --token SWMTKN-1-1boem8bc83efxtic9g9kxjfrlpqqpb2la3u3iqvfpfe2k61eiq-5e71he18dnlqohst0b4oag76b 192.168.99.100:2377

docker service create --replicas 3 --name web2 -d -p 8080:80 nginx
docker service update --replicas 3 web2
#docker service update --mode global --name web3 -d -p 8080:80 nginx

docker node ls
docker service ls

docker service inspect --pretty web2
docker service logs web2
 
#Put monitoring on mode global pas replicas

docker node demote host3
docker node update --availability drain host2

docker service scale web2=4

http://192.168.99.100:8080/
http://192.168.99.101:8080/
http://192.168.99.102:8080/

docker service ps web2
docker service logs -f web2

docker-machine ssh host2 docker network ls

exit 0

