FROM node:24-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY backend/package.json backend/package.json
COPY prisma prisma
RUN npm install

FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules node_modules
COPY . .
RUN npm run prisma:generate && npm run build --workspace backend

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/backend/dist backend/dist
COPY --from=builder /app/prisma prisma
COPY package*.json ./
COPY backend/package.json backend/package.json
EXPOSE 4000
CMD ["npm", "run", "start", "--workspace", "backend"]
