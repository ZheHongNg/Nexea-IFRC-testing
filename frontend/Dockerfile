
# Use a Node 16 base image
FROM node:20-alpine3.17

# Set the working directory to /app inside the container
WORKDIR /app

# Copy app files
COPY package.json .

# ==== BUILD =====
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm install 

COPY . .

EXPOSE 3004

# Start the app
CMD [ "npm", "start" ]