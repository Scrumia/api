import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class RequestExpirationDates extends BaseSchema {
  protected tableName = "requests";

  public async up() {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + 1);

    this.schema.alterTable(this.tableName, (table) => {
      table
        .datetime("expiration_date")
        .notNullable()
        .defaultTo(currentDate.toISOString().substring(0, 10));
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn("expiration_date");
    });
  }
}
