import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Speciality from './Speciality'

export default class Adventurer extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public fullName: string

  @column()
  public experienceLevel: number

  @column()
  public status: string

  @column()
  public specialityId: number

  @belongsTo(() => Speciality)
  public speciality: BelongsTo<typeof Speciality>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
