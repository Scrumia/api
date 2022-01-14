import { DateTime } from "luxon";
import Faker from "faker";
import { RequestFactory } from "./../database/factories/RequestFactory";
import { loginUser } from "./testUtils";
import Database from "@ioc:Adonis/Lucid/Database";
import test from "japa";
import supertest from "supertest";
import { AdventurerFactory } from "Database/factories/AdventurerFactory";
import Adventurer from "App/Models/Adventurer";
import RequestStatusEnum from "App/Enums/RequestStatusEnum";
import AdventurerStatusEnum from "App/Enums/AdventurerStatusEnum";

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;

test.group("Request list", (group) => {
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
      .get("/requests")
      .set("Authorization", `Bearer ${user.token}`);
    assert.equal(body.length, 0);
  });

  test("should that return Request list", async (assert) => {
    const requests = await RequestFactory.createMany(10);
    const adventurers = await AdventurerFactory.with("speciality").createMany(
      5
    );

    for (const request of requests) {
      await request
        .related("adventurers")
        .attach([adventurers[Faker.datatype.number({ min: 0, max: 4 })].id]);
    }

    const { body } = await supertest(BASE_URL)
      .get("/requests")
      .set("Authorization", `Bearer ${user.token}`);

    assert.equal(body.length, 10);
    assert.hasAllKeys(body[0], [
      "id",
      "name",
      "description",
      "bounty",
      "status",
      "duration",
      "started_at",
      "expiration_date",
      "client_name",
      "adventurers",
      "created_at",
      "updated_at",
    ]);

    assert.hasAllKeys(body[0].adventurers[0], [
      "id",
      "full_name",
      "experience_level",
      "status",
      "speciality_id",
      "created_at",
      "updated_at",
    ]);
  }).timeout(0);
});

test.group("Get a request by id", (group) => {
  let user;
  group.beforeEach(async () => {
    await Database.beginGlobalTransaction();
    user = await loginUser(BASE_URL);
  });

  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction();
  });

  test("should that return request not found", async (assert) => {
    const { body, statusCode } = await supertest(BASE_URL)
      .get("/requests/1")
      .set("Authorization", `Bearer ${user.token}`);

    assert.equal(statusCode, 404);
    assert.equal(body.error, "Request not found");
  });

  test("should that return a request", async (assert) => {
    const request = await RequestFactory.create();
    const adventurers = await AdventurerFactory.with("speciality").createMany(
      3
    );
    const adventurerIds = adventurers.map((adventurer) => adventurer.id);
    await request.related("adventurers").attach(adventurerIds);

    const { body } = await supertest(BASE_URL)
      .get(`/requests/${request.id}`)
      .set("Authorization", `Bearer ${user.token}`);

    assert.hasAllKeys(body, [
      "id",
      "name",
      "description",
      "bounty",
      "status",
      "duration",
      "started_at",
      "expiration_date",
      "client_name",
      "adventurers",
      "created_at",
      "updated_at",
    ]);

    assert.hasAllKeys(body.adventurers[0], [
      "id",
      "full_name",
      "status",
      "experience_level",
      "speciality_id",
      "created_at",
      "updated_at",
      "speciality",
    ]);

    assert.hasAllKeys(body.adventurers[0].speciality, [
      "id",
      "name",
      "created_at",
      "updated_at",
    ]);
  }).timeout(0);
});

