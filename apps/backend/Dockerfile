# ============================================
# Stage 1: Build
# ============================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy root workspace manifests for layer caching
COPY package.json package-lock.json ./

# Copy all workspace package.json files (required by npm ci for workspace resolution)
COPY apps/backend/package.json ./apps/backend/
COPY apps/web/package.json ./apps/web/
COPY packages/database/package.json ./packages/database/
COPY packages/shared/package.json ./packages/shared/

# Install all dependencies (including devDependencies for compilation)
RUN npm ci

# Copy backend source code and config files needed for the build
COPY apps/backend/tsconfig.json apps/backend/tsconfig.build.json apps/backend/nest-cli.json ./apps/backend/
COPY apps/backend/src/ ./apps/backend/src/

# Compile TypeScript to JavaScript
RUN npm run build --workspace=apps/backend

# ============================================
# Stage 2: Production
# ============================================
FROM node:22-alpine AS production

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy root workspace manifests
COPY package.json package-lock.json ./

# Copy all workspace package.json files (required by npm ci for workspace resolution)
COPY apps/backend/package.json ./apps/backend/
COPY apps/web/package.json ./apps/web/
COPY packages/database/package.json ./packages/database/
COPY packages/shared/package.json ./packages/shared/

# Install only production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled output from builder stage
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist

# Create non-root user for security
RUN addgroup --system --gid 1001 nestjs && \
    adduser --system --uid 1001 nestjs
USER nestjs

WORKDIR /app/apps/backend

# Expose the port (documentation only — Cloud Run sets PORT at runtime)
EXPOSE 8080

# Start the application
# Cloud Run injects the PORT environment variable; main.ts already reads it
CMD ["node", "dist/main"]
