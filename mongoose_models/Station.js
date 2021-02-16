const mongoose = require("mongoose")

const Schema = mongoose.Schema

const stationSchema = new Schema({
    name: {type: String, required: true},
    cityId: {type: mongoose.Types.ObjectId, required: true}
})

module.exports = mongoose.model("stations", stationSchema)