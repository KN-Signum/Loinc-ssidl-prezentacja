# Base stage
FROM node:lts-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Dev stage
FROM base AS dev
CMD ["npm", "run", "dev"]

# Build stage
FROM base AS builder
RUN npm run build

# Production stage
FROM node:lts-alpine AS prod
WORKDIR /app
COPY package*.json ./
# Make sure .env is copied if you need it, though environment variables should be injected by docker-compose
COPY .env ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 5001
CMD ["npm", "start"]