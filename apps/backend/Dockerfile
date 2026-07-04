# ============================================
# Stage 1: Build
# ============================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency manifests first for layer caching
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies for compilation)
RUN npm ci

# Copy source code and config files needed for the build
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src/ src/

# Compile TypeScript to JavaScript
RUN npm run build

# ============================================
# Stage 2: Production
# ============================================
FROM node:22-alpine AS production

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy dependency manifests
COPY package.json package-lock.json* ./

# Install only production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled output from builder stage
COPY --from=builder /app/dist ./dist

# Create non-root user for security
RUN addgroup --system --gid 1001 nestjs && \
    adduser --system --uid 1001 nestjs
USER nestjs

# Expose the port (documentation only — Cloud Run sets PORT at runtime)
EXPOSE 8080

# Start the application
# Cloud Run injects the PORT environment variable; main.ts already reads it
CMD ["node", "dist/main"]
