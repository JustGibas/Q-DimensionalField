import { superoak } from "https://deno.land/x/superoak@4.0.0/mod.ts";
import { app } from "../../../backend/controllers/userController.ts";

Deno.test("GET /users/:id - should get a user by ID", async () => {
  const request = await superoak(app);
  await request.get("/users/1")
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res) => {
      if (!res.body.id) throw new Error("Missing user ID");
    });
});

Deno.test("POST /users - should create a new user", async () => {
  const request = await superoak(app);
  await request.post("/users")
    .send({ name: "John Doe", email: "john@example.com", password: "password" })
    .expect(201)
    .expect("Content-Type", /json/)
    .expect((res) => {
      if (!res.body.id) throw new Error("Missing user ID");
    });
});

Deno.test("PUT /users/:id - should update an existing user", async () => {
  const request = await superoak(app);
  await request.put("/users/1")
    .send({ name: "Jane Doe", email: "jane@example.com", password: "newpassword" })
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res) => {
      if (res.body.name !== "Jane Doe") throw new Error("Name not updated");
    });
});

Deno.test("DELETE /users/:id - should delete a user by ID", async () => {
  const request = await superoak(app);
  await request.delete("/users/1")
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res) => {
      if (res.body.message !== "User deleted") throw new Error("User not deleted");
    });
});
