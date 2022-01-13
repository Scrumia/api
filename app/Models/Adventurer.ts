import { DateTime } from "luxon";
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  ManyToMany,
  manyToMany,
} from "@ioc:Adonis/Lucid/Orm";
import Speciality from "./Speciality";
import Request from "./Request";

export default class Adventurer extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public fullName: string;

  @column()
  public experienceLevel: number;

  @column()
  public status: string;

  @column()
  public specialityId: number;

  @belongsTo(() => Speciality)
  public speciality: BelongsTo<typeof Speciality>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @manyToMany(() => Request, { pivotTable: "request_adventurers" })
  public requests: ManyToMany<typeof Request>;
}
