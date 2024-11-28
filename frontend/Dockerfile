# Build stage
FROM denoland/deno:alpine as builder

# Set working directory
WORKDIR /app

# Copy the rest of the application code
COPY . .

# Build the application
RUN deno task build

# Serve stage
FROM nginx:alpine

# Copy the built files into NGINX's static folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose the default HTTP port
EXPOSE 80

CMD ["deno", "task", "start"]