test.group("Remove an adventurer from a request", (group) => {
  let user;
  group.beforeEach(async () => {
    await Database.beginGlobalTransaction();
    user = await loginUser(BASE_URL);
  });

  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction();
  });

  test("should that return request not found", async (assert) => {
    const { body, statusCode } = await supertest(BASE_URL)
      .delete("/requests/1/adventurers/1")
      .set("Authorization", `Bearer ${user.token}`);
    assert.equal(statusCode, 404);
    assert.equal(body.error, "Request or adventurer not found");
  });

  test("should that return cannot delete an adventurer on started/finished request", async (assert) => {
    const request = await RequestFactory.merge({ status: "started" }).create();
    const adventurer = await AdventurerFactory.with("speciality").create();
    await request.related("adventurers").attach([adventurer.id]);

    const { body, statusCode } = await supertest(BASE_URL)
      .delete(`/requests/${request.id}/adventurers/${adventurer.id}`)
      .set("Authorization", `Bearer ${user.token}`);
    assert.equal(statusCode, 400);
    assert.equal(
      body.error,
      "You can't delete an adventurer : The request already started or finished"
    );
  });

  test("should that remove adventurer from a request", async (assert) => {
    const request = await RequestFactory.merge({ status: "pending" }).create();
    const adventurer = await AdventurerFactory.with("speciality").create();
    await request.related("adventurers").attach([adventurer.id]);

    const { status } = await supertest(BASE_URL)
      .delete(`/requests/${request.id}/adventurers/${adventurer.id}`)
      .set("Authorization", `Bearer ${user.token}`);

    assert.equal(status, 204);

    const adventurerUpdated = await Adventurer.find(adventurer.id);
    assert.equal(adventurerUpdated?.status, "available");
  }).timeout(0);
});

