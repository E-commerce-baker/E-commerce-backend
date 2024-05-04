const mongoose = require('mongoose')
require('colors');

module.exports.connectToDB = () => {
    mongoose.connect(process.env.MONGO_URI)
        .then((info) => {
            console.log(`Connect To Mongo DB ${info.connection.name}, to host: ${info.connection.host}`.brightYellow)
        })
        .catch (err => { console.log("err connection to Mongo DB"); })
}