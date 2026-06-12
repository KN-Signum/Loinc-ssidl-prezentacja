# Base stage for dependencies
FROM node:lts-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Dev stage (runs vite server)
FROM base AS dev
CMD ["npm", "run", "dev", "--", "--host"]

# Build stage (compiles static files)
FROM base AS builder
RUN npm run build

# Prod stage (serves the static files)
FROM node:lts-alpine AS prod
RUN npm install -g serve
WORKDIR /app
COPY --from=builder /app/dist ./dist
EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]