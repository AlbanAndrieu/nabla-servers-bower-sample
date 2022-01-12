provider "docker" {
  host = "tcp://localhost:2376"

  registry_auth {
    address     = "hub.docker.com"
    config_file = "~/.docker/config.json"
  }

  registry_auth {
    address     = "registry.albandrieu.com:8443"
    config_file = "~/.docker/config.json"
    #username = "aandrieu"
    #password = "todo"
  }
}

data "docker_registry_image" "ansible-jenkins-slave-docker" {
  name = "nabla/ansible-jenkins-slave-docker"
}

#data "docker_registry_image" "ansible-jenkins-slave" {
#  name = "aandrieu/ansible-jenkins-slave"
#}
