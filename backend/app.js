const express = require("express")
const http = require("http")
const socketIo = require("socket.io")
const axios = require("axios")

const port = process.env.PORT || 5000
const index = require("./routes/index")

const app = express()
// app.use(index)

const path = require("path")
// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, "frontend/build")))

const server = http.createServer(app)

const io = socketIo(server)

// const getApiAndEmit = async (socket) => {
//   socket.emit("FromAPI", "Howdy")
// }

let interval

let players = {}

let gameData = {
  gameState: "UNSTARTED",
  guesses: {
    //"devin":
  },
  buckets: {
    // 1: { guess_key: "devin", bids: {"devin": 50, "robert": 35}}
  },
}

const sendGameData = async () => {
  console.log("Sending GameData")
  io.emit("gameData", gameData)
}

io.on("connection", (socket) => {
  console.log("New client connected")
  socket.emit("listPlayers", players)
  sendGameData()

  if (interval) {
    clearInterval(interval)
  }

  socket.on("addPlayer", (name) => {
    players = { ...players, [name]: socket.id }
    console.log(players)
    console.log("....")
    io.emit("listPlayers", players)
  })

  socket.on("removePlayer", (name) => {
    const removed_player_socket = players[name]
    io.to(removed_player_socket).emit("removeYourself")
    delete players[name]
    io.emit("listPlayers", players)
  })

  socket.on("setGameState", (gameState) => {
    gameData.gameState = gameState
    sendGameData()
  })

  interval = setInterval(() => sendGameData(socket), 10000)
  socket.on("disconnect", () => {
    console.log("Client disconnected")
    const user = Object.keys(players).find((key) => players[key] === socket.id)
    delete players[user]
    io.emit("listPlayers", players)
  })
})

server.listen(port, () => console.log(`Listening on port ${port}`))
