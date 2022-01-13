import { DateTime } from "luxon";
import RequestStatusEnum from "App/Enums/RequestStatusEnum";
import Factory from "@ioc:Adonis/Lucid/Factory";
import Request from "App/Models/Request";
import Adventurer from "App/Models/Adventurer";

export const RequestFactory = Factory.define(Request, ({ faker }) => {
  return {
    name: faker.name.findName(),
    description: faker.name.findName(),
    bounty: faker.datatype.number({ min: 1, max: 100 }),
    status: faker.random.arrayElement(
      RequestStatusEnum.valuesString.split(",")
    ),
    duration: faker.datatype.number({ min: 1, max: 100 }),
    startedAt: DateTime.now(),
    expirationDate: DateTime.now(),
    clientName: faker.name.findName(),
  };
})
  .relation("adventurers", () => Adventurer)
  .build();
