import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Category from '#models/category'

export default class CategorySeeder extends BaseSeeder {
  async run() {
    await Category.createMany([
      { name: 'Fotografie' },
      { name: 'Illustration' },
      { name: 'Design' },
    ])
  }
}
