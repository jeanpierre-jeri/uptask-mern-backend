import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.js'

const checkAuth = async (req, res, next) => {
  let token = req.headers.authorization || ''

  if (!token || !token.startsWith('Bearer')) {
    const error = new Error('Token no válido')
    return res.status(401).json({ msg: error.message })
  }

  try {
    token = token.split(' ')[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.usuario = await Usuario.findById(decoded.id).select('id nombre email')
    return next()
  } catch (error) {
    return res.status(404).json({ msg: 'Hubo un error', error: error.message })
  }
}

export default checkAuth
