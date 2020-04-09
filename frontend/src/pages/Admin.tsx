import React from "react"
import { connect } from "react-redux"
import { IState, Dispatch, IGameData } from "../store/store"
import { removePlayerAsync, setGameStateAsync } from "../store/thunks"
import { PlayersList } from "../components/PlayersList"
import { GameState } from "../store/gameState"

interface IAdminProps {
  socket?: SocketIOClient.Socket
  gameData: IGameData
  removePlayer: (name: string, socket: SocketIOClient.Socket) => void
  setGameState: (gameState: GameState, socket: SocketIOClient.Socket) => void
}

export function AdminUnconnected({
  socket,
  gameData,
  removePlayer,
  setGameState,
}: IAdminProps) {
  console.log("rerender")
  return (
    <div>
      <p className="text-center h2">Admin Page</p>
      <div className="d-flex flex-row">
        <button
          onClick={() => socket && setGameState(GameState.Guessing, socket)}
        >
          Start Guessing
        </button>
        <button
          className="ml-2"
          onClick={() => socket && setGameState(GameState.Bidding, socket)}
        >
          Start Bidding
        </button>
        <button
          className="ml-2"
          onClick={() => socket && setGameState(GameState.Unstarted, socket)}
        >
          End Turn
        </button>
        <div className="ml-2">Current Mode: {gameData.gameState}</div>
      </div>
      <PlayersList admin={true} />
    </div>
  )
}

const mapStateToProps = (state: IState) => ({
  socket: state.socket,
  gameData: state.gameData,
  players: state.players,
})

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    removePlayer: removePlayerAsync(dispatch),
    setGameState: setGameStateAsync(dispatch),
  }
}

export const Admin = connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminUnconnected)
