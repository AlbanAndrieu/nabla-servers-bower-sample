provider "docker" {
  host = "tcp://localhost:2376"

  registry_auth {
    address = "registry.hub.docker.com"
    config_file = "~/.docker/config.json"
  }

  registry_auth {
    address = "https://registry.misys.global.ad/repositories/aandrieu/ansible-jenkins-slave"
    username = "aandrieu"
    password = "somepass"
  }
}

data "docker_registry_image" "ansible-jenkins-slave-docker" {
  name = "nabla/ansible-jenkins-slave-docker"
}

data "docker_registry_image" "ansible-jenkins-slave" {
  name = "registry.misys.global.ad/repositories/aandrieu/ansible-jenkins-slave"
}
