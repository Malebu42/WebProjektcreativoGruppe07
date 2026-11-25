import vine from '@vinejs/vine'

/**
 * Neuen Beitrag erstellen: Titel, Beschreibung, Kategorien, Bilder
 *
 * Hinweis: Das Upload-Limit für die ganze Anfrage liegt bei 20 MB
 * (config/bodyparser.ts → multipart.limit). Deshalb max. 3 Bilder à 5 MB.
 */
export const createPostValidator = vine.compile(
  vine.object({
    // Titel ist Pflicht
    title: vine.string().trim().minLength(3).maxLength(100),

    // Beschreibung ist optional (leeres Feld wird zu null → zählt als "nicht ausgefüllt")
    caption: vine.string().trim().maxLength(2000).optional(),

    // Kategorien aus den Checkboxen (name="categoryIds[]").
    // Formulare schicken Text ("1"), vine.number() macht daraus die Zahl 1.
    // exists prüft, ob es die Kategorie in der Tabelle "categories" wirklich gibt.
    categoryIds: vine
      .array(vine.number().exists({ table: 'categories', column: 'id' }))
      .minLength(1)
      .maxLength(3)
      .distinct(),

    // Bilder aus dem Dateifeld (name="media[]" multiple)
    media: vine
      .array(
        vine.file({
          size: '5mb',
          extnames: ['jpg', 'jpeg', 'png', 'webp'],
        })
      )
      .minLength(1)
      .maxLength(3),
  })
)
