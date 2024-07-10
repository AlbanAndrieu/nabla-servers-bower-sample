DOCKER_NAME := $${CI_REGISTRY_IMAGE:-"nabla/nabla-servers-bower-sample"}
DOCKER_TAG := $${CI_COMMIT_REF_SLUG:-"latest"}
IMAGE := $(DOCKER_NAME):$(DOCKER_TAG)

.DEFAULT_GOAL := build

.PHONY: all
all: down clean lint build up dive

.PHONY: install
install:
	@echo "=> Installing..."
	scripts/webdriver.sh

.PHONY: rm
rm: clean
	@echo "=> Removing image..."
	docker rmi $(IMAGE)

.PHONY: clean
clean:
	@echo "=> Cleaning image..."
	scripts/clean.sh

.PHONY: lint
lint:
	@echo "=> Validating..."
	scripts/docker-validate.sh

.PHONY: build-docker-ci
build-docker-ci:
	@echo "=> Building image ci..."
	docker build -t $(IMAGE) .

.PHONY: build-docker
build-docker:
	@echo "=> Building image..."
	scripts/docker-build-runtime-22.sh

.PHONY: build-buildah-docker
build-buildah-docker:
	@echo "=> Building image..."
	buildah bud -t $(IMAGE) .

.PHONY: build
build:
	@echo "=> Building image..."
	./build.sh

.PHONY: up
up:
	@echo "up"

.PHONY: down
down:
	@echo "down"

.PHONY: run
run: down up

.PHONY: debug
debug:
	@echo "=> Debuging image..."
	docker run -it -u 1000:2000 -v /etc/passwd:/etc/passwd:ro -v /etc/group:/etc/group:ro -v /var/run/docker.sock:/var/run/docker.sock --entrypoint /bin/bash $(IMAGE)

.PHONY: dive
dive:
	@echo "=> Diving image..."
	CI=true dive --ci --json docker-dive-stats.json  $(IMAGE) 1>docker-dive.log 2>docker-dive-error.log

.PHONY: test
test:
	@echo "=> Testing image..."
	docker-inspect.sh

.PHONY: deploy
deploy:
	@echo "deploy"
