import { BaseCommand } from "@adonisjs/core/build/standalone";
import AdventurerStatusEnum from "App/Enums/AdventurerStatusEnum";

export default class DeleteRequest extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = "delete:request";

  /**
   * Command description is displayed in the "help" output
   */
  public static description = "";

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command. Don't forget to call `node ace generate:manifest`
     * afterwards.
     */
    loadApp: true,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process. Don't forget to call
     * `node ace generate:manifest` afterwards.
     */
    stayAlive: false,
  };

  public async run() {
    const { default: Request } = await import("App/Models/Request");
    const { default: RequestStatusEnum } = await import(
      "App/Enums/RequestStatusEnum"
    );

    const { default: Database } = await import("@ioc:Adonis/Lucid/Database");

    const loader = await this.logger.await("Deleting requests");

    const requestToDelete = await Request.query()
      .where("status", RequestStatusEnum.PENDING.value)
      .where("expiration_date", "<", new Date())
      .preload("adventurers");

    // Delete requests
    await Request.query()
      .whereIn(
        "id",
        requestToDelete.map((request) => request.id)
      )
      .delete();

    // Update status of adventurers
    const adventurerIds: any = [];
    requestToDelete.forEach((request) => {
      request.adventurers.forEach((adventurer) => {
        adventurerIds.push(adventurer.id);
      });
    });

    if (adventurerIds.length > 0) {
      await Database.from("adventurers")
        .update({ status: AdventurerStatusEnum.AVAILABLE.value })
        .whereIn("id", adventurerIds);
    }

    loader.stop();

    this.logger.success(
      `${requestToDelete.length} requests have been deleted and ${adventurerIds.length} adventurers have been updated`
    );

    const table = this.ui.table();
    table.head(["Request ID", "Expiration date"]);

    requestToDelete.forEach((request) => {
      table.row([request.id.toString(), request.expirationDate.toString()]);
    });

    table.render();
  }
}
