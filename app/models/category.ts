import { manyToMany } from '@adonisjs/lucid/orm'

import type {
  ManyToMany,
} from '@adonisjs/lucid/types/relations'

import { CategorySchema } from '#database/schema'

import Post from '#models/post'

export default class Category extends CategorySchema {

  // Eine Kategorie kann mehreren Beiträgen zugeordnet sein
  @manyToMany(() => Post, {
    pivotTable: 'post_categories',
  })
  declare posts: ManyToMany<typeof Post>

}