import User from '#models/user'
import { loginValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
// NEU: Limiter für die Begrenzung der Login-Versuche
import limiter from '@adonisjs/limiter/services/main'
import { errors } from '@adonisjs/limiter'

/**
 * SessionController handles user authentication and session management.
 * It provides methods for displaying the login page, authenticating users,
 * and logging out.
 */
export default class SessionController {
  /**
   * Display the login page
   */
  async create({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }

  /**
   * Authenticate user credentials and create a new session
   */
  // NEU: "session" wird zusätzlich benötigt, um Meldungen anzuzeigen
  async store({ request, auth, response, session }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    // NEU: Regel festlegen: 5 Fehlversuche pro Minute, danach 15 Minuten gesperrt
    const loginLimiter = limiter.use({
      requests: 5,
      duration: '1 min',
      blockDuration: '15 mins',
    })

    // NEU: Der "Schlüssel" bestimmt, wer gezählt wird: diese IP + diese E-Mail
    const key = `login_${request.ip()}_${email}`

    // NEU: penalize führt die Prüfung aus und zählt nur FEHLVERSUCHE mit
    const [error, user] = await loginLimiter.penalize(key, () =>
      User.verifyCredentials(email, password)
    )

    // NEU: Wenn ein Fehler auftritt...
    if (error) {
      // ...und der Grund ist die Sperre: verständliche Meldung anzeigen
      if (error instanceof errors.E_TOO_MANY_REQUESTS) {
        session.flash('error', 'Zu viele Fehlversuche. Bitte warte 15 Minuten.')
        return response.redirect().back()
      }
      // ...sonst (z. B. falsches Passwort): normale Fehlermeldung von Adonis
      throw error
    }

    await auth.use('web').login(user!)
    return response.redirect().toRoute('dashboard') // "return" ergänzt
  }

  /**
   * Log out the current user and destroy their session
   */
  async destroy({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect().toRoute('session.create') // "return" ergänzt
  }
}
