/* Server side */

const uuid = require('uuid/v4');
const mongoose = require('mongoose');
const eventdb = require('../models/Event');
const user = require('../models/User');


module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('new user connected');

    // gets array of events from db
    // createEvent emits the array to client side (main.js)
    function getItems(createEvent) {
      eventdb.find({}, (err, eventArr) => {
        if (err) {
          console.log(err);
          return;
        }
        createEvent(eventArr);
      })
    }

    getItems(function(eventArr) {
      socket.emit('getExistingEvents', eventArr)
    })


    socket.on('newEvent', (e) => {
      console.log('Event sent to backend: ', e);
      let newEvent = new eventdb({
        id: uuid(),
        name: e.name,
        address: e.address,
        lat: e.lat,
        lng: e.lng,
        Category: e.Category,
        dangerLevel: e.dangerLevel,


      });

      newEvent.save((err) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log('newEvent created');
      })

    });
    //
    // socket.on('newUser', (data) => {
    //   console.log('new user', data);
    //   io.emit('broadcast location', data);
    // })
  });
}
