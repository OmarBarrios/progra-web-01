const mongoose = require("mongoose");
const config = require("../config/db.config.js");

const mongoString = config.MONGODB_URI;

mongoose.connect(mongoString)
const database = mongoose.connection

database.on('error', (error) => {
    console.error(error)
})

database.once('connected', () => {
    console.log('Database Connected')
})

module.exports = database