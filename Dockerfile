# Use Node.js as the base image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the TypeScript files
RUN npm run build

# Expose the application's port
EXPOSE 5050

# Start the application
CMD ["npm", "start"]
