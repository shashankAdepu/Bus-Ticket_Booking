const mongoose = require('mongoose')

const busesSchema = new mongoose.Schema({
    bus_name: { type: String },
    bus_type: { type: String },
    from: { type: String },
    to: { type: String },
    date: { type: String },
    arrival_time: { type: String },
    departure_time: { type: String },
    total_seats: { type: Number },
    available_seats: { type: Number },
    booked_seats: { type: Number },
    fare: { type: Number },
    leftSideSeats: { type: String },
    rightSideSeats: { type: String}
})

module.exports = mongoose.model('Buses', busesSchema)