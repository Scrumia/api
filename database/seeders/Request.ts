import Adventurer from "App/Models/Adventurer";
import Request from "App/Models/Request";
import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import { DateTime } from "luxon";
import RequestAdventurer from "App/Models/RequestAdventurer";
import AdventurerStatusEnum from "App/Enums/AdventurerStatusEnum";
import Faker from "faker";
import RequestStatusEnum from "App/Enums/RequestStatusEnum";
export default class RequestSeeder extends BaseSeeder {
  public async run() {
    const requests = await Request.updateOrCreateMany("name", [
      {
        name: "Récolte d'élixir",
        description:
          "Nous recherchons des aventuriers expérimentés capables de récolter 1.000.000 d'élixir.",
        bounty: 1000,
        status: RequestStatusEnum.STARTED.value,
        clientName: "Empire",
        startedAt: DateTime.utc(2027, 3, 12, 5),
        duration: 3,
      },
      {
        name: "Recherche d'un cheval perdu",
        description:
          "Je suis à la recherche de mon cheval qui a été perdu dans le désert. Je recherche un aventurier capable de me le retrouver",
        bounty: 3500,
        status: RequestStatusEnum.PENDING.value,
        clientName: "Laura Cortez",
        duration: 3,
      },
      {
        name: "Trouver de nouvelles sources d'eau",
        description:
          "L'empire vous invite à l'aider à trouver de nouvelles sources d'eau.",
        bounty: 7000,
        status: RequestStatusEnum.FINISHED.value,
        clientName: "Empire",
        duration: 25,
        startedAt: DateTime.utc(2026, 2, 12, 5),
      },
      {
        name: "Soigner les animaux",
      },
      {
        name: "Aller à la pêche",
      },
    ]);
    const adventurers = await Adventurer.query().where(
      "status",
      AdventurerStatusEnum.AVAILABLE.value
    );
    const requestIds = requests.map((request) => request.id);

    for (const adventurer of adventurers) {
      const requestId = Faker.random.arrayElement(requestIds);
      await RequestAdventurer.updateOrCreate(
        {
          adventurerId: adventurer.id,
          requestId: requestId,
        },
        {
          adventurerId: adventurer.id,
          requestId: requestId,
        }
      );
    }
  }
}
