import User from "App/Models/User";
import supertest from "supertest";

export const createUser = async (email, password, fullName) => {
  const user = await User.create({
    email,
    password,
    fullName,
  });

  return { ...user, password };
};

export const loginUser = async (baseUrl) => {
  const user = {
    email: "testuser@scrumia.com",
    password: "test",
    fullName: "admin",
  };
  await createUser(user.email, user.password, user.fullName);
  const { body } = await supertest(baseUrl)
    .post("/login")
    .send({ email: user.email, password: user.password });

  return body;
};
