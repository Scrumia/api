import RequestStatusEnum from "App/Enums/RequestStatusEnum";
import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Alters extends BaseSchema {
  protected tableName = "requests";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .string("status")
        .notNullable()
        .defaultTo(RequestStatusEnum.PENDING.value)
        .alter();
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string("status").notNullable().defaultTo(null).alter();
    });
  }
}
