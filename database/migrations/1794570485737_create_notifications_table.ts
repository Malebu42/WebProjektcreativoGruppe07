import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notifications'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable()
        .references('id').inTable('users').onDelete('CASCADE')
      table.integer('actor_id').unsigned().notNullable()
        .references('id').inTable('users').onDelete('CASCADE')
      table.string('type').notNullable() // 'like', 'comment' oder 'follow'
      table.integer('post_id').unsigned().nullable()
        .references('id').inTable('posts').onDelete('CASCADE')
      table.integer('comment_id').unsigned().nullable()
        .references('id').inTable('comments').onDelete('CASCADE')
      table.boolean('is_read').notNullable().defaultTo(false)
      table.timestamp('created_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}