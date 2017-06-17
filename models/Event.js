const mongoose = require('mongoose');
const user = require('./User');

const eventSchema = new mongoose.Schema({
  id: String,
  name: String,
  address: String,
  lat: Number,
  lng: Number,
  Category: String,
  dangerLevel: { type: Number, min: 1, max: 10 },
  user: user.schema,
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
