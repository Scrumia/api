import test from "japa";
import supertest from "supertest";

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;

test.group("Documentation", () => {
  test("should that return response successfully", async () => {
    await supertest(BASE_URL).get("/docs/index.html").expect(200);
  });
});
