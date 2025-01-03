import { superoak } from "https://deno.land/x/superoak@4.0.0/mod.ts";
import { app } from "../../../backend/routes.ts";

Deno.test("POST /register - should create a new user", async () => {
  const request = await superoak(app);
  await request.post("/register")
    .send({ username: "testuser", password: "testpass" })
    .expect(201)
    .expect("Content-Type", /json/)
    .expect((res) => {
      if (!res.body.id) throw new Error("Missing user ID");
    });
});

Deno.test("GET /user/:id - should get a user by ID", async () => {
  const request = await superoak(app);
  await request.get("/user/1")
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res) => {
      if (!res.body.username) throw new Error("Missing username");
    });
});

Deno.test("PUT /user/:id - should update an existing user", async () => {
  const request = await superoak(app);
  await request.put("/user/1")
    .send({ username: "updateduser", password: "updatedpass" })
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res) => {
      if (res.body.username !== "updateduser") throw new Error("Username not updated");
    });
});

Deno.test("DELETE /user/:id - should delete a user by ID", async () => {
  const request = await superoak(app);
  await request.delete("/user/1")
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res) => {
      if (res.body.message !== "User deleted") throw new Error("User not deleted");
    });
});
