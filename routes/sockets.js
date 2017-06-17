

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('new user connected');

    socket.on('newEvent', (e) => {
      console.log('Event sent to backend: ', e);

    });
    //
    // socket.on('newUser', (data) => {
    //   console.log('new user', data);
    //   io.emit('broadcast location', data);
    // })
  });
}
