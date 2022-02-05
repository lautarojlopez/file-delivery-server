const mongoose = require('mongoose')
const Schema = mongoose.Schema

const enlaceSchema = new Schema({
  url: {
    type: String,
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  nombre_original: {
    type: String,
    required: true
  },
  descargas: {
    type: Number,
    default: 1
  },
  autor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    default: null
  },
  password: {
    type: String,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now()
  }
})

module.exports = mongoose.model('Enlace', enlaceSchema)
