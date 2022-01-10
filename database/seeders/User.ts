import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import User from "App/Models/User";

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await User.updateOrCreateMany("email", [
      {
        email: "admin@scrumia.com",
        fullName: "Admin",
        password: "admin44",
      },
      {
        email: "john@scrumia.com",
        fullName: "John",
        password: "admin44",
      },
    ]);
  }
}
