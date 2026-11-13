import {
  belongsTo,
  hasMany,
  manyToMany,
} from '@adonisjs/lucid/orm'

import type {
  BelongsTo,
  HasMany,
  ManyToMany,
} from '@adonisjs/lucid/types/relations'

import { PostSchema } from '#database/schema'

import User from '#models/user'
import Comment from '#models/comment'
import PostMedia from '#models/post_media'
import Category from '#models/category'

export default class Post extends PostSchema {

  // Der Beitrag gehört einem Benutzer
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  // Ein Beitrag kann mehrere Medien besitzen
  @hasMany(() => PostMedia)
  declare media: HasMany<typeof PostMedia>

  // Ein Beitrag kann mehrere Kommentare besitzen
  @hasMany(() => Comment)
  declare comments: HasMany<typeof Comment>

  // Ein Beitrag kann mehreren Kategorien zugeordnet sein
  @manyToMany(() => Category, {
    pivotTable: 'post_categories',
  })
  declare categories: ManyToMany<typeof Category>

  // Ein Beitrag kann von mehreren Benutzern geliked werden
  @manyToMany(() => User, {
    pivotTable: 'likes',
  })
  declare likedBy: ManyToMany<typeof User>
}