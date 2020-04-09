import {
  createStore as reduxCreateStore,
  Dispatch as ReduxDispatch,
} from "redux"
import { getType } from "typesafe-actions"
import {
  addSocket,
  setCurrentPlayer,
  IActions,
  setPlayers,
  setPlayerState,
  updateGameData,
  updateCamUrl,
} from "./actions"
import { GameState, PlayerState } from "./gameState"
import socketIOClient from "socket.io-client"

// const server_url = "http://localhost:4001"
// const server_url = "http://localhost:5000"
// const server_url = "https://wits-n-wagers.herokuapp.com/"
const server_url = process.env.server_url || "http://localhost:5000"

export interface IGameData {
  gameState: GameState
  question: string
  guesses: {
    [key: string]: number
  }
  buckets: {
    [key: number]: {
      guess_key: string
      bids: {
        [key: string]: number
      }
    }
  }
}

export interface IState {
  playerState: PlayerState
  socket?: SocketIOClient.Socket
  currentPlayer: string
  players: string[]
  gameData: IGameData
  camUrl: string
}

const emptyStore = {
  gameData: {
    question: "",
    gameState: GameState.Unstarted,
    guesses: {},
    buckets: {},
  },
  playerState: PlayerState.Unconnected,
  currentPlayer: "",
  players: [],
  camUrl: "",
}

function game(state: IState = emptyStore, action: IActions) {
  switch (action.type) {
    case getType(addSocket):
      return {
        ...state,
        socket: action.payload,
      }
    case getType(setCurrentPlayer):
      return {
        ...state,
        currentPlayer: action.payload,
        playerState: PlayerState.Connected,
      }
    case getType(setPlayers):
      return {
        ...state,
        players: action.payload,
      }
    case getType(setPlayerState):
      return {
        ...state,
        playerState: action.payload,
      }
    case getType(updateGameData):
      return {
        ...state,
        gameData: action.payload,
      }
    case getType(updateCamUrl):
      return {
        ...state,
        camUrl: action.payload,
      }
    default:
      return state
  }
}

export const createStore = () => {
  const store = reduxCreateStore(game)
  const socket = socketIOClient(server_url)
  store.dispatch(addSocket(socket))
  return store
}

export type Dispatch = ReduxDispatch<IActions>
