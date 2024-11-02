# the commit hash and the the current minute are used of the docker tag for image immutability, reproduceability, and teracea=bility
GIT_COMMIT := $(shell git rev-parse --short HEAD)
TAG_SUFFIX := $(shell date '+%Y%m%d%H%M')

ECR_BASE := 211125782845.dkr.ecr.eu-west-1.amazonaws.com

REPO_NAME := rust-lambda-sample

container/build:
	docker buildx build --platform linux/arm64 -t ${ECR_BASE}/${REPO_NAME}:${GIT_COMMIT}_${TAG_SUFFIX} .

container/push:
	docker push ${ECR_BASE}/${REPO_NAME}:${GIT_COMMIT}_${TAG_SUFFIX}

container/all: container/build container/push

