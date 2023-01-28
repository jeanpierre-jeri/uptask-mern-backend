import Proyecto from '../models/Proyecto.js'
import Usuario from '../models/Usuario.js'
import { idMongooseValida } from '../helpers/validarMongoose.js'

export const obtenerProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find({ creador: req.usuario._id }).select('-tareas')
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
    const proyecto = await Proyecto.findById(id)
      .where('creador')
      .equals(req.usuario._id)
      .populate({ path: 'tareas', options: { sort: { updatedAt: -1 } } })

    if (!proyecto) {
      const error = new Error('No se encontro el proyecto')
      return res.status(404).json({ message: error.message })
    }

    return res.json(proyecto)
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
    return res.status(500).json({ message: error.message })
  }
}

export const buscarColaborador = async (req, res) => {
  const { email } = req.body

  const usuario = await Usuario.findOne({ email }).select('_id email nombre')

  if (!usuario) {
    const error = new Error('Usuario no encontrado')
    return res.status(404).json({ message: error.message })
  }

  return res.json(usuario)
}

export const agregarColaborador = async (req, res) => {
  const { id } = req.params
  const { colaboradorId } = req.body

  if (!idMongooseValida(id)) {
    return res.status(400).json({ message: 'Id de proyecto no válida' })
  }

  if (!idMongooseValida(colaboradorId)) {
    return res.status(400).json({ message: 'Id de colaborador no válida' })
  }

  try {
    const proyecto = await Proyecto.findById(id)

    if (!proyecto) {
      const error = new Error('Proyecto no encontrado')
      return res.status(404).json({ message: error.message })
    }

    // Se valida que no se puede añadir como colaborador
    // al creador del proyecto
    if (proyecto.creador.toString() === colaboradorId.toString()) {
      const error = new Error('El creador del Proyecto no puede ser colaborador')
      return res.status(400).json({ message: error.message })
    }

    // Valida que el colaborador no este ya en el proyecto
    if (proyecto.colaboradores.includes(colaboradorId)) {
      const error = new Error('El usuario ya pertenece al proyecto')
      return res.status(400).json({ message: error.message })
    }

    proyecto.colaboradores.push(colaboradorId)

    await proyecto.save()

    return res.json({ message: 'Colaborador agregado correctamente' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const eliminarColaborador = async (req, res) => {}
