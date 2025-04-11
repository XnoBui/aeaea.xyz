docker buildx create --use
docker buildx build --platform linux/amd64 -t asia-southeast1-docker.pkg.dev/ortho-production/aeaea/prod:latest-soma --push .

