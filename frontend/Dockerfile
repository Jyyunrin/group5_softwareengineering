# Stage 1: Build React app from node v22 latest version, name stage build
FROM node:22

# Set working directory to /app
WORKDIR /app

# Copies dependencies and run npm install
COPY package*.json ./
RUN npm install

# Copy rest of source into container and build
COPY . .

# Expose Vite port
EXPOSE 3000

# Run the dev server (hot reload, debugging, etc.)
CMD ["npm", "run", "dev"]