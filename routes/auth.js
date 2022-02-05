const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const {check} = require('express-validator')
const auth = require('../middleware/auth')

router.post('/', [
  check('email', 'E-mal no válido').isEmail(),
  check('password', 'Escribe tu contraseña').not().isEmpty()
], authController.autenticarUsuario)

router.get('/', auth, authController.usuarioAutenticado)

module.exports = router