test.group("Create a request", (group) => {
  let user;
  group.beforeEach(async () => {
    await Database.beginGlobalTransaction();
    user = await loginUser(BASE_URL);
  });

  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction();
  });

  test("should that return name is too long |  > 120 caracters ", async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post("/requests")
      .set("Authorization", `Bearer ${user.token}`)
      .send({
        name: Faker.lorem.words(150),
        description: Faker.lorem.words(2),
        client_name: Faker.lorem.words(2),
        bounty: Faker.datatype.number(100),
        duration: Faker.datatype.number(100),
        started_at: DateTime.now()
          .plus({ day: 1 })
          .toFormat("yyyy-MM-dd HH:mm:ss"),
        expiration_date: DateTime.now()
          .plus({ day: 6 })
          .toFormat("yyyy-MM-dd HH:mm:ss"),
      });

    assert.equal(body.errors[0].message, "maxLength validation failed");
  });

  test("should that return description is too long |  > 500 caracters ", async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post("/requests")
      .set("Authorization", `Bearer ${user.token}`)
      .send({
        name: Faker.lorem.words(1),
        description: Faker.lorem.words(150),
        client_name: Faker.lorem.words(2),
        bounty: Faker.datatype.number(100),
        duration: Faker.datatype.number(100),
        started_at: DateTime.now()
          .plus({ day: 1 })
          .toFormat("yyyy-MM-dd HH:mm:ss"),
        expiration_date: DateTime.now()
          .plus({ day: 6 })
          .toFormat("yyyy-MM-dd HH:mm:ss"),
      });

    assert.equal(body.errors[0].message, "maxLength validation failed");
  });

  test("should that return client name is too long |  > 50 caracters ", async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post("/requests")
      .set("Authorization", `Bearer ${user.token}`)
      .send({
        name: Faker.lorem.words(1),
        description: Faker.lorem.words(2),
        client_name: Faker.lorem.words(150),
        bounty: Faker.datatype.number(100),
        duration: Faker.datatype.number(100),
        started_at: DateTime.now()
          .plus({ day: 1 })
          .toFormat("yyyy-MM-dd HH:mm:ss"),
        expiration_date: DateTime.now()
          .plus({ day: 6 })
          .toFormat("yyyy-MM-dd HH:mm:ss"),
      });

    assert.equal(body.errors[0].message, "maxLength validation failed");
  });

  test("should that return started_at and expiration_date are sended with bad format", async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post("/requests")
      .set("Authorization", `Bearer ${user.token}`)
      .send({
        name: Faker.lorem.words(2),
        description: Faker.lorem.words(2),
        client_name: Faker.lorem.words(2),
        bounty: Faker.datatype.number(100),
        duration: Faker.datatype.number(100),
        started_at: "ee",
        expiration_date: "2022",
      });

    assert.equal(
      body.errors[0].message,
      `the input "ee" can't be parsed as format yyyy-MM-dd HH:mm:ss`
    );
  });

  test("should that return started_at and expiration_date has bad values", async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post("/requests")
      .set("Authorization", `Bearer ${user.token}`)
      .send({
        name: Faker.lorem.words(2),
        description: Faker.lorem.words(2),
        client_name: Faker.lorem.words(2),
        bounty: Faker.datatype.number(100),
        duration: Faker.datatype.number(100),
        started_at: DateTime.now().toFormat("yyyy-MM-dd HH:mm:ss"),
        expiration_date: DateTime.now().toFormat("yyyy-MM-dd HH:mm:ss"),
      });

    assert.equal(body.errors[0].message, `after date validation failed`);
  });

  test("should that return bounty value is not in range", async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post("/requests")
      .set("Authorization", `Bearer ${user.token}`)
      .send({
        name: Faker.lorem.words(2),
        description: Faker.lorem.words(2),
        client_name: Faker.lorem.words(2),
        bounty: Faker.datatype.number(-1),
        duration: Faker.datatype.number(100),
        started_at: DateTime.now()
          .plus({ days: 2 })
          .toFormat("yyyy-MM-dd HH:mm:ss"),
        expiration_date: DateTime.now()
          .plus({ days: 15 })
          .toFormat("yyyy-MM-dd HH:mm:ss"),
      });

    assert.equal(body.errors[0].message, `range validation failed`);
  });

  test("should that return duration value is not in range", async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post("/requests")
      .set("Authorization", `Bearer ${user.token}`)
      .send({
        name: Faker.lorem.words(2),
        description: Faker.lorem.words(2),
        client_name: Faker.lorem.words(2),
        bounty: Faker.datatype.number(1),
        duration: Faker.datatype.number(1555555555),
        started_at: DateTime.now()
          .plus({ days: 2 })
          .toFormat("yyyy-MM-dd HH:mm:ss"),
        expiration_date: DateTime.now()
          .plus({ days: 15 })
          .toFormat("yyyy-MM-dd HH:mm:ss"),
      });

    assert.equal(body.errors[0].message, `range validation failed`);
  });

  test("should that return duration value is not in range", async (assert) => {
    const { statusCode } = await supertest(BASE_URL)
      .post("/requests")
      .set("Authorization", `Bearer ${user.token}`)
      .send({
        name: Faker.lorem.words(2),
        description: Faker.lorem.words(2),
        client_name: Faker.lorem.words(2),
        bounty: Faker.datatype.number(1),
        duration: Faker.datatype.number(10),
        started_at: DateTime.now()
          .plus({ days: 2 })
          .toFormat("yyyy-MM-dd HH:mm:ss"),
        expiration_date: DateTime.now()
          .plus({ days: 15 })
          .toFormat("yyyy-MM-dd HH:mm:ss"),
      });

    assert.equal(statusCode, 201);
  });
});

