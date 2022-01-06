import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class UpdateRequests extends BaseSchema {
  protected tableName = "requests";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string("description").nullable().alter();
      table.integer("bounty").nullable().alter();
      table.string("status").nullable().alter();
      table.string("client_name").nullable().alter();
      table.dateTime("started_at").nullable().alter();
      table.integer("duration").nullable().alter();
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string("description").notNullable().alter();
      table.integer("bounty").notNullable().alter();
      table.string("status").notNullable().alter();
      table.string("client_name").notNullable().alter();
      table.dateTime("started_at").notNullable().alter();
      table.integer("duration").notNullable().alter();
    });
  }
}
