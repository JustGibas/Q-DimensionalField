import { assertEquals } from "https://deno.land/std@0.205.0/testing/asserts.ts";
import { superoak } from "https://deno.land/x/superoak@4.7.0/mod.ts";
import app from "../../backend/server.ts";

Deno.test("GET /users/:id", async () => {
  const request = await superoak(app);
  await request.get("/users/1")
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res) => {
      assertEquals(res.body.id, "1");
      assertEquals(res.body.name, "John Doe");
    });
});

Deno.test("POST /users", async () => {
  const request = await superoak(app);
  await request.post("/users")
    .send({ name: "Jane Doe", email: "jane@example.com", password: "password" })
    .expect(201)
    .expect("Content-Type", /json/)
    .expect((res) => {
      assertEquals(res.body.name, "Jane Doe");
      assertEquals(res.body.email, "jane@example.com");
    });
});

Deno.test("PUT /users/:id", async () => {
  const request = await superoak(app);
  await request.put("/users/1")
    .send({ name: "John Smith", email: "johnsmith@example.com", password: "newpassword" })
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res) => {
      assertEquals(res.body.name, "John Smith");
      assertEquals(res.body.email, "johnsmith@example.com");
    });
});

Deno.test("DELETE /users/:id", async () => {
  const request = await superoak(app);
  await request.delete("/users/1")
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res) => {
      assertEquals(res.body.message, "User deleted");
    });
});

Deno.test("GET /products/:id", async () => {
  const request = await superoak(app);
  await request.get("/products/1")
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res) => {
      assertEquals(res.body.id, "1");
      assertEquals(res.body.name, "Product 1");
    });
});

Deno.test("POST /products", async () => {
  const request = await superoak(app);
  await request.post("/products")
    .send({ name: "Product 2", price: 100, description: "Description of Product 2" })
    .expect(201)
    .expect("Content-Type", /json/)
    .expect((res) => {
      assertEquals(res.body.name, "Product 2");
      assertEquals(res.body.price, 100);
    });
});

Deno.test("PUT /products/:id", async () => {
  const request = await superoak(app);
  await request.put("/products/1")
    .send({ name: "Updated Product", price: 150, description: "Updated description" })
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res) => {
      assertEquals(res.body.name, "Updated Product");
      assertEquals(res.body.price, 150);
    });
});

Deno.test("DELETE /products/:id", async () => {
  const request = await superoak(app);
  await request.delete("/products/1")
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res) => {
      assertEquals(res.body.message, "Product deleted");
    });
});

Deno.test("GET /auth", async () => {
  const request = await superoak(app);
  await request.get("/auth")
    .expect(401)
    .expect("Content-Type", /json/)
    .expect((res) => {
      assertEquals(res.body.message, "Unauthorized");
    });
});

Deno.test("GET /auth with valid token", async () => {
  const request = await superoak(app);
  await request.get("/auth")
    .set("Authorization", "Bearer valid-token")
    .expect(200);
});

Deno.test("GET /auth with invalid token", async () => {
  const request = await superoak(app);
  await request.get("/auth")
    .set("Authorization", "Bearer invalid-token")
    .expect(401)
    .expect("Content-Type", /json/)
    .expect((res) => {
      assertEquals(res.body.message, "Unauthorized");
    });
});

Deno.test("GET /error", async () => {
  const request = await superoak(app);
  await request.get("/error")
    .expect(500)
    .expect("Content-Type", /json/)
    .expect((res) => {
      assertEquals(res.body.message, "Internal Server Error");
    });
});