test.group("Update a request", (group) => {
  let user;
  group.beforeEach(async () => {
    await Database.beginGlobalTransaction();
    user = await loginUser(BASE_URL);
  });

  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction();
  });

  test("should that return name is too long |  > 120 caracters ", async (assert) => {
    const { body } = await supertest(BASE_URL)
      .put("/requests/1")
      .set("Authorization", `Bearer ${user.token}`)
      .send({
        name: Faker.lorem.words(150),
        description: Faker.lorem.words(2),
        client_name: Faker.lorem.words(2),
        bounty: Faker.datatype.number(100),
        duration: Faker.datatype.number(100),
        started_at: DateTime.now()
          .plus({ day: 1 })
          .toFormat("yyyy-MM-dd HH:mm:ss"),
        expiration_date: DateTime.now()
          .plus({ day: 6 })
          .toFormat("yyyy-MM-dd HH:mm:ss"),
        status: Faker.random.arrayElement(
          RequestStatusEnum.valuesString.split(",")
        ),
      });

    assert.equal(body.errors[0].message, "maxLength validation failed");
  });

  test("should that return description is too long |  > 500 caracters ", async (assert) => {
    const { body } = await supertest(BASE_URL)
      .put("/requests/1")
      .set("Authorization", `Bearer ${user.token}`)
      .send({
        name: Faker.lorem.words(1),
        description: Faker.lorem.words(150),
        client_name: Faker.lorem.words(2),
        bounty: Faker.datatype.number(100),
        duration: Faker.datatype.number(100),
        started_at: DateTime.now()
          .plus({ day: 1 })
          .toFormat("yyyy-MM-dd HH:mm:ss"),
        expiration_date: DateTime.now()
          .plus({ day: 6 })
          .toFormat("yyyy-MM-dd HH:mm:ss"),
        status: Faker.random.arrayElement(
          RequestStatusEnum.valuesString.split(",")
        ),
      });

    assert.equal(body.errors[0].message, "maxLength validation failed");
  });

  test("should that return client name is too long |  > 50 caracters ", async (assert) => {
    const { body } = await supertest(BASE_URL)
      .put("/requests/1")
      .set("Authorization", `Bearer ${user.token}`)
      .send({
        name: Faker.lorem.words(1),
        description: Faker.lorem.words(2),
        client_name: Faker.lorem.words(150),
        bounty: Faker.datatype.number(100),
        duration: Faker.datatype.number(100),
        started_at: DateTime.now()
          .plus({ day: 1 })
          .toFormat("yyyy-MM-dd HH:mm:ss"),
        expiration_date: DateTime.now()
          .plus({ day: 6 })
          .toFormat("yyyy-MM-dd HH:mm:ss"),
        status: Faker.random.arrayElement(
          RequestStatusEnum.valuesString.split(",")
        ),
      });

    assert.equal(body.errors[0].message, "maxLength validation failed");
  });

  test("should that return started_at and expiration_date are sended with bad format", async (assert) => {
    const { body } = await supertest(BASE_URL)
      .put("/requests/1")
      .set("Authorization", `Bearer ${user.token}`)
      .send({
        name: Faker.lorem.words(2),
        description: Faker.lorem.words(2),
        client_name: Faker.lorem.words(2),
        bounty: Faker.datatype.number(100),
        duration: Faker.datatype.number(100),
        started_at: "ee",
        expiration_date: "2022",
        status: Faker.random.arrayElement(
          RequestStatusEnum.valuesString.split(",")
        ),
      });

    assert.equal(
      body.errors[0].message,
      `the input "ee" can't be parsed as format yyyy-MM-dd HH:mm:ss`
    );
  });

  test("should that return started_at and expiration_date has bad values", async (assert) => {
    const { body } = await supertest(BASE_URL)
      .put("/requests/1")
      .set("Authorization", `Bearer ${user.token}`)
      .send({
        name: Faker.lorem.words(2),
        description: Faker.lorem.words(2),
        client_name: Faker.lorem.words(2),
        bounty: Faker.datatype.number(100),
        duration: Faker.datatype.number(100),
        started_at: DateTime.now().toFormat("yyyy-MM-dd HH:mm:ss"),
        expiration_date: DateTime.now().toFormat("yyyy-MM-dd HH:mm:ss"),
        status: Faker.random.arrayElement(
          RequestStatusEnum.valuesString.split(",")
        ),
      });

    assert.equal(body.errors[0].message, `after date validation failed`);
  });

  test("should that return bounty value is not in range", async (assert) => {
    const { body } = await supertest(BASE_URL)
      .put("/requests/1")
      .set("Authorization", `Bearer ${user.token}`)
      .send({
        name: Faker.lorem.words(2),
        description: Faker.lorem.words(2),
        client_name: Faker.lorem.words(2),
        bounty: Faker.datatype.number(-1),
        duration: Faker.datatype.number(100),
        started_at: DateTime.now()
          .plus({ days: 2 })
          .toFormat("yyyy-MM-dd HH:mm:ss"),
        expiration_date: DateTime.now()
          .plus({ days: 15 })
          .toFormat("yyyy-MM-dd HH:mm:ss"),
        status: Faker.random.arrayElement(
          RequestStatusEnum.valuesString.split(",")
        ),
      });

    assert.equal(body.errors[0].message, `range validation failed`);
  });

  test("should that return duration value is not in range", async (assert) => {
    const { body } = await supertest(BASE_URL)
      .put("/requests/1")
      .set("Authorization", `Bearer ${user.token}`)
      .send({
        name: Faker.lorem.words(2),
        description: Faker.lorem.words(2),
        client_name: Faker.lorem.words(2),
        bounty: Faker.datatype.number(1),
        duration: Faker.datatype.number(1555555555),
        started_at: DateTime.now()
          .plus({ days: 2 })
          .toFormat("yyyy-MM-dd HH:mm:ss"),
        expiration_date: DateTime.now()
          .plus({ days: 15 })
          .toFormat("yyyy-MM-dd HH:mm:ss"),
        status: Faker.random.arrayElement(
          RequestStatusEnum.valuesString.split(",")
        ),
      });

    assert.equal(body.errors[0].message, `range validation failed`);
  });

  test("should that return duration value is in range", async (assert) => {
    const { statusCode } = await supertest(BASE_URL)
      .put("/requests/1")
      .set("Authorization", `Bearer ${user.token}`)
      .send({
        name: Faker.lorem.words(2),
        description: Faker.lorem.words(2),
        client_name: Faker.lorem.words(2),
        bounty: Faker.datatype.number(1),
        duration: Faker.datatype.number(10),
        started_at: DateTime.now()
          .plus({ days: 2 })
          .toFormat("yyyy-MM-dd HH:mm:ss"),
        expiration_date: DateTime.now()
          .plus({ days: 15 })
          .toFormat("yyyy-MM-dd HH:mm:ss"),
        status: Faker.random.arrayElement(
          RequestStatusEnum.valuesString.split(",")
        ),
      });

    assert.equal(statusCode, 200);
  });

  test("should that return status value is not correct", async (assert) => {
    const { statusCode } = await supertest(BASE_URL)
      .put("/requests/1")
      .set("Authorization", `Bearer ${user.token}`)
      .send({
        name: Faker.lorem.words(2),
        description: Faker.lorem.words(2),
        client_name: Faker.lorem.words(2),
        bounty: Faker.datatype.number(1),
        duration: Faker.datatype.number(10),
        started_at: DateTime.now()
          .plus({ days: 2 })
          .toFormat("yyyy-MM-dd HH:mm:ss"),
        expiration_date: DateTime.now()
          .plus({ days: 15 })
          .toFormat("yyyy-MM-dd HH:mm:ss"),
        status: "finish",
      });

    assert.equal(statusCode, 422);
  });

  test("should that return status value is correct", async (assert) => {
    const { statusCode } = await supertest(BASE_URL)
      .put("/requests/1")
      .set("Authorization", `Bearer ${user.token}`)
      .send({
        name: Faker.lorem.words(2),
        description: Faker.lorem.words(2),
        client_name: Faker.lorem.words(2),
        bounty: Faker.datatype.number(1),
        duration: Faker.datatype.number(10),
        started_at: DateTime.now()
          .plus({ days: 2 })
          .toFormat("yyyy-MM-dd HH:mm:ss"),
        expiration_date: DateTime.now()
          .plus({ days: 15 })
          .toFormat("yyyy-MM-dd HH:mm:ss"),
        status: Faker.random.arrayElement(
          RequestStatusEnum.valuesString.split(",")
        ),
      });

    assert.equal(statusCode, 200);
  });
});

