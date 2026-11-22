import { belongsTo } from '@adonisjs/lucid/orm'

import type {
  BelongsTo,
} from '@adonisjs/lucid/types/relations'

import { CommentSchema } from '#database/schema'

import User from '#models/user'
import Post from '#models/post'

export default class Comment extends CommentSchema {

  // Der Kommentar wurde von einem Benutzer geschrieben
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  // Der Kommentar gehört zu einem Beitrag
  @belongsTo(() => Post)
  declare post: BelongsTo<typeof Post>

}