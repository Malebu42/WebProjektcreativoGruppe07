import vine from '@vinejs/vine'

/** Profil bearbeiten: Name, Bio, E-Mail */
export const updateProfileValidator = vine.withMetaData<{ userId: number }>().compile(
  vine.object({
    displayName: vine.string().trim().minLength(2).maxLength(50),
    bio: vine.string().trim().maxLength(300).optional(),
    email: vine
      .string()
      .trim()
      .email()
      .normalizeEmail()
      // E-Mail muss eindeutig sein, außer es ist die eigene
      .unique(async (db, value, field) => {
        const user = await db
          .from('users')
          .where('email', value)
          .whereNot('id', field.meta.userId)
          .first()
        return !user
      }),
  })
)

/** Passwort ändern */
export const changePasswordValidator = vine.compile(
  vine.object({
    currentPassword: vine.string().minLength(1),
    password: vine
      .string()
      .minLength(8)
      .maxLength(64)
      // erwartet zusätzlich das Formularfeld "passwordConfirmation"
      .confirmed({ confirmationField: 'passwordConfirmation' }),
  })
)

/** Profilfoto: nur jpg/png, max. 5 MB */
export const avatarValidator = vine.compile(
  vine.object({
    avatar: vine.file({
      size: '5mb',
      extnames: ['jpg', 'jpeg', 'png'],
    }),
  })
)
