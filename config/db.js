const mongoose = require('mongoose')
require('dotenv').config()

const connectDB = async () => {

  try {
    await mongoose.connect(process.env.DB_URL)
  } catch (e) {
    console.log(e)
    process.exit(1)
  }

}

module.exports = connectDB
