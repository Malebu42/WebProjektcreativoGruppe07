import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import drive from '@adonisjs/drive/services/main'
import { randomUUID } from 'node:crypto'
import {
  avatarValidator,
  changePasswordValidator,
  updateProfileValidator,
} from '#validators/profile'

export default class ProfileController {
  /** Eigene Profilseite anzeigen */
  async show({ auth, view }: HttpContext) {
    // Nur angemeldete Nutzer kommen hierher (auth-Middleware in den Routen)
    const user = auth.getUserOrFail()

    // TODO: Beitragskacheln und Follower-Zahlen laden, sobald die
    // Relationen im User-Model existieren (Marius/Izem)
    return view.render('pages/profile/show', { user })
  }

  /** Formular "Profil bearbeiten" anzeigen */
  async edit({ auth, view }: HttpContext) {
    return view.render('pages/profile/edit', { user: auth.getUserOrFail() })
  }

  /** Name, Bio und E-Mail ändern */
  async update({ auth, request, response, session }: HttpContext) {
    const user = auth.getUserOrFail()

    // Die ID wird mitgegeben, damit die eigene E-Mail nicht als "schon vergeben" gilt
    const data = await request.validateUsing(updateProfileValidator, {
      meta: { userId: user.id },
    })

    // Nur diese drei Felder werden übernommen, sonst nichts aus dem Request
    user.merge({
      displayName: data.displayName,
      bio: data.bio ?? null,
      email: data.email,
    })
    await user.save()

    session.flash('success', 'Profil gespeichert.')
    return response.redirect().toRoute('profile.show')
  }

  /** Passwort ändern */
  async updatePassword({ auth, request, response, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const { currentPassword, password } = await request.validateUsing(changePasswordValidator)

    // Aktuelles Passwort muss stimmen
    const isValid = await hash.verify(user.password, currentPassword)
    if (!isValid) {
      session.flashErrors({ currentPassword: 'Das aktuelle Passwort ist falsch.' })
      return response.redirect().back()
    }

    // Wird beim Speichern automatisch gehasht (withAuthFinder im Model)
    user.password = password
    await user.save()

    session.flash('success', 'Passwort geändert.')
    return response.redirect().toRoute('profile.show')
  }

  /** Profilfoto hochladen */
  async updateAvatar({ auth, request, response, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const { avatar } = await request.validateUsing(avatarValidator)

    // Zufälliger Dateiname statt Originalname (sicherer). randomUUID ist in Node eingebaut.
    const key = `avatars/${randomUUID()}.${avatar.extname}`
    await avatar.moveToDisk(key)

    // Altes Bild löschen
    if (user.avatarUrl) {
      await drive.use().delete(user.avatarUrl)
    }

    // In der DB steht nur der Pfad
    user.avatarUrl = key
    await user.save()

    session.flash('success', 'Profilfoto aktualisiert.')
    return response.redirect().back()
  }
}
