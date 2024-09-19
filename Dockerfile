# Base image
FROM node:18 as base
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Copy all other files
COPY . .

# Development build
FROM base as development
ENV NODE_ENV=development
EXPOSE 3333
CMD ["pnpm", "start"]

