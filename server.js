const express = require('express')
const path = require('path')
const http = require('http')
const PORT = process.env.PORT || 3000
const socketio = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketio(server)

//Set static folder
app.use(express.static(path.join(__dirname, "public")))

//Start server
server.listen(PORT, () => console.log(`I see you homeslice at port ${PORT}`))

// Handle a socket connection request from web client

const connections = [null, null]
io.on('connection', socket => {
// console.log('New WS Connection Dude')

//Find an available player number
let playerIndex = -1
for(const i in connections) {
    if(connections[i] === null) {
        playerIndex = i
        break
    }
}

//Tell connecting client what num player they are
socket.emit('player-number', playerIndex)

console.log(`Champion ${playerIndex} has connected`)

// Ignore Player 3
if (playerIndex === -1) return

connections[playerIndex] = false

// // Tell peeps what player num connected
socket.broadcast.emit('player-connection', playerIndex)

// Handle Disconnect
socket.on('disconnect', () => {
    console.log(`Champion ${playerIndex} disconnected`)
    connections[playerIndex] = null

//Tell everyone what Champion disconnected
socket.broadcast.emit('player-connection', playerIndex)
})
})