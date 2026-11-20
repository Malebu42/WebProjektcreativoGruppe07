import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'post_medias'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('post_id').unsigned().notNullable()
        .references('id').inTable('posts').onDelete('CASCADE')
      table.string('file_url').notNullable()
      table.string('file_type').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}