import User from '#models/user'
import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * NewAccountController handles user registration.
 * It provides methods for displaying the signup page and creating
 * new user accounts.
 */
export default class NewAccountController {
  /**
   * Display the signup page
   */
  async create({ view }: HttpContext) {
    return view.render('pages/auth/signup')
  }

  /**
   * Create a new user account and authenticate the user
   */
  async store({ request, response, auth }: HttpContext) {
    // GEÄNDERT: "displayName" statt "fullName" (so heißt das Feld im Validator,
    // im Formular und in der Datenbank)
    const { displayName, email, password } = await request.validateUsing(signupValidator)
    const user = await User.create({ displayName, email, password })

    await auth.use('web').login(user)
    // GEÄNDERT: "return" ergänzt
    return response.redirect().toRoute('dashboard')
  }
}
