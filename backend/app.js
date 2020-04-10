const express = require("express")
const http = require("http")
const socketIo = require("socket.io")
const axios = require("axios")

const port = process.env.PORT || 5000

const app = express()
// app.use(index)

const path = require("path")
// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, "../frontend/build")))
app.get("*", function (req, res) {
  res.sendFile("index.html", {
    root: path.join(__dirname, "../frontend/build"),
  })
})

const server = http.createServer(app)

const io = socketIo(server)

let interval

let players = {}
let camUrl = ""
const payouts = [6, 5, 4, 3, 2, 3, 4, 5]

let gameData = {
  gameState: "UNSTARTED",
  question: "",
  guesses: {
    //"devin":
  },
  buckets: {
    // 0: { guessers: ["devin", "manan"], value: "32", bids: {"devin": 50, "robert": 35}}
  },
}

const sendGameData = async () => {
  console.log("Sending GameData")
  io.emit("gameData", gameData)
}

io.on("connection", (socket) => {
  console.log("New client connected")
  socket.emit("listPlayers", players)
  socket.emit("camUrl", camUrl)
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
    if (gameState == "UNSTARTED") {
      gameData.guesses = {}
      gameData.buckets = {}
    }
    if (gameState == "BIDDING") {
      gameData.buckets = {}
      const unique_guesses = [...new Set(Object.values(gameData.guesses))].sort(
        (a, b) => a - b
      )

      // Number of blank buckets to pad on either side
      guesses_padding = Math.floor((7 - unique_guesses.length) / 2)
      for (let i = 0; i < guesses_padding; i++) {
        unique_guesses.push(null)
        unique_guesses.unshift(null)
      }
      if (unique_guesses.length < 7) {
        unique_guesses.splice(3, 0, null)
      }
      unique_guesses.unshift(0) // To add bucket for less than smallest
      console.log(unique_guesses)
      for (let i = 0; i < 8; i++) {
        let bucket = {
          payout: payouts[i],
          guessers: [],
          value: unique_guesses[i],
          bids: {},
        }
        Object.keys(players).forEach((player) => {
          if (gameData.guesses[player] === unique_guesses[i]) {
            bucket.guessers = [...bucket.guessers, player]
          }
        })

        gameData.buckets[i] = bucket
      }
      console.log(gameData.buckets)
    }
    sendGameData()
  })

  socket.on("setCamUrl", (inputCamUrl) => {
    camUrl = inputCamUrl
    io.emit("camUrl", camUrl)
  })

  socket.on("setQuestion", (question) => {
    gameData.question = question
    sendGameData()
  })

  socket.on("setGuess", (playerGuess) => {
    gameData.guesses = { ...gameData.guesses, ...playerGuess }
    console.log(gameData.guesses)
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
