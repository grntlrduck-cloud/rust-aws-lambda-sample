GIT_COMMIT := $(shell git rev-parse --short HEAD)

ECR_BASE := 211125782845.dkr.ecr.eu-west-1.amazonaws.com

REPO_NAME := rust-lambda-sample

container/build:
	docker buildx build --platform linux/arm64 -t ${ECR_BASE}/${REPO_NAME}:${GIT_COMMIT} -t ${ECR_BASE}/${REPO_NAME}:latest .

container/push:
	docker push ${ECR_BASE}/${REPO_NAME}:${GIT_COMMIT}
	docker push ${ECR_BASE}/${REPO_NAME}:latest

container/all: container/build container/push

