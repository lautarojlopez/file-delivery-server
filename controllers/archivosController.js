const multer = require('multer')
const shortid = require('shortid')
const fs = require('fs')
const Enlace = require('../models/Enlace')

exports.subirArchivo = async (req, res, next) => {

	//Configuracion de Multer
	const configMulter = {
		limits: { fileSize: (req.usuario ? 1024*1024*10 : 1024*1024)},
		storage: fileStorage = multer.diskStorage({
			destination: (req, file, next) => {
				next(null, `${__dirname}/../uploads`)
			},
			filename: (req, file, next) => {
				const extension = file.originalname.split('.').pop()
				next(null, `${shortid.generate()}.${extension}`)
			}
		})
	}

	//Subir Archivo
	const upload = multer(configMulter).single('archivo')
	upload(req, res, (error) => {
		if(!error){
			res.json({archivo: req.file.filename})
		}
		else{
			console.log(error)
			return next()
		}
	})
}

exports.eliminarArchivo = async (req, res) => {
	try {
		//Eliminar el archivo
		fs.unlinkSync(`${__dirname}/../uploads/${req.archivo}`)
	} catch (e) {
		res.send("Error 404 - El archivo no existe")
	}
}

exports.descargar = async (req, res, next) => {

	//Buscar enlace en la base de datos
	const enlace = await Enlace.findOne({
		nombre: req.params.archivo
	})

	//Descargar
	try {
		const file = __dirname + '/../uploads/' + req.params.archivo
		res.download(file)
		//Eliminar el archivo y la entrada de la base de datos
		//Si le quedan mas de una descarga restante, descontar una descarga del total posibles
		const {descargas, nombre} = enlace
		if(descargas > 1){
			enlace.descargas--
			await enlace.save()
		}
		//Sino, eliminar el archivo
		else {
			//El archivo se elimina desde el controlador archivosController
			req.archivo = nombre
			await Enlace.findOneAndRemove(enlace.id)
			return next()
		}
	} catch (e) {
		res.send('Error 404 - El archivo no existe')
	}
}
