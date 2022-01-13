import Factory from "@ioc:Adonis/Lucid/Factory";
import Speciality from "App/Models/Speciality";

export const SpecialityFactory = Factory.define(Speciality, ({ faker }) => {
  return {
    name: faker.random.alphaNumeric(10),
  };
}).build();
