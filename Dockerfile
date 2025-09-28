# Use official Node.js image
FROM node:24-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package.json pnpm-lock.yaml* ./

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy rest of the application
COPY . .

# Build app
RUN pnpm run build

# Make entrypoint executable
RUN chmod +x ./entrypoint.sh

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]
CMD ["run"]
