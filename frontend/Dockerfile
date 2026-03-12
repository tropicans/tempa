FROM node:20-slim AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
RUN npm ci --omit=dev

FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY .next ./.next
COPY public ./public
COPY next.config.js ./
EXPOSE 3000
CMD ["npm", "run", "start"]
