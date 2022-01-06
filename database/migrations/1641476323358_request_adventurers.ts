import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class RequestAdventurers extends BaseSchema {
  protected tableName = "request_adventurers";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .integer("request_id")
        .unsigned()
        .notNullable()
        .references("requests.id")
        .onDelete("CASCADE");
      table
        .integer("adventurer_id")
        .unsigned()
        .notNullable()
        .references("adventurers.id")
        .onDelete("CASCADE");
      table.primary(["request_id", "adventurer_id"]);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
