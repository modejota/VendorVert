# Alpine Linux base image
FROM alpine:latest

# Create node user and install node and npm. Create directory for packages and set permissions
RUN adduser -S node && apk add --no-cache --update nodejs npm && mkdir /node_modules && chown node /node_modules

# Change to node user. Avoid using root user
USER node

# Modules will be installed in /node_modules
COPY package*.json ./

# Install dependencies (CI = Continuous Integration)
RUN npm ci && npm cache clean --force

# Container for tests. Move to that directory
WORKDIR /app

# We will start the app from here
EXPOSE 3030
ENTRYPOINT [ "npm", "run", "start" ]
