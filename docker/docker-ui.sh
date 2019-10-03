#!/bin/bash
#set -xv
set -eu

#https://portainer.readthedocs.io/en/stable/deployment.html#inside-a-swarm-cluster

mkdir /mnt/data

docker service create \
    --name portainer \
    --publish 9000:9000 \
    --replicas=1 \
    --constraint 'node.role == manager' \
    --mount type=bind,src=//mnt/data,dst=/data \
    portainer/portainer

#docker volume create portainer_data
#docker run -d -p 9000:9000 --name portainer --restart always -v /var/run/docker.sock:/var/run/docker.sock -v /mnt/data:/data portainer/portainer

#http://192.168.99.100:9000/

#https://hub.docker.com/r/dockersamples/visualizer

#docker run -it -d -p 8082:8080 -v /var/run/docker.sock:/var/run/docker.sock dockersamples/visualizer

#http://192.168.99.100:8082/

#https://hub.docker.com/r/google/cadvisor

#cadvisor

sudo docker run \
  --volume=/:/rootfs:ro \
  --volume=/var/run:/var/run:ro \
  --volume=/sys:/sys:ro \
  --volume=/var/lib/docker/:/var/lib/docker:ro \
  --volume=/dev/disk/:/dev/disk:ro \
  --publish=8081:8080 \
  --detach=true \
  --name=cadvisor \
  google/cadvisor:latest

#http://192.168.99.100:8081/containers/

exit 0
