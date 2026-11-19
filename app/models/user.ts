import { hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type {
  HasMany,
  ManyToMany,
} from '@adonisjs/lucid/types/relations'
import Post from '#models/post'
import Comment from '#models/comment'
import Notification from '#models/notification'

import { UserSchema } from '#database/schema'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'

/**
 * User model represents a user in the application.
 * It extends UserSchema and includes authentication capabilities
 * through the withAuthFinder mixin.
 */
export default class User extends compose(UserSchema, withAuthFinder(hash)) {

  @hasMany(() => Post)
  declare posts: HasMany<typeof Post>

  @hasMany(() => Comment)
  declare comments: HasMany<typeof Comment>

  @hasMany(() => Notification)
  declare notifications: HasMany<typeof Notification>

  @manyToMany(() => Post, {
    pivotTable: 'likes',
  })
  declare likedPosts: ManyToMany<typeof Post>

  @manyToMany(() => User, {
    pivotTable: 'follows',
    pivotForeignKey: 'follower_id',
    pivotRelatedForeignKey: 'followed_id',
  })
  declare following: ManyToMany<typeof User>

  @manyToMany(() => User, {
    pivotTable: 'follows',
    pivotForeignKey: 'followed_id',
    pivotRelatedForeignKey: 'follower_id',
  })
  declare followers: ManyToMany<typeof User>

  /**
   * Get the user's initials from their display name or email.
   * Returns the first letter of the first two words if available,
   * otherwise returns the first two characters of the name / email username.
   */
  get initials() {
    const [first, last] = this.displayName
      ? this.displayName.trim().split(/\s+/)
      : this.email.split('@')
    if (first && last) {
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
    }
    return `${first.slice(0, 2)}`.toUpperCase()
  }
}
