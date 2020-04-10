import React from "react"
import { IState, Dispatch, IGameData } from "../store/store"
import { GameState } from "../store/gameState"
import { connect, useDispatch } from "react-redux"
import { updateGameData, updateCamUrl } from "../store/actions"
import classnames from "classnames"
import { setPlayersSync, removePlayerAsync } from "../store/thunks"

interface IPlayerProps {
  socket?: SocketIOClient.Socket
  players: string[]
  currentPlayer: string
  gameData: IGameData
  admin?: boolean
  setPlayers: (players) => void
  removePlayer: (name: string, socket: SocketIOClient.Socket) => void
}

export function PlayersListUnconnected({
  socket,
  players,
  currentPlayer,
  admin,
  setPlayers,
  removePlayer,
  gameData,
}: IPlayerProps) {
  const dispatch = useDispatch()
  React.useEffect(() => {
    socket?.on("listPlayers", (socket_players) => {
      setPlayers(socket_players)
    })
    socket?.on("gameData", (gameData: IGameData) => {
      console.log(gameData)
      dispatch(updateGameData(gameData))
    })

    socket?.on("camUrl", (camUrl: string) => {
      dispatch(updateCamUrl(camUrl))
    })
  }, [currentPlayer, dispatch, setPlayers, socket])

  return (
    <div className="mt-5 text-center">
      <b>Joined Players:</b>
      <div className="d-flex flex-row justify-content-center">
        {players.map((player) => {
          const isCurrentPlayer = player === currentPlayer

          let showCheckmark = false
          if (gameData.gameState === GameState.Guessing) {
            showCheckmark = Object.keys(gameData.guesses).includes(player)
          }

          return (
            <div
              className="badge d-flex flex-row align-items-center border mr-2"
              style={{ height: 30 }}
            >
              <div
                className={classnames({
                  "text-primary": isCurrentPlayer,
                  "font-weight-bold": isCurrentPlayer,
                })}
              >
                <div>
                  {player}
                  {showCheckmark && <span className="ml-2">✅</span>}
                </div>
              </div>
              {admin && (
                <button
                  type="button"
                  className="close ml-2"
                  aria-label="Close"
                  onClick={() => {
                    if (socket) {
                      removePlayer(player, socket)
                    }
                  }}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const mapStateToProps = (state: IState) => ({
  socket: state.socket,
  players: state.players,
  currentPlayer: state.currentPlayer,
  gameData: state.gameData,
})

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setPlayers: setPlayersSync(dispatch),
    removePlayer: removePlayerAsync(dispatch),
  }
}

export const PlayersList = connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayersListUnconnected)
