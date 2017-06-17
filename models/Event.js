import mongoose from 'mongoose';
import user from './User';

const eventSchema = new mongoose.Schema({
  id: Number,
  name: String,
  address: String,
  lat: Number,
  lng: Number,
  Category: String,
  dangerLevel: { type: Number, min: 1, max: 10 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
