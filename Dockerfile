FROM node:10.21.0-alpine3.11 as testd-dashboard-build

# copy, install and build
WORKDIR /app
COPY . ./
RUN yarn install --network-timeout 500000
RUN yarn build

# production environment
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=testd-dashboard-build /app/build /usr/share/nginx/html
EXPOSE 80

# Copy .env file and shell script to container
WORKDIR /usr/share/nginx/html
COPY ./env.sh .
COPY .env .

# Add bash
RUN apk add --no-cache bash

# Make our shell script executable
RUN chmod +x env.sh

# Start Nginx server
CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]