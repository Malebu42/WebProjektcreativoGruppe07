import { belongsTo } from '@adonisjs/lucid/orm'

import type {
  BelongsTo,
} from '@adonisjs/lucid/types/relations'

import { NotificationSchema } from '#database/schema'

import User from '#models/user'
import Post from '#models/post'
import Comment from '#models/comment'

export default class Notification extends NotificationSchema {

  // Benutzer, der die Benachrichtigung erhält
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  // Benutzer, der die Aktion ausgelöst hat
  @belongsTo(() => User, {
    foreignKey: 'actorId',
  })
  declare actor: BelongsTo<typeof User>

  // Optional: Der zugehörige Beitrag
  @belongsTo(() => Post)
  declare post: BelongsTo<typeof Post>

  // Optional: Der zugehörige Kommentar
  @belongsTo(() => Comment)
  declare comment: BelongsTo<typeof Comment>

}