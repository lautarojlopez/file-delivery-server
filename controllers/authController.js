const Usuario = require('../models/Usuario')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')
require('dotenv').config()

exports.autenticarUsuario = async (req, res, next) => {

  //Revisar errores
  const errores = validationResult(req)
  if(!errores.isEmpty()){
    return res.status(400).json({errores: errores.array()})
  }

  //Buscar el usuario en la base de datos
  const {email, password} = req.body
  const usuario = await Usuario.findOne({email})
  if(!usuario){
    res.status(401).json({
      msg: "El usuario no existe"
    })
    return next()
  }
  else {
    if(bcrypt.compareSync(password, usuario.password)){
      const token = jwt.sign({
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email
      }, process.env.SECRET_KEY, {
        expiresIn: '24h'
      })
      return res.json({token})
    }
    else{
      res.status(401).json({
        msg: "Contraseña incorrecta"
      })
      return next()
    }
  }

  //Verificar y autenticar usuario

}

exports.usuarioAutenticado = async (req, res, next) => {
  res.json({usuario: req.usuario})
}
