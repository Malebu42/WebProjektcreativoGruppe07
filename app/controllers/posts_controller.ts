import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import drive from '@adonisjs/drive/services/main'
import { randomUUID } from 'node:crypto'
import Category from '#models/category'
import { createPostValidator } from '#validators/post'

export default class PostsController {
  /** Formular "Neuer Beitrag" anzeigen */
  async create({ view }: HttpContext) {
    // Alle Kategorien für die Checkboxen im Formular, alphabetisch sortiert
    const categories = await Category.query().orderBy('name', 'asc')

    return view.render('pages/posts/create', { categories })
  }

  /** Neuen Beitrag speichern */
  async store({ auth, request, response, session }: HttpContext) {
    const user = auth.getUserOrFail()

    // Bei ungültigen Eingaben leitet AdonisJS hier automatisch zurück zum Formular
    const { title, caption, categoryIds, media } = await request.validateUsing(createPostValidator)

    // Merkt sich, welche Dateien schon gespeichert wurden (zum Aufräumen bei Fehlern)
    const savedFiles: { fileUrl: string; fileType: string }[] = []

    try {
      // 1. Bilder speichern – zufälliger Name statt Originalname (wie beim Avatar)
      for (const file of media) {
        const key = `posts/${randomUUID()}.${file.extname}`
        await file.moveToDisk(key)
        savedFiles.push({ fileUrl: key, fileType: `${file.type}/${file.subtype}` }) // z. B. "image/png"
      }

      // 2. Alles in die Datenbank – entweder komplett oder gar nicht
      await db.transaction(async (trx) => {
        // WICHTIG: ohne useTransaction würde der Post außerhalb der Transaktion gespeichert
        user.useTransaction(trx)

        // userId wird über die Beziehung automatisch gesetzt
        const post = await user.related('posts').create({ title, caption: caption ?? null })

        // Der Post kennt die Transaktion, deshalb laufen auch diese Abfragen darin
        await post.related('categories').attach(categoryIds)
        await post.related('media').createMany(savedFiles)
      })
    } catch (error) {
      // Etwas ist schiefgegangen → bereits gespeicherte Bilder wieder löschen,
      // damit keine verwaisten Dateien im Ordner storage/posts/ liegen bleiben
      await Promise.allSettled(savedFiles.map((file) => drive.use().delete(file.fileUrl)))
      throw error
    }

    session.flash('success', 'Beitrag veröffentlicht.')

    // TODO (Schritt 5): auf die Detailseite des Beitrags weiterleiten, sobald es sie gibt
    return response.redirect().toRoute('profile.show')
  }
}
