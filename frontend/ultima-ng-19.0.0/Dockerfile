FROM node:20.16.0-alpine AS build

# Define both URL arguments
ARG API_BASE_URL
ARG AUTH_SERVER_URL

# 1. Install build essentials and python3
RUN apk add --no-cache python3 make g++

WORKDIR /app

# 2. Copy package files first for better caching
COPY package*.json ./

# 3. Configure npm and install with retries
RUN npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-retries 5 && \
    npm install --legacy-peer-deps && \
    npm install -g @angular/cli@latest

# 4. Copy all files except those in .dockerignore
COPY . .

# 5. Update both URLs in the environment file
RUN if [ -n "$API_BASE_URL" ]; then \
      sed -i "s|apiBaseUrl:.*|apiBaseUrl: '$API_BASE_URL',|g" src/environments/environment.prod.ts; \
    fi && \
    if [ -n "$AUTH_SERVER_URL" ]; then \
      sed -i "s|authServer:.*|authServer: '$AUTH_SERVER_URL',|g" src/environments/environment.prod.ts; \
    fi

# 6. Build with production configuration
RUN npm run build -- --configuration production

FROM nginx:stable

# 7. Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# 8. Use proper file ownership
COPY --from=build /app/dist/ultima-ng/browser/ /usr/share/nginx/html/

# 9. Replace default configuration
COPY default.conf /etc/nginx/conf.d/default.conf

# 10. Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl --fail http://localhost:4200 || exit 1

EXPOSE 4200
