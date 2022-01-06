import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Request extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column()
  public description: string;

  @column()
  public bounty: number;

  @column()
  public status: string;

  @column()
  public client_name: string;

  @column.dateTime()
  public started_at: DateTime;

  @column()
  public duration: number;
}
