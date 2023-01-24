import express from 'express'

import checkAuth from '../middleware/checkAuth.middleware.js'

import {
  autenticar,
  comprobarToken,
  confirmar,
  nuevoPassword,
  olvidePassword,
  perfil,
  registrar
} from '../controllers/usuario.controllers.js'

const router = express.Router()

// Autenticacion, registro y confirmacion de usuarios

router.post('/', registrar) // Crea un nuevo usuario
router.post('/login', autenticar) // Autenticar un usuario
router.get('/confirmar/:token', confirmar) // Confirmar un usuario
router.post('/olvide-password', olvidePassword) // Recuperar cuenta
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword)

router.get('/perfil', checkAuth, perfil)

export default router
