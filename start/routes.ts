/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

router.on('/').render('pages/home').as('home')

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create'])
    router.post('signup', [controllers.NewAccount, 'store'])

    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])
  })
  .use(middleware.guest())

router
  .group(() => {
    router.on('/dashboard').render('pages/dashboard').as('dashboard')
    router.post('logout', [controllers.Session, 'destroy'])

    // NEU: Profil
    router.get('profile', [controllers.Profile, 'show']).as('profile.show')
    router.get('profile/edit', [controllers.Profile, 'edit']).as('profile.edit')
    router.post('profile', [controllers.Profile, 'update']).as('profile.update')
    router.post('profile/password', [controllers.Profile, 'updatePassword']).as('profile.password')
    router.post('profile/avatar', [controllers.Profile, 'updateAvatar']).as('profile.avatar')
  })
  .use(middleware.auth())
