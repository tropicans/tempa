FROM node:20-slim AS base
WORKDIR /app

# Install ALL dependencies (including devDependencies for build)
FROM base AS builder
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production runner — only production deps + build output
FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY next.config.js ./
EXPOSE 3000
CMD ["npm", "run", "start"]
