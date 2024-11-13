FROM denoland/deno:alpine

WORKDIR /app
COPY . .

# Cache and compile dependencies
RUN deno cache server.ts

# Expose the port for the Deno server
EXPOSE 8000

# Run the Deno server
CMD ["deno", "task", "start"]
