import { UserFactory } from "./../database/factories/UserFactory";
import supertest from "supertest";

export const createUser = async () => {
  const user = await UserFactory.create();
  return { ...user, password: "test" };
};

export const loginUser = async (baseUrl) => {
  const user = await createUser();
  const { body } = await supertest(baseUrl)
    .post("/login")
    .send({ email: user.email, password: user.password });

  return body;
};
