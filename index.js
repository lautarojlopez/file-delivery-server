const express = require('express')
const connectDB = require('./config/db')
const cors = require('cors')

//App
const app = express()

//Variables de entorno
require('dotenv').config()

//Conectar a MongoDB
connectDB()

//Habilitar CORS
app.use(cors())

//Leer valores del body
app.use(express.json())

//Public
app.use( express.static('uploads') )

//Rutas
app.use('/api/usuarios', require('./routes/usuarios'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/enlaces', require('./routes/enlaces'))
app.use('/api/archivos', require('./routes/archivos'))

const port = process.env.PORT || 4000
app.listen(port, '0.0.0.0')
