# Stage 1: Build Angular application using pnpm
FROM node:22-alpine AS builder

# Enable pnpm via corepack (pinned to v11.17.0 to match local environment and lockfile format)
RUN corepack enable && corepack prepare pnpm@11.17.0 --activate

WORKDIR /app

# Prevent pnpm from prompting for TTY confirmation
ENV CI=true

# Copy dependency files
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* .npmrc* ./

# Install dependencies
# --ignore-scripts bypasses ERR_PNPM_IGNORED_BUILDS: native binaries (esbuild,
# @parcel/watcher, etc.) ship as platform-specific optional packages, so their
# postinstall scripts are verification-only and not required for ng build.
RUN pnpm install --frozen-lockfile --ignore-scripts

# Copy application source
COPY . .

# Build Angular production bundle
# Invoke ng directly to bypass pnpm's runDepsStatusCheck which re-triggers ERR_PNPM_IGNORED_BUILDS
RUN ./node_modules/.bin/ng build

# Stage 2: Serve Angular SPA using Nginx with OWASP security headers
FROM nginx:alpine

# Install gettext for envsubst command
RUN apk add --no-cache gettext

# Copy built Angular application from builder stage
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html

# Copy custom OWASP security-hardened Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy entrypoint script for dynamic envsubst
COPY docker-entrypoint.sh /docker-entrypoint.sh

# Clean default assets and setup non-root execution permissions
RUN chmod +x /docker-entrypoint.sh && \
    rm -rf /usr/share/nginx/html/50x.html && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid /var/cache/nginx /var/log/nginx /usr/share/nginx/html/assets

USER nginx

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]



