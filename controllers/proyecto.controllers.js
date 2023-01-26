import Proyecto from '../models/Proyecto.js'
import Tarea from '../models/Tarea.js'
import { idMongooseValida } from '../helpers/validarMongoose.js'

export const obtenerProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find({ creador: req.usuario._id })
    return res.json(proyectos)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const nuevoProyecto = async (req, res) => {
  const proyecto = new Proyecto(req.body)
  proyecto.creador = req.usuario._id

  try {
    const proyectoCreado = await proyecto.save()
    return res.json(proyectoCreado)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const obtenerProyecto = async (req, res) => {
  const { id } = req.params

  if (!idMongooseValida(id)) {
    return res.status(400).json({ message: 'Id de proyecto no válida' })
  }

  try {
    const proyecto = await Proyecto.findById(id).where('creador').equals(req.usuario._id)

    if (!proyecto) {
      const error = new Error('No se encontro el proyecto')
      return res.status(404).json({ message: error.message })
    }

    // Obtener tareas del proyecto

    const tareas = await Tarea.find({ proyecto: proyecto._id })

    return res.json({ ...proyecto._doc, tareas })
  } catch (error) {
    return res.status(500).json({ message: error })
  }
}

export const editarProyecto = async (req, res) => {
  const { id } = req.params
  const { nombre, descripcion, cliente, fechaEntrega } = req.body

  if (!idMongooseValida(id)) {
    return res.status(400).json({ message: 'Id de proyecto no válida' })
  }

  try {
    const proyecto = await Proyecto.findById(id).where('creador').equals(req.usuario._id)

    if (!proyecto) {
      const error = new Error('No se encontro el proyecto')
      return res.status(404).json({ message: error.message })
    }

    proyecto.nombre = nombre || proyecto.nombre
    proyecto.descripcion = descripcion || proyecto.descripcion
    proyecto.cliente = cliente || proyecto.cliente
    proyecto.fechaEntrega = fechaEntrega || proyecto.fechaEntrega

    const proyectoAlmacenado = await proyecto.save()

    return res.json(proyectoAlmacenado)
  } catch (error) {
    return res.status(500).json({ message: error })
  }
}

export const eliminarProyecto = async (req, res) => {
  const { id } = req.params

  if (!idMongooseValida(id)) {
    return res.status(400).json({ message: 'Id de proyecto no válida' })
  }

  try {
    const proyecto = await Proyecto.findById(id).where('creador').equals(req.usuario._id)

    if (!proyecto) {
      const error = new Error('No se encontro el proyecto')
      return res.status(404).json({ message: error.message })
    }

    const proyectoEliminado = await proyecto.deleteOne()

    return res.json({ message: 'Proyecto Eliminado', proyectoEliminado })
  } catch (error) {
    return res.status(500).json({ message: error })
  }
}

export const agregarColaborador = async (req, res) => {}

export const eliminarColaborador = async (req, res) => {}
