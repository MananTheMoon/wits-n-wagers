import React from "react"
import { connect, useDispatch } from "react-redux"
import { IGameData, IState } from "../store/store"
import { updateGameData } from "../store/actions"

interface IMoneyProps {
  socket?: SocketIOClient.Socket
  gameData: IGameData
}

function MoneyUnconnected({ socket, gameData }: IMoneyProps) {
  const dispatch = useDispatch()

  React.useEffect(() => {
    socket?.on("gameData", (gameData: IGameData) => {
      dispatch(updateGameData(gameData))
    })
  }, [dispatch, socket])
  return (
    <div
      className="m-2 p-2 d-flex flex-column text-white justify-content-center"
      style={{ backgroundColor: "#9e9a15" }}
    >
      <div className="h5 mb-2">Money:</div>
      {gameData &&
        Object.keys(gameData.money).map((player) => {
          return (
            <div className="mr-2">
              {player}: <b>${gameData.money[player]}</b>
            </div>
          )
        })}
    </div>
  )
}

const mapStateToProps = (state: IState) => ({
  socket: state.socket,
  gameData: state.gameData,
})

export const Money = connect(mapStateToProps)(MoneyUnconnected)
