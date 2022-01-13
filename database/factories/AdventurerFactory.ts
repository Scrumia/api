import { SpecialityFactory } from "./SpecialityFactory";
import Factory from "@ioc:Adonis/Lucid/Factory";
import AdventurerStatusEnum from "App/Enums/AdventurerStatusEnum";
import Adventurer from "App/Models/Adventurer";

export const AdventurerFactory = Factory.define(Adventurer, ({ faker }) => {
  return {
    fullName: faker.name.findName(),
    experienceLevel: faker.datatype.number({ min: 1, max: 100 }),
    status: faker.random.arrayElement(
      AdventurerStatusEnum.valuesString.split(",")
    ),
  };
})
  .relation("speciality", () => SpecialityFactory)
  .build();
