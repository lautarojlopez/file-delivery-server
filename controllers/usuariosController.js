const Usuario = require('../models/Usuario')
const bcrypt = require('bcrypt')
const {validationResult} = require('express-validator')

exports.nuevoUsuario = async (req, res) => {
  try {

    //Verificar si hay errores
    const errores = validationResult(req)
    if(!errores.isEmpty()){
      return res.status(400).json({errores: errores.array()})
    }

    //Leer datos del body
    const {email, password} = req.body

    //Verificar si ya existe un usuario con ese email
    let usuario = await Usuario.findOne({email})
    if(usuario){
      return res.status(400).json({
        msg: "Ya existe un usuario con ese e-mail"
      })
    }
    else{
      //Crear y guardar el usuario en la base de datos
      usuario = new Usuario(req.body)
      const salt = await bcrypt.genSalt(10)
      usuario.password = await bcrypt.hash(password, salt)
      await usuario.save()
      return res.json({
        msg: "Tu cuenta ha sido creada"
      })
    }
  } catch (e) {
    console.log(e)
  }
}
