import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import conectarDB from './config/db.js'
import usuarioRouter from './routes/usuario.routes.js'
import proyectoRouter from './routes/proyecto.routes.js'
import tareaRouter from './routes/tarea.routes.js'
import checkAuth from './middleware/checkAuth.middleware.js'

const app = express()
app.use(express.json())

dotenv.config()

// Configurar CORS

const whiteList = [process.env.FRONTEND_URL]

const corsOptions = {
  origin: whiteList,
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

// Routing

app.use('/api/usuarios', usuarioRouter)
app.use('/api/proyectos', checkAuth, proyectoRouter)
app.use('/api/tareas', checkAuth, tareaRouter)

const PORT = process.env.PORT || 4000

const startApp = async () => {
  try {
    await conectarDB()
    app.listen(PORT, () => {
      console.log('Servidor corriendo en puerto', PORT)
    })
  } catch (error) {
    console.log('Error:', error)
    process.exit(1)
  }
}

startApp()
