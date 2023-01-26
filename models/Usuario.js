import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const usuarioSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    token: {
      type: String
    },
    confirmado: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

// Encriptar contraseña
usuarioSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Comprobar validez de contraseña
usuarioSchema.methods.comprobarUsuario = async function (formPassword) {
  return await bcrypt.compare(formPassword, this.password)
}

const Usuario = mongoose.model('Usuario', usuarioSchema)
export default Usuario
