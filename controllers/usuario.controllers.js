import Usuario from '../models/Usuario.js'
import { generarId } from '../helpers/generarId.js'
import { generarJWT } from '../helpers/generarJWT.js'
import { emailOlvidePassword, emailRegistro } from '../helpers/email.js'

export const registrar = async (req, res) => {
  const { email } = req.body

  const existeUsuario = await Usuario.findOne({ email })

  if (existeUsuario) {
    const error = new Error('Usuario ya registrado')
    return res.status(400).json({ message: error.message })
  }

  try {
    const usuario = new Usuario(req.body)

    usuario.token = generarId()

    const { nombre, email, token } = await usuario.save()

    // Enviar email confirmacion
    await emailRegistro({ nombre, email, token })

    return res.status(201).json({ message: 'Usuario Creado Correctamente, Revisa tu Email para confirmar tu cuenta' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const autenticar = async (req, res) => {
  const { email, password } = req.body
  // Comprobar si el usuario existe

  const usuario = await Usuario.findOne({ email })

  if (!usuario) {
    const error = new Error('El usuario no existe')
    return res.status(404).json({ message: error.message })
  }

  // Comprobar si el usuario esta confirmado

  if (!usuario.confirmado) {
    const error = new Error('Tu cuenta no ha sido confirmada')
    return res.status(403).json({ message: error.message })
  }

  // Comprobar su password

  const passwordMatches = await usuario.comprobarUsuario(password)

  if (!passwordMatches) {
    const error = new Error('El password es incorrecto')
    return res.status(403).json({ message: error.message })
  }

  return res.json({
    _id: usuario._id,
    nombre: usuario.nombre,
    email: usuario.email,
    token: generarJWT(usuario._id)
  })
}

export const confirmar = async (req, res) => {
  const { token } = req.params
  const usuarioConfirmar = await Usuario.findOne({ token })

  if (!usuarioConfirmar) {
    const error = new Error('Token no válido')
    return res.status(403).json({ message: error.message })
  }

  try {
    usuarioConfirmar.confirmado = true
    usuarioConfirmar.token = ''
    await usuarioConfirmar.save()
    return res.json({ message: 'Usuario confirmado correctamente' })
  } catch (error) {
    return res.json({ message: error.message })
  }
}

export const olvidePassword = async (req, res) => {
  const { email } = req.body

  const usuario = await Usuario.findOne({ email })

  if (!usuario) {
    const error = new Error('El usuario no existe')
    return res.status(404).json({ message: error.message })
  }

  try {
    usuario.token = generarId()
    const { nombre, email, token } = await usuario.save()

    // Enviar email confirmacion
    await emailOlvidePassword({ nombre, email, token })
    return res.json({ message: 'Hemos enviado un email con las instrucciones' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const comprobarToken = async (req, res) => {
  const { token } = req.params

  const usuario = await Usuario.findOne({ token })

  if (!usuario) {
    const error = new Error('Token no válido')
    return res.status(404).json({ message: error.message })
  }

  return res.json({ message: 'Token válido y el usuario existe' })
}

export const nuevoPassword = async (req, res) => {
  const { password } = req.body
  const { token } = req.params

  const usuario = await Usuario.findOne({ token })

  if (!usuario) {
    const error = new Error('Token no válido')
    return res.status(404).json({ message: error.message })
  }

  try {
    usuario.password = password
    usuario.token = ''
    await usuario.save()
    return res.json({ message: 'Password cambiado correctamente' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const perfil = async (req, res) => {
  const { usuario } = req

  return res.json(usuario)
}
