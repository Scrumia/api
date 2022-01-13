import { loginUser } from "./testUtils";
import Database from "@ioc:Adonis/Lucid/Database";
import test from "japa";
import supertest from "supertest";
import { AdventurerFactory } from "Database/factories/AdventurerFactory";

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;

test.group("Adventurers list", (group) => {
  let user;
  group.beforeEach(async () => {
    await Database.beginGlobalTransaction();
    user = await loginUser(BASE_URL);
  });

  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction();
  });

  test("should that return empty list", async (assert) => {
    const { body } = await supertest(BASE_URL)
      .get("/adventurers")
      .set("Authorization", `Bearer ${user.token}`);

    assert.equal(body.length, 0);
  });

  test("should that return list of adventurers", async (assert) => {
    await AdventurerFactory.with("speciality").createMany(5);

    const { body } = await supertest(BASE_URL)
      .get("/adventurers")
      .set("Authorization", `Bearer ${user.token}`);

    assert.equal(body.length, 5);
    assert.hasAllKeys(body[0], [
      "id",
      "full_name",
      "experience_level",
      "status",
      "speciality_id",
      "created_at",
      "updated_at",
      "speciality",
    ]);
    assert.hasAllKeys(body[0].speciality, [
      "id",
      "name",
      "created_at",
      "updated_at",
    ]);
  });
});

test.group("Get an adventurer by id", (group) => {
  let user;
  group.beforeEach(async () => {
    await Database.beginGlobalTransaction();
    user = await loginUser(BASE_URL);
  });

  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction();
  });

  test("should that return adventurer not found", async (assert) => {
    const { body, statusCode } = await supertest(BASE_URL)
      .get("/adventurers/1")
      .set("Authorization", `Bearer ${user.token}`);

    assert.equal(statusCode, 404);
    assert.equal(body.error, "Adventurer not found");
  });

  test("should that return adventurer", async (assert) => {
    const adventurer = await AdventurerFactory.with("speciality").create();
    const { body } = await supertest(BASE_URL)
      .get(`/adventurers/${adventurer.id}`)
      .set("Authorization", `Bearer ${user.token}`);

    assert.hasAllKeys(body, [
      "id",
      "full_name",
      "experience_level",
      "status",
      "speciality_id",
      "created_at",
      "updated_at",
      "speciality",
    ]);
    assert.hasAllKeys(body.speciality, [
      "id",
      "name",
      "created_at",
      "updated_at",
    ]);
  });
});
