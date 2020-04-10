import { Dispatch } from "./store"
import { setCurrentPlayer, removePlayer, setPlayers } from "./actions"
import { GameState } from "./gameState"
import { IBids } from "../components/Bidding"

export const setCurrentPlayerAsync = (dispatch: Dispatch) => async (
  name: string,
  socket: SocketIOClient.Socket
) => {
  dispatch(setCurrentPlayer(name))
  socket.emit("addPlayer", name)
  window.localStorage.name = name
  // TODO (Manan) - Add player name to local storage
}

export const removePlayerAsync = (dispatch: Dispatch) => async (
  name: string,
  socket: SocketIOClient.Socket
) => {
  socket.emit("removePlayer", name)
  dispatch(removePlayer(name))
}

export const setPlayersSync = (dispatch: Dispatch) => (players) => {
  dispatch(setPlayers(Object.keys(players)))
}

export const setGameStateAsync = (dispatch: Dispatch) => async (
  gameState: GameState,
  socket: SocketIOClient.Socket
) => {
  socket.emit("setGameState", gameState)
}

export const setCamUrlAsync = (dispatch: Dispatch) => async (
  camUrl: string,
  socket: SocketIOClient.Socket
) => {
  socket.emit("setCamUrl", camUrl)
}

export const setQuestionAsync = (dispatch: Dispatch) => async (
  question: string,
  socket: SocketIOClient.Socket
) => {
  socket.emit("setQuestion", question)
}

export const setGuessAsync = (dispatch: Dispatch) => async (
  player: string,
  guess: number,
  socket: SocketIOClient.Socket
) => {
  socket.emit("setGuess", { [player]: guess })
}

export const setBidsAsync = (dispatch: Dispatch) => async (
  player: string,
  bids: IBids,
  socket: SocketIOClient.Socket
) => {
  socket.emit("setBids", player, bids)
}
