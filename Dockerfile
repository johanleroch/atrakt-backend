FROM motiadev/motia:latest

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your project
COPY . .

# Build the project
RUN npm run build

# Expose the port
EXPOSE 3000

# Start the server
CMD ["npx", "motia", "start"]
