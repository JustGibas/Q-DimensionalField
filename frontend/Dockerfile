# Build stage
FROM rust:1.72 as builder

# Install Trunk and dependencies for building Yew
RUN cargo install trunk

WORKDIR /app
COPY . .

# Build the Yew app
RUN trunk build --release

# Serve stage
FROM nginx:alpine

# Copy the built files into NGINX's static folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose the default HTTP port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
