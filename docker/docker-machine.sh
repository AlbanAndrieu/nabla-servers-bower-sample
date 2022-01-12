#!/bin/bash
#set -xv
set -eu

docker-machine create -d "virtualbox" host1
docker-machine create -d "virtualbox" host2
docker-machine create -d "virtualbox" host3
#docker-machine create --driver generic --generic-ip-address=192.168.56.6 centos6
#On centos
#firewall-cmd --zone=public --add-port=2376/udp --permanent

docker-machine ls
eval $(docker-machine env host1)

docker run -d -p 8400:8400 -p 8500:8500 -p 8600:53/udp -h node1 progrium/consul -server -bootstrap -ui -dir /ui

http://192.168.99.100:8500/ui/#/dc1/services

docker-machine ssh host2
sudo su
nano /etc/docker/daemon.json

{
  "labels": ["perf=ssd"],
  "debug": true,
  "log-level": "debug",
  "cluster-store": "consul://192.168.99.100:8500/network",
  "cluster-advertise": "eth1:2376"
}
"hosts": ["tcp://0.0.0.0:2376", "unix:///var/run/docker.sock"],

/etc/init.d/docker restart

docker-machine restart host2
docker-machine restart host3

docker network create -d overlay --subnet 10.10.10.0/24 multinet

docker network ls

docker run -d --name=h1 --net=multinet alpine ping 127.0.0.1
docker run -d --name=h2 --net=multinet alpine ping h1

#etcd service cle-valeur

#docker run –d –p 5000:5000 registry:2.0 --restart always -name registry -v /mnt/registry:/var/lib/registry

exit 0
