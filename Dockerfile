# Base image for all backend microservices
FROM node:22-alpine

WORKDIR /app

# Install dependencies first for efficient caching
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Generate Prisma client for Postgres
RUN npx prisma generate --schema=services/auth-service/prisma/schema.prisma

# Expose ports for all services
# 4000: Gateway, 4001: Auth, 4002: Users, 4003: Jobs, 4004: Applications, 4005: Admin
EXPOSE 4000 4001 4002 4003 4004 4005

# Default start command (can be overridden in docker-compose)
CMD ["npm", "run", "start:gateway"]
