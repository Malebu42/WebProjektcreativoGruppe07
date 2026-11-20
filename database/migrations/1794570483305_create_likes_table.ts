import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'likes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('user_id').unsigned().notNullable()
        .references('id').inTable('users').onDelete('CASCADE')
      table.integer('post_id').unsigned().notNullable()
        .references('id').inTable('posts').onDelete('CASCADE')
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.primary(['user_id', 'post_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}