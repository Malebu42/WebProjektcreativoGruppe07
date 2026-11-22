import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'follows'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('follower_id').unsigned().notNullable()
        .references('id').inTable('users').onDelete('CASCADE')
      table.integer('followed_id').unsigned().notNullable()
        .references('id').inTable('users').onDelete('CASCADE')
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.primary(['follower_id', 'followed_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}