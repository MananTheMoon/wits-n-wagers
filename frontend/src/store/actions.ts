import { createAction, ActionType } from "typesafe-actions"
import { PlayerState, GameState } from "./gameState"
import { IGameData } from "./store"

export const addSocket = createAction("ADD_SOCKET")<SocketIOClient.Socket>()

export const setPlayers = createAction("SET_PLAYERS")<string[]>()

export const setCurrentPlayer = createAction("SET_CURRENT_PLAYER")<string>()

export const removePlayer = createAction("REMOVE_PLAYER")<string>()

export const setPlayerState = createAction("SET_PLAYER_STATE")<PlayerState>()

export const setGameState = createAction("SET_GAME_STATE")<GameState>()

export const updateGameData = createAction("SET_GAME_DATA")<IGameData>()

export const updateCamUrl = createAction("SET_CAM_URL")<string>()

export type IActions =
  | ActionType<typeof addSocket>
  | ActionType<typeof setPlayers>
  | ActionType<typeof setCurrentPlayer>
  | ActionType<typeof removePlayer>
  | ActionType<typeof setPlayerState>
  | ActionType<typeof updateGameData>
  | ActionType<typeof updateCamUrl>
