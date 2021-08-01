# testd-saas
testd saas platform

### Run below command for new setup
```sh
cp .env.example .env
```

### To run in docker
```sh
docker run \
  --name testd-dashboard \
  -e REACT_APP_API_URL=http://34.197.45.248:3001/api \
  -e REACT_APP_EXPLORER_URL=http://34.197.45.248:8080 \
  -e REACT_APP_CLIENT=dev1 \
  -p 3000:80 \
  -d \
  sarathkaleswaram/testd-dashboard:$DOCKER_IMAGE_VERION
```

### To run in docker-compose
```sh
docker-compose up -d
```

### To update docker image and push
```sh
docker build . -t sarathkaleswaram/testd-dashboard:<version>
docker push sarathkaleswaram/testd-dashboard:<version>
```