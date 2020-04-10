import React from "react"
import { connect, useDispatch } from "react-redux"
import { IGameData, IState } from "../store/store"
import { updateGameData } from "../store/actions"
import { Question } from "../components/Question"

interface IQuestionProps {
  socket?: SocketIOClient.Socket
  gameData: IGameData
}

function QuestionPageUnconnected({ socket, gameData }: IQuestionProps) {
  const dispatch = useDispatch()

  React.useEffect(() => {
    socket?.on("gameData", (gameData: IGameData) => {
      dispatch(updateGameData(gameData))
    })
  }, [dispatch, socket])
  return (
    <div className="d-flex p-3 justify-content-center">
      {gameData.question && <Question />}
    </div>
  )
}

const mapStateToProps = (state: IState) => ({
  socket: state.socket,
  gameData: state.gameData,
})

export const QuestionPage = connect(mapStateToProps)(QuestionPageUnconnected)
