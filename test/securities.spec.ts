import { createUser, loginUser } from "./testUtils";
import Database from "@ioc:Adonis/Lucid/Database";
import test from "japa";
import supertest from "supertest";

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;

test.group("Login", (group) => {
  let user;
  group.beforeEach(async () => {
    await Database.beginGlobalTransaction();
    user = await createUser();
  });

  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction();
  });

  test("should that return user not found", async (assert) => {
    const { body } = await supertest(BASE_URL).post("/login").send({
      email: "undefined@user.com",
      password: "test",
    });

    assert.equal(body.errors[0].message, "E_INVALID_AUTH_UID: User not found");
  });

  test("should that return password mis-match", async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post("/login")
      .send({ ...user, password: "badpassword" });

    assert.equal(
      body.errors[0].message,
      "E_INVALID_AUTH_PASSWORD: Password mis-match"
    );
  });

  test("should that return token with user information", async (assert) => {
    const { body } = await supertest(BASE_URL).post("/login").send(user);

    assert.hasAllKeys(body, ["token", "user"]);
    assert.hasAllKeys(body.user, [
      "id",
      "email",
      "full_name",
      "created_at",
      "updated_at",
    ]);
  });
});

test.group("Logout", (group) => {
  let user;
  group.beforeEach(async () => {
    await Database.beginGlobalTransaction();
    user = await loginUser(BASE_URL);
  });

  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction();
  });

  test("should that return unauthorized access", async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post("/logout")
      .set("Authorization", `Bearer badtoken`)
      .send();

    assert.equal(
      body.errors[0].message,
      "E_UNAUTHORIZED_ACCESS: Unauthorized access"
    );
  });

  test("should that invalidate the token", async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post("/logout")
      .set("Authorization", `Bearer ${user.token}`)
      .send();
    assert.equal(body.revoked, true);
  });
});
