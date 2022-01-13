import User from "App/Models/User";
import Factory from "@ioc:Adonis/Lucid/Factory";

export const UserFactory = Factory.define(User, ({ faker }) => {
  return {
    email: faker.internet.userName(),
    password: "test",
    fullName: faker.name.findName(),
  };
}).build();
