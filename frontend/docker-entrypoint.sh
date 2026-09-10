#!/bin/sh
set -e

# Substitute API_URL in env.template.js to create env.js dynamically at container startup
if [ -f /usr/share/nginx/html/assets/env.template.js ]; then
  envsubst '${API_URL}' < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js
fi

exec "$@"
