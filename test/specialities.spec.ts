import { SpecialityFactory } from "./../database/factories/SpecialityFactory";
import { loginUser } from "./testUtils";
import Database from "@ioc:Adonis/Lucid/Database";
import test from "japa";
import supertest from "supertest";

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;

test.group("Speciality list", (group) => {
  let user;
  group.beforeEach(async () => {
    await Database.beginGlobalTransaction();
    user = await loginUser(BASE_URL);
  });

  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction();
  });

  test("should that return an empty list", async (assert) => {
    const { body } = await supertest(BASE_URL)
      .get("/specialities")
      .set("Authorization", `Bearer ${user.token}`);

    assert.equal(body.length, 0);
  });

  test("should that return a list of specialities", async (assert) => {
    await SpecialityFactory.createMany(4);
    const { body, statusCode } = await supertest(BASE_URL)
      .get("/specialities")
      .set("Authorization", `Bearer ${user.token}`);

    assert.equal(statusCode, 200);
    assert.hasAllKeys(body[0], ["id", "name", "created_at", "updated_at"]);
  }).timeout(0);
});
