import { DateTime } from "luxon";
import {
  BaseModel,
  column,
  ManyToMany,
  manyToMany,
} from "@ioc:Adonis/Lucid/Orm";
import Adventurer from "./Adventurer";

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
  public clientName: string;

  @column.dateTime()
  public startedAt: DateTime;

  @column()
  public duration: number;

  @column()
  public expirationDate: DateTime;

  @manyToMany(() => Adventurer, { pivotTable: "request_adventurers" })
  public adventurers: ManyToMany<typeof Adventurer>;
}
