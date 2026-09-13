# =============================================================================
# Multi-Stage Production Dockerfile for Anant (अनंत)
# Optimized for Node.js 20 on Alpine Linux with unprivileged non-root execution
# =============================================================================

# --- Stage 1: Build & Compilation ---
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies for native binaries
RUN apk add --no-cache python3 make g++

# Copy dependency manifests first for maximum Docker layer caching
COPY package*.json ./

# Install dependencies cleanly
RUN npm ci

# Copy full application source code
COPY . .

# Run production build (Vite Frontend + Express Server bundling via esbuild)
ENV NODE_ENV=production
RUN npm run build

# Prune devDependencies to keep image lean
RUN npm prune --production

# --- Stage 2: Minimal Distroless / Hardened Alpine Runtime ---
FROM node:20-alpine AS runner

WORKDIR /app

# Add security updates & dumb-init for proper process signal trapping (SIGTERM, SIGINT)
RUN apk add --no-cache dumb-init curl \
    && rm -rf /var/cache/apk/*

# Create dedicated non-root application user and group
RUN addgroup -g 1001 -S anantgroup \
    && adduser -u 1001 -S anantuser -G anantgroup

ENV NODE_ENV=production
ENV PORT=3000

# Copy node_modules and compiled dist outputs from builder
COPY --from=builder --chown=anantuser:anantgroup /app/node_modules ./node_modules
COPY --from=builder --chown=anantuser:anantgroup /app/dist ./dist
COPY --from=builder --chown=anantuser:anantgroup /app/package.json ./package.json

# Switch to unprivileged user
USER anantuser

# Expose standardized internal container port
EXPOSE 3000

# Healthcheck to ensure container availability
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Launch using dumb-init process supervisor
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "dist/server.cjs"]
