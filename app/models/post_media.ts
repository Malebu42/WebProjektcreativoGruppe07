import { belongsTo } from '@adonisjs/lucid/orm'

import type {
  BelongsTo,
} from '@adonisjs/lucid/types/relations'

import { PostMediaSchema } from '#database/schema'

import Post from '#models/post'

export default class PostMedia extends PostMediaSchema {

  // Jedes Medium gehört zu einem Beitrag
  @belongsTo(() => Post)
  declare post: BelongsTo<typeof Post>

}