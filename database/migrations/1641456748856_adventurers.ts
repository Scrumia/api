import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import AdventurerStatusEnum from 'App/Enums/AdventurerStatusEnum'

export default class Adventurers extends BaseSchema {
  protected tableName = 'adventurers'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('full_name').notNullable()
      table.float('experience_level').notNullable()
      table.string('status').notNullable().defaultTo(AdventurerStatusEnum.AVAILABLE.value)
      table.integer('speciality_id').unsigned().references('specialities.id')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
