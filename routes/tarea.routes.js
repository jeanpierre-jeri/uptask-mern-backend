import express from 'express'
import {
  agregarTarea,
  obtenerTarea,
  actualizarTarea,
  eliminarTarea,
  cambiarEstado
} from '../controllers/tarea.controller.js'

const router = express.Router()

router.post('/', agregarTarea)
router.route('/:id').get(obtenerTarea).put(actualizarTarea).delete(eliminarTarea)

router.post('/estado/:id', cambiarEstado)

export default router
