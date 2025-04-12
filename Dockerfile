FROM nginx:alpine

# Install envsubst
RUN apk add --no-cache gettext

# Copy static files to Nginx's default public directory
COPY . /usr/share/nginx/html/

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Create entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expose port (will be overridden by Cloud Run)
EXPOSE 8080

# Start Nginx using the entrypoint script
ENTRYPOINT ["/docker-entrypoint.sh"]