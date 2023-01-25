import express from 'express'

import {
  obtenerProyectos,
  nuevoProyecto,
  obtenerProyecto,
  editarProyecto,
  eliminarProyecto,
  agregarColaborador,
  eliminarColaborador
} from '../controllers/proyecto.controllers.js'

const router = express.Router()

router.route('/').get(obtenerProyectos).post(nuevoProyecto)
router.route('/:id').get(obtenerProyecto).put(editarProyecto).delete(eliminarProyecto)

router.post('/agregar-colaborador/:id', agregarColaborador)
router.post('/eliminar-colaborador/:id', eliminarColaborador)

export default router
