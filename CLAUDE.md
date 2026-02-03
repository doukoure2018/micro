# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Microservices-based credit/banking platform with Angular 19 frontend and Spring Boot 3.4.3 backend services.

## Build & Development Commands

### Backend (Java/Maven)

```bash
# Build all microservices (skip tests)
cd micro-digiservices
mvn -ntp -B install -DskipTests

# Build single microservice
cd micro-digiservices/ecreditservice
mvn clean verify -DskipTests

# Build Docker images with Jib
mvn -ntp -B verify -DskipTests jib:dockerBuild
```

### Frontend (Angular)

```bash
cd frontend/ultima-ng-19.0.0

npm install          # Install dependencies
npm start            # Dev server at http://localhost:4200
npm run build        # Production build
npm run test         # Run tests
npm run format       # Prettier formatting
```

### Docker Compose

```bash
# Start all services
docker-compose --env-file .env up -d

# Start specific service
docker-compose --env-file .env up -d ecreditservice

# View logs
docker-compose logs -f ecreditservice
```

### Database Migrations

Flyway migrations in `micro-digiservices/database-migrations/src/main/resources/db/migration/`.
Format: `V{number}__{description}.sql`. Migrations run automatically on Docker Compose startup.

## Architecture

```
Frontend (Angular 19, Port 4200)
    ↓
Gateway (Spring Cloud Gateway, Port 8000)
    ├── Authorization Server (OAuth2, Port 8080)
    ├── User Service (Port 8085)
    ├── E-Credit Service (Core business, Port 8087)
    ├── E-Banking Service (Port 8081)
    └── Notification Service (Kafka consumer, Port 8086)

Infrastructure:
├── Discovery Server (Eureka, Port 5002)
├── PostgreSQL (Port 5432, database: localdb)
├── Kafka (Port 9092)
└── pgAdmin (Port 7000)
```

## Key Microservices

| Service | Port | Purpose |
|---------|------|---------|
| `gateway` | 8000 | API routing, rate limiting |
| `authorizationserver` | 8080 | OAuth2/JWT authentication |
| `discoveryserver` | 5002 | Eureka service registry |
| `userservice` | 8085 | User management |
| `ecreditservice` | 8087 | Core credit business logic |
| `ebankingservice` | 8081 | Banking integration (SQL Server) |
| `notificationservice` | 8086 | Email/SMS via Kafka events |

## Backend Code Structure

Each microservice follows this package structure under `io.digiservices.{servicename}`:

- `resource/` - REST controllers
- `service/` - Business logic
- `dto/` - Data transfer objects
- `domain/` - JPA entities
- `repository/` - Data access layer
- `exception/` - Custom exceptions
- `validation/` - Request validators

## Frontend Code Structure

Angular 19 with standalone components in `frontend/ultima-ng-19.0.0/src/app/`:

- `pages/auth/` - Authentication-related pages
- `pages/dashboard/` - Dashboard components (agent-credit, credit management)
- `interface/` - TypeScript interfaces
- `service/` - Angular services
- `layout/` - App layout components

UI Stack: PrimeNG 19, TailwindCSS 3.4, Quill editor

## Tech Stack

**Backend**: Java 21 (GraalVM), Spring Boot 3.4.3, Spring Cloud 2024.0.1, PostgreSQL 16, Kafka
**Frontend**: Angular 19, PrimeNG, TailwindCSS, TypeScript
**Auth**: OAuth2 Authorization Server, JWT tokens
**Build**: Maven, npm, Docker/Jib
**CI/CD**: GitHub Actions → Docker Hub → OVH Cloud

## Configuration Files

- Backend: `application.yml`, `application-docker.yml`, `application-prod.yml`
- Environment: `.env`, `.env.docker`, `.env.prod`
- Frontend: `angular.json`, `environments/environment.ts`

## File Upload

E-Credit Service handles file uploads:
- Request limit: 10MB
- File limit: 50MB
- Storage: `./uploads/` directory
