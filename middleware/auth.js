const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization')

  if(authHeader){
    try {
      const token = authHeader.split(' ')[1]
      const usuario = jwt.verify(token, process.env.SECRET_KEY)
      req.usuario = usuario
    } catch (e) {
      console.log(e)
      console.log('JWT no válido')
    }
  }
  else{
    return next()
  }

  return next()

}
