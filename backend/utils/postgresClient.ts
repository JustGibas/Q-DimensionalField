import { Client } from "https://deno.land/x/postgres/mod.ts";

const client = new Client({
  user: Deno.env.get("DB_USER"),
  database: Deno.env.get("DB_NAME"),
  hostname: Deno.env.get("DB_HOST"),
  password: Deno.env.get("DB_PASSWORD"),
  port: parseInt(Deno.env.get("DB_PORT") || "5432"),
});

export async function connect() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL");
  } catch (error) {
    console.error("Failed to connect to PostgreSQL", error);
  }
}

export async function disconnect() {
  try {
    await client.end();
    console.log("Disconnected from PostgreSQL");
  } catch (error) {
    console.error("Failed to disconnect from PostgreSQL", error);
  }
}

export { client };
