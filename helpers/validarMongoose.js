import mongoose from 'mongoose'

export const idMongooseValida = (id) => {
  return mongoose.Types.ObjectId.isValid(id)
}
