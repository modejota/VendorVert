FROM node:18-alpine
LABEL version="1.0" maintainer="modej@correo.ugr.es"

# Create node_modules directory and set permissions
RUN mkdir /node_modules && chown node /node_modules

# Change to node user. Avoid using root user
USER node

# Modules will be installed in /node_modules
COPY package*.json ./

# Install dependencies (CI = Continuous Integration)
RUN npm ci && npm cache clean --force

# Container for tests. Move to that directory
WORKDIR /app/test

# We will execute the tests
ENTRYPOINT [ "npm", "run", "test" ]