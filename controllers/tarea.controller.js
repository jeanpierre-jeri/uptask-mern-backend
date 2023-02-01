import Proyecto from '../models/Proyecto.js'
import Tarea from '../models/Tarea.js'
import { idMongooseValida } from '../helpers/validarMongoose.js'

export const agregarTarea = async (req, res) => {
  const { proyecto: idProyecto } = req.body

  if (!idMongooseValida(idProyecto)) {
    return res.status(400).json({ message: 'Id de tarea no válida' })
  }

  const proyecto = await Proyecto.findById(idProyecto).where('creador').equals(req.usuario._id)

  if (!proyecto) {
    const error = new Error('No existe ese proyecto')

    return res.status(404).json({ message: error.message })
  }

  try {
    const tarea = await Tarea.create(req.body)
    proyecto.tareas.push(tarea._id)
    await proyecto.save()
    return res.json(tarea)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const obtenerTarea = async (req, res) => {
  const { id } = req.params

  if (!idMongooseValida(id)) {
    return res.status(400).json({ message: 'Id de tarea no válida' })
  }

  try {
    const tarea = await Tarea.findById(id).populate('proyecto')

    if (!tarea) {
      const error = new Error('No se encontró la tarea')
      return res.status(404).json({ message: error.message })
    }

    if (String(tarea.proyecto.creador) !== String(req.usuario._id)) {
      const error = new Error('Acción no válida')
      return res.status(403).json({ message: error.message })
    }

    return res.json(tarea)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const actualizarTarea = async (req, res) => {
  const { id } = req.params
  const { nombre, descripcion, fechaEntrega, prioridad } = req.body

  if (!idMongooseValida(id)) {
    return res.status(400).json({ message: 'Id de tarea no válida' })
  }

  try {
    const tarea = await Tarea.findById(id).populate('proyecto')

    if (!tarea) {
      const error = new Error('No se encontró la tarea')
      return res.status(404).json({ message: error.message })
    }

    if (String(tarea.proyecto.creador) !== String(req.usuario._id)) {
      const error = new Error('Acción no válida')
      return res.status(403).json({ message: error.message })
    }

    tarea.nombre = nombre || tarea.nombre
    tarea.descripcion = descripcion || tarea.descripcion
    tarea.fechaEntrega = fechaEntrega || tarea.fechaEntrega
    tarea.prioridad = prioridad || tarea.prioridad

    const tareaGuardada = await tarea.save()

    return res.json(tareaGuardada)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const eliminarTarea = async (req, res) => {
  const { id } = req.params

  if (!idMongooseValida(id)) {
    return res.status(400).json({ message: 'Id de tarea no válida' })
  }

  try {
    const tarea = await Tarea.findById(id).populate('proyecto')

    if (!tarea) {
      const error = new Error('No se encontró la tarea')
      return res.status(404).json({ message: error.message })
    }

    if (String(tarea.proyecto.creador) !== String(req.usuario._id)) {
      const error = new Error('Acción no válida')
      return res.status(403).json({ message: error.message })
    }

    const proyecto = await Proyecto.findById(tarea.proyecto._id)
    proyecto.tareas.pull(tarea._id)

    await Promise.all([await proyecto.save(), await tarea.deleteOne()])

    return res.json({ message: 'Eliminado correctamente' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const cambiarEstado = async (req, res) => {
  const { id } = req.params

  try {
    const tarea = await Tarea.findById(id).populate('proyecto')

    if (!tarea) {
      const error = new Error('No se encontró la tarea')
      return res.status(404).json({ message: error.message })
    }

    if (
      String(tarea.proyecto.creador) !== String(req.usuario._id) &&
      !tarea.proyecto.colaboradores.some(({ _id }) => _id.toString() === req.usuario._id.toString())
    ) {
      const error = new Error('Acción no válida')
      return res.status(403).json({ message: error.message })
    }

    tarea.estado = !tarea.estado
    tarea.completado = req.usuario._id

    await tarea.save()

    res.json({ message: 'Estado Actualizado' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
