import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import Adventurer from "./Adventurer";
import Request from "./Request";

export default class RequestAdventurer extends BaseModel {
  @column({ isPrimary: true })
  public adventurerId: number;

  @column({ isPrimary: true })
  public requestId: number;

  @belongsTo(() => Adventurer)
  public adventurer: BelongsTo<typeof Adventurer>;

  @belongsTo(() => Request)
  public request: BelongsTo<typeof Request>;
}
