# ============================================
# Stage 1: Install dependencies
# ============================================
FROM node:22-alpine AS deps

WORKDIR /app

# Copy root workspace manifests for layer caching
COPY package.json package-lock.json ./

# Copy all workspace package.json files (required by npm ci for workspace resolution)
COPY apps/backend/package.json ./apps/backend/
COPY apps/web/package.json ./apps/web/
COPY packages/database/package.json ./packages/database/
COPY packages/shared/package.json ./packages/shared/

# Install all dependencies (including devDependencies for the build)
RUN npm ci

# ============================================
# Stage 2: Build the application
# ============================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage (npm workspaces hoists all deps to root node_modules)
COPY --from=deps /app/node_modules ./node_modules

# Copy root config files
COPY package.json ./

# Copy frontend source code
COPY apps/web/ ./apps/web/

# Build the Next.js application (produces .next/standalone)
ENV NEXT_TELEMETRY_DISABLED=1

# Next.js, NEXT_PUBLIC_* variables are inlined at build time.
# These ARG's are passed from Cloud Build with --build-arg.
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

RUN npm run build --workspace=apps/web

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
COPY --from=builder --chown=nextjs:nextjs /app/apps/web/.next/standalone ./
# Copy static assets generated during build
COPY --from=builder --chown=nextjs:nextjs /app/apps/web/.next/static ./apps/web/.next/static
# Copy public assets if they exist (favicon, images, etc.)
# NOTE: If a public/ folder is added in the future, uncomment the line below:
# COPY --from=builder --chown=nextjs:nextjs /app/apps/web/public ./apps/web/public

USER nextjs

# Expose the port (documentation only — Cloud Run sets PORT at runtime)
EXPOSE 8080

# Cloud Run injects the PORT env var; the standalone server reads it automatically.
# HOSTNAME 0.0.0.0 is required so the container listens on all interfaces.
ENV HOSTNAME="0.0.0.0"
CMD ["node", "apps/web/server.js"]
