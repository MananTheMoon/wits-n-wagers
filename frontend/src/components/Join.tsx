import React from "react"
import { connect, useDispatch } from "react-redux"
import classnames from "classnames"
import { IState, Dispatch } from "../store/store"
import { setCurrentPlayerAsync, removePlayerAsync } from "../store/thunks"
import { PlayerState } from "../store/gameState"
import { setPlayerState } from "../store/actions"

interface IJoinProps {
  socket?: SocketIOClient.Socket
  players: string[]
  currentPlayer: string
  playerState: PlayerState
  addPlayer: (name: string, socket: SocketIOClient.Socket) => void
  removePlayer: (name: string, socket: SocketIOClient.Socket) => void
}

function JoinUnconnected({
  socket,
  players,
  currentPlayer,
  playerState,
  addPlayer,
  removePlayer,
}: IJoinProps) {
  const [name, setName] = React.useState("")
  const [canJoin, setCanJoin] = React.useState(false)

  const dispatch = useDispatch()

  React.useEffect(() => {
    console.log("Setting up removeYourself")
    socket?.on("removeYourself", () => {
      console.log("Got Here")
      dispatch(setPlayerState(PlayerState.Unconnected))
    })
  }, [socket, setPlayerState, dispatch])

  if (playerState === PlayerState.Connected) {
    return (
      <p className="text-center mt-4">You are connected as: {currentPlayer}</p>
    )
  }

  return (
    <>
      <p className="text-center mt-4">You are not in the game yet.</p>
      <div className="d-flex w-100 justify-content-center">
        <input
          type="text"
          placeholder="Type name here"
          className="mr-2"
          value={name}
          onChange={(e) => {
            const value = e.target.value.replace(/ /g, "")
            setName(value)
            if (value && !players.includes(value)) {
              setCanJoin(true)
            } else {
              setCanJoin(false)
            }
          }}
        />
        <button
          className={classnames("btn btn-primary", {
            disabled: !canJoin,
          })}
          onClick={() => {
            if (canJoin && socket) {
              if (currentPlayer) {
                removePlayer(currentPlayer, socket)
              }
              addPlayer(name, socket)
            }
          }}
        >
          Join
        </button>
      </div>
    </>
  )
}

const mapStateToProps = (state: IState) => ({
  socket: state.socket,
  players: state.players,
  currentPlayer: state.currentPlayer,
  playerState: state.playerState,
})

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    addPlayer: setCurrentPlayerAsync(dispatch),
    removePlayer: removePlayerAsync(dispatch),
  }
}

export const Join = connect(
  mapStateToProps,
  mapDispatchToProps
)(JoinUnconnected)
