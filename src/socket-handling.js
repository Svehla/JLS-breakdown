import openSocket from 'socket.io-client'
// const socket = openSocket('http://mobile-controller.herokuapp.com')
const socket = openSocket('http://localhost:1337')
// const socket = openSocket('http://localhost:5000/')

export const newDirection = cb => {
  socket.on('newDirection', ({ beta, gamma }) => {
    // cb(null, timestamp)
    console.log('dostal jsem novou pozici')
    cb({ beta, gamma })
  })
  //socket.emit('subscribeToTimer', 1000);
}

export const changeCode = (code, cb) => {
  console.log('přelogovávám', code)
  // socket.emit('newAuthCode', code)
  socket.emit('newAuthCode', code)
}