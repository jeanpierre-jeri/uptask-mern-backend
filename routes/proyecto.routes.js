import express from 'express'

import {
  obtenerProyectos,
  nuevoProyecto,
  obtenerProyecto,
  editarProyecto,
  eliminarProyecto,
  buscarColaborador,
  agregarColaborador,
  eliminarColaborador
} from '../controllers/proyecto.controllers.js'

const router = express.Router()

router.route('/').get(obtenerProyectos).post(nuevoProyecto)
router.route('/:id').get(obtenerProyecto).put(editarProyecto).delete(eliminarProyecto)

router.post('/colaboradores', buscarColaborador)
router.route('/colaboradores/:id').post(agregarColaborador).delete(eliminarColaborador)

export default router
