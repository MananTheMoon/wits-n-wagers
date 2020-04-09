import React from "react"
import { connect } from "react-redux"
import { IState, Dispatch, IGameData } from "../store/store"
import {
  setGameStateAsync,
  setCamUrlAsync,
  setQuestionAsync,
} from "../store/thunks"
import { PlayersList } from "../components/PlayersList"
import { GameState } from "../store/gameState"

interface IAdminProps {
  socket?: SocketIOClient.Socket
  gameData: IGameData
  camUrl: string
  removePlayer: (name: string, socket: SocketIOClient.Socket) => void
  setGameState: (gameState: GameState, socket: SocketIOClient.Socket) => void
  setCamUrl: (camUrl: string, socket: SocketIOClient.Socket) => void
  setQuestion: (question: string, socket: SocketIOClient.Socket) => void
}

export function AdminUnconnected({
  socket,
  gameData,
  camUrl,
  setGameState,
  setCamUrl,
  setQuestion,
}: IAdminProps) {
  console.log("rerender")
  const [urlInput, setUrlInput] = React.useState(camUrl)
  const [questionInput, setQuestionInput] = React.useState(gameData.question)
  React.useEffect(() => {
    setUrlInput(camUrl)
  }, [setUrlInput, camUrl])
  return (
    <div className="p-2">
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

      <div className="d-flex flex-row justify-content-start">
        <input
          type="text"
          placeholder="Question"
          className="mr-2"
          value={questionInput}
          onChange={(e) => {
            setQuestionInput(e.target.value)
          }}
        ></input>
        <button onClick={() => socket && setQuestion(questionInput, socket)}>
          Set Question
        </button>
        <div>Current Question: {gameData.question}</div>
      </div>

      <div className="d-flex flex-row justify-content-start">
        <input
          type="text"
          placeholder="IP Cam Address"
          className="mr-2"
          value={urlInput}
          onChange={(e) => {
            setUrlInput(e.target.value)
          }}
        ></input>
        <button onClick={() => socket && setCamUrl(urlInput, socket)}>
          Set URL
        </button>
      </div>
    </div>
  )
}

const mapStateToProps = (state: IState) => ({
  socket: state.socket,
  gameData: state.gameData,
  players: state.players,
  camUrl: state.camUrl,
})

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setGameState: setGameStateAsync(dispatch),
    setCamUrl: setCamUrlAsync(dispatch),
    setQuestion: setQuestionAsync(dispatch),
  }
}

export const Admin = connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminUnconnected)
