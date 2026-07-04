# ============================================
# Stage 1: Install dependencies
# ============================================
FROM node:22-alpine AS deps

WORKDIR /app

# Copy dependency manifests for layer caching
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies for the build)
RUN npm ci

# ============================================
# Stage 2: Build the application
# ============================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the Next.js application (produces .next/standalone)
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ============================================
# Stage 3: Production runner
# ============================================
FROM node:22-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN addgroup --system --gid 1001 nextjs && \
    adduser --system --uid 1001 nextjs

# Copy the standalone server output
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
# Copy static assets generated during build
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static
# Copy public assets if they exist (favicon, images, etc.)
# NOTE: If a public/ folder is added in the future, uncomment the line below:
# COPY --from=builder --chown=nextjs:nextjs /app/public ./public

USER nextjs

# Expose the port (documentation only — Cloud Run sets PORT at runtime)
EXPOSE 8080

# Cloud Run injects the PORT env var; the standalone server reads it automatically.
# HOSTNAME 0.0.0.0 is required so the container listens on all interfaces.
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
