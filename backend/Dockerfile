# Build stage
FROM node:lts-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Production stage
FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./
COPY .env ./

RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 5001

CMD ["npm", "start"]
