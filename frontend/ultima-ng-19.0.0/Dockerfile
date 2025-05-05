FROM node:20.16.0-alpine AS build

ARG API_BASE_URL

# 1. Install build essentials and python3
RUN apk add --no-cache python3 make g++

WORKDIR /app

# 2. Use package-lock.json for deterministic installs
COPY package*.json ./
RUN npm ci --silent --legacy-peer-deps && \
    npm install -g @angular/cli@latest

# 3. Copy all files except those in .dockerignore
COPY . .

# 4. Use explicit environment file path
RUN sed -i "s|apiBaseUrl:.*|apiBaseUrl: '${API_BASE_URL}',|g" src/environments/environment.prod.ts

# 5. Build with production configuration
RUN npm run build -- --configuration production

FROM nginx:stable

# 6. Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# 7. Use proper file ownership
COPY --chown=nginx:nginx --from=build /app/dist/ultima-ng/browser/ /usr/share/nginx/html/

# 8. Replace default configuration
COPY default.conf /etc/nginx/conf.d/default.conf

# 9. Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl --fail http://localhost:4200 || exit 1

EXPOSE 4200