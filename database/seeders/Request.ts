import Request from "App/Models/Request";
import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import { DateTime } from "luxon";
export default class RequestSeeder extends BaseSeeder {
  public async run() {
    await Request.updateOrCreateMany("name", [
      {
        name: "Récolte d'élixir",
        description:
          "Nous recherchons des aventuriers expérimentés capables de récolter 1.000.000 d'élixir.",
        bounty: 1000,
        status: "started",
        client_name: "Empire",
        started_at: DateTime.utc(2027, 3, 12, 5),
        duration: 3,
      },
      {
        name: "Recherche d'un cheval perdu",
        description:
          "Je suis à la recherche de mon cheval qui a été perdu dans le désert. Je recherche un aventurier capable de me le retrouver",
        bounty: 3500,
        status: "not-started",
        client_name: "Laura Cortez",
        duration: 3,
      },
    ]);
  }
}
