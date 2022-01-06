import Adventurer from "App/Models/Adventurer";
import Request from "App/Models/Request";
import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import { DateTime } from "luxon";
import RequestAdventurer from "App/Models/RequestAdventurer";
import AdventurerStatusEnum from "App/Enums/AdventurerStatusEnum";
import Faker from "faker";
export default class RequestSeeder extends BaseSeeder {
  public async run() {
    const requests = await Request.updateOrCreateMany("name", [
      {
        name: "Récolte d'élixir",
        description:
          "Nous recherchons des aventuriers expérimentés capables de récolter 1.000.000 d'élixir.",
        bounty: 1000,
        status: "started",
        clientName: "Empire",
        startedAt: DateTime.utc(2027, 3, 12, 5),
        duration: 3,
      },
      {
        name: "Recherche d'un cheval perdu",
        description:
          "Je suis à la recherche de mon cheval qui a été perdu dans le désert. Je recherche un aventurier capable de me le retrouver",
        bounty: 3500,
        status: "not-started",
        clientName: "Laura Cortez",
        duration: 3,
      },
    ]);
    const adventurers = await Adventurer.query().where(
      "status",
      AdventurerStatusEnum.AVAILABLE.value
    );
    const requestIds = requests.map((request) => request.id);

    for (const adventurer of adventurers) {
      await RequestAdventurer.create({
        adventurerId: adventurer.id,
        requestId: Faker.random.arrayElement(requestIds),
      });
    }
  }
}
