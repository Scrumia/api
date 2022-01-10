import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class UsersAddFullnames extends BaseSchema {
  protected tableName = "users";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string("full_name").notNullable().defaultTo("");
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn("full_name");
    });
  }
}
