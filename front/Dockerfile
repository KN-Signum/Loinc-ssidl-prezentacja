# Build stage
FROM node:lts-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Production stage - serve static files
FROM node:lts-alpine

WORKDIR /app

RUN npm install -g http-server

COPY --from=builder /app/build ./build

EXPOSE 5173

CMD ["http-server", "build", "-p", "5173", "--cors"]
