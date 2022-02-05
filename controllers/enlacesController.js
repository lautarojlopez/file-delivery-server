const Enlace = require('../models/Enlace')
const shortid = require('shortid')
const bcrypt = require('bcrypt')
const {validationResult} = require('express-validator')

exports.nuevoEnlace = async (req, res, next) => {

  //Verificar si hay errores
  const errores = validationResult(req)
  if(!errores.isEmpty()){
    return res.status(400).json({errores: errores.array()})
  }

  //Leer datos del body
  const {nombre_original, nombre} = req.body

  //Crear enlace
  const enlace = new Enlace()
  enlace.url = shortid.generate()
  enlace.nombre = nombre
  enlace.nombre_original = nombre_original

  //Si el usuario está registrado
  if(req.usuario){
    const {password, descargas} = req.body
    //Asignar numero de descargas posibles
    if(descargas){
      enlace.descargas = descargas
    }
    //Asignar contraseña del archivo
    if(password){
      //Hashear password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)
      enlace.password = hashedPassword
    }
    //Asignar id del autor
    enlace.autor = req.usuario.id
  }

  //Guardar enlace
  try {
    await enlace.save()
    res.json({msg: `${enlace.url}`})
    return next()
  } catch (e) {
    console.log(e)
  }
}

exports.obtenerEnlace = async (req, res, next) => {
	//Verificar si existe el enlace
	const {url} = req.params
	const enlace = await Enlace.findOne({url})
	if(!enlace){
		res.status(404).json({msg: "El enlace no existe"})
		return next()
	}
	else{
		res.json({url:enlace.url ,archivo: enlace.nombre, nombre: enlace.nombre_original, descargas: enlace.descargas, password: enlace.password})
	}

	next()

}

//Obtener todos los enlaces
exports.listarEnlaces = async (req, res) => {
	try {
		const response = await Enlace.find({}).select('url -_id')
		res.json({enlaces: response})
	} catch (e) {
		console.log(e)
	}
}

//Verificar contraseña
exports.verificarPassword = async (req, res, next) => {

	const {password} = req.body
	const {url} = req.params

	const enlace = await Enlace.findOne({url})
	const verify = await bcrypt.compare(password, enlace.password)

	if(verify){
		return res.json(verify)
	}
	else{
		return res.status(401).json({msg: 'Contraseña Incorrecta'})
	}
}
