FROM node:18-alpine

# Set working dir
WORKDIR /app

# Copy only package.json & lock file
COPY package*.json ./

# Install only inside container
RUN npm install

# Copy rest of app (excluding node_modules via ..dockerignore)
COPY . .

# Expose port
EXPOSE 3000

# Run app
CMD HOSTNAME="0.0.0.0" PORT="3000" node server.js