const express = require('express')
const router = express.Router()
const usuariosController = require('../controllers/usuariosController')
const {check} = require('express-validator')

router.post('/', [
  check('nombre', 'Escribe tu nombre').not().isEmpty(),
  check('email', 'E-mail no válido').isEmail(),
  check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({min: 6})
  ], usuariosController.nuevoUsuario)

module.exports = router
