# Stage 1: Build Angular application using pnpm
FROM node:22-alpine AS builder

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Prevent pnpm from prompting for TTY confirmation
ENV CI=true

# Copy dependency files
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* .npmrc* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy application source
COPY . .

# Build Angular production bundle
# Invoke ng directly to bypass pnpm's runDepsStatusCheck which re-triggers ERR_PNPM_IGNORED_BUILDS
RUN ./node_modules/.bin/ng build

# Stage 2: Serve Angular SPA using Nginx with OWASP security headers
FROM nginx:alpine

# Copy built Angular application from builder stage (root owned for container immutability, docker:S6504)
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html

# Copy custom OWASP security-hardened Nginx configuration (root owned for container immutability, docker:S6504)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Clean default assets and setup non-root execution permissions (docker:S6471, S6504, S7031 compliance)
RUN rm -rf /usr/share/nginx/html/50x.html && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid /var/cache/nginx /var/log/nginx

USER nginx

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]



