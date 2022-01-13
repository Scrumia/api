import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Requests extends BaseSchema {
  protected tableName = "requests";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table.string("name").notNullable();
      table.string("description").notNullable();
      table.integer("bounty").notNullable();
      table.string("status").notNullable();
      table.string("client_name").notNullable();
      table.dateTime("started_at").notNullable();
      table.integer("duration").notNullable();

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp("created_at", { useTz: true });
      table.timestamp("updated_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
