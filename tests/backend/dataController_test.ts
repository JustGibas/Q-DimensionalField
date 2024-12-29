import { superoak } from "https://deno.land/x/superoak@4.0.0/mod.ts";
import { app } from "../../../backend/controllers/dataController.ts";

Deno.test("GET /data - should get all data", async () => {
  const request = await superoak(app);
  await request.get("/data")
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res) => {
      if (!Array.isArray(res.body)) throw new Error("Response is not an array");
    });
});

Deno.test("POST /data - should insert new data", async () => {
  const request = await superoak(app);
  await request.post("/data")
    .send({ name: "Test Data", value: "12345" })
    .expect(201)
    .expect("Content-Type", /json/)
    .expect((res) => {
      if (!res.body.id) throw new Error("Missing data ID");
    });
});
