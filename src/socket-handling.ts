import openSocket from 'socket.io-client'
// const socket = openSocket('http://mobile-controller.herokuapp.com')
const socket = openSocket('http://localhost:1337')
// const socket = openSocket('http://localhost:5000/')

// insert to componentDIdMount ->
/*
 newDirection(({ beta, gamma }: any) => {
   this.handleOrientation({ beta, gamma })
 })
 */

export const newDirection = (cb: any) => {
  socket.on('newDirection', ({ beta, gamma }: any) => {
    // cb(null, timestamp)
    console.info('i got new position')
    cb({ beta, gamma })
  })
  //socket.emit('subscribeToTimer', 1000);
}

export const changeCode = (code: any, cb: any) => {
  console.info('přelogovávám', code)
  // socket.emit('newAuthCode', code)
  socket.emit('newAuthCode', code)
}