test.group("Add adventurer on a request", (group) => {
  let user;
  group.beforeEach(async () => {
    await Database.beginGlobalTransaction();
    user = await loginUser(BASE_URL);
  });

  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction();
  });

  test("should that return request not found", async (assert) => {
    const { body, statusCode } = await supertest(BASE_URL)
      .post("/requests/1/adventurers")
      .set("Authorization", `Bearer ${user.token}`)
      .send({
        adventurer_id: 1,
      });

    assert.equal(statusCode, 404);
    assert.equal(body.error, "Request not found");
  });

  test("should that return cannot add adventurer on a started or finished request", async (assert) => {
    const request = await RequestFactory.merge({
      status: RequestStatusEnum.STARTED.value,
    }).create();
    const adventurer = await AdventurerFactory.with("speciality").create();

    const { body, statusCode } = await supertest(BASE_URL)
      .post(`/requests/${request.id}/adventurers`)
      .set("Authorization", `Bearer ${user.token}`)
      .send({
        adventurer_id: adventurer.id,
      });

    assert.equal(statusCode, 404);
    assert.equal(
      body.error,
      "You can not add an adventurer on a started or finished request"
    );
  });

  test("should that return adventurer not found", async (assert) => {
    const request = await RequestFactory.merge({
      status: RequestStatusEnum.PENDING.value,
    }).create();

    const { body, statusCode } = await supertest(BASE_URL)
      .post(`/requests/${request.id}/adventurers`)
      .set("Authorization", `Bearer ${user.token}`)
      .send({
        adventurer_id: 12,
      });

    assert.equal(statusCode, 422);
    assert.equal(body.errors[0].message, "exists validation failure");
  });

  test("should that return adventurer already added", async (assert) => {
    const request = await RequestFactory.merge({
      status: RequestStatusEnum.PENDING.value,
    }).create();
    const adventurer = await AdventurerFactory.with("speciality").create();

    await request.related("adventurers").attach([adventurer.id]);

    const { body, statusCode } = await supertest(BASE_URL)
      .post(`/requests/${request.id}/adventurers`)
      .set("Authorization", `Bearer ${user.token}`)
      .send({
        adventurer_id: adventurer.id,
      });

    assert.equal(statusCode, 400);
    assert.equal(body.error, "Adventurer already added");
  });

  test("should that return adventurer is not available", async (assert) => {
    const request = await RequestFactory.merge({
      status: RequestStatusEnum.PENDING.value,
    }).create();
    const adventurer = await AdventurerFactory.with("speciality")
      .merge({ status: AdventurerStatusEnum.WORK.value })
      .create();

    const { body, statusCode } = await supertest(BASE_URL)
      .post(`/requests/${request.id}/adventurers`)
      .set("Authorization", `Bearer ${user.token}`)
      .send({
        adventurer_id: adventurer.id,
      });

    assert.equal(statusCode, 400);
    assert.equal(body.error, "Adventurer not available");
  });

  test("should that return request with associated adventurers", async (assert) => {
    const request = await RequestFactory.merge({
      status: RequestStatusEnum.PENDING.value,
    }).create();
    const adventurer = await AdventurerFactory.with("speciality")
      .merge({ status: AdventurerStatusEnum.AVAILABLE.value })
      .create();

    const { body, statusCode } = await supertest(BASE_URL)
      .post(`/requests/${request.id}/adventurers`)
      .set("Authorization", `Bearer ${user.token}`)
      .send({
        adventurer_id: adventurer.id,
      });

    assert.equal(statusCode, 200);
    assert.hasAllKeys(body, [
      "id",
      "name",
      "description",
      "client_name",
      "bounty",
      "duration",
      "started_at",
      "expiration_date",
      "status",
      "adventurers",
      "created_at",
      "updated_at",
    ]);
  });
});
