FROM node:18-slim

# Install ffmpeg
RUN apt-get update && apt-get install -y \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY src/ ./src/

# Make CLI executable
RUN chmod +x ./src/index.js

# Create symlink for global access
RUN ln -s /app/src/index.js /usr/local/bin/auto-cut-ads

WORKDIR /data

ENTRYPOINT ["auto-cut-ads"]
