import express from 'express'
import dotenv from 'dotenv'
import conectarDB from './config/db.js'

const app = express()

dotenv.config()

conectarDB()

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log('Servidor corriendo en puerto', PORT)
})
