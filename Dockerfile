FROM node:20-alpine

WORKDIR /app

# Install OpenSSL for Prisma engine
RUN apk add --no-cache openssl

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy prisma schema for client generation
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Expose port
EXPOSE 3000

# Dev startup: run migrations, seed, then start dev server
CMD sh -c "npx prisma migrate deploy 2>/dev/null || npx prisma migrate dev --name init && npx prisma db seed 2>/dev/null; npm run dev"
