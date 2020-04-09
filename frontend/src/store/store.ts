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
  setGameData,
} from "./actions"
import { GameState, PlayerState } from "./gameState"
import socketIOClient from "socket.io-client"

const server_url = "http://localhost:4001"

export interface IGameData {
  gameState: GameState
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
}

const emptyStore = {
  gameData: {
    gameState: GameState.Unstarted,
    guesses: {},
    buckets: {},
  },
  playerState: PlayerState.Unconnected,
  currentPlayer: "",
  players: [],
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
    case getType(setGameData):
      return {
        ...state,
        gameData: action.payload,
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
