import React from "react"
import { connect } from "react-redux"
import { IState, Dispatch, IGameData } from "../store/store"
import {
  setGameStateAsync,
  setQuestionAsync,
  setMoneyAsync,
} from "../store/thunks"
import { PlayersList } from "../components/PlayersList"
import { GameState } from "../store/gameState"

interface IAdminProps {
  socket?: SocketIOClient.Socket
  gameData: IGameData
  removePlayer: (name: string, socket: SocketIOClient.Socket) => void
  setGameState: (gameState: GameState, socket: SocketIOClient.Socket) => void
  setQuestion: (question: string, socket: SocketIOClient.Socket) => void
  setMoney: (
    player: string,
    money: number,
    socket: SocketIOClient.Socket
  ) => void
}

function AdminUnconnected({
  socket,
  gameData,
  setGameState,
  setQuestion,
  setMoney,
}: IAdminProps) {
  const [questionInput, setQuestionInput] = React.useState(gameData.question)
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

      <div className="d-flex flex-row justify-content-start mt-2">
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
      <hr />
      <MoneyEditor gameData={gameData} socket={socket} setMoney={setMoney} />
    </div>
  )
}

interface IMoneyEditorProps {
  socket?: SocketIOClient.Socket
  gameData: IGameData
  setMoney: (
    player: string,
    money: number,
    socket: SocketIOClient.Socket
  ) => void
}

function MoneyEditor({ socket, gameData, setMoney }: IMoneyEditorProps) {
  const [moneyInput, setMoneyInput] = React.useState("")
  return (
    <div>
      <div className="h4">Money Edit</div>
      {Object.keys(gameData.money).map((player) => {
        return (
          <div className="d-flex flex-row justify-content-start align-items-center">
            <div className="mr-2">
              {player}: ${gameData.money[player]}
            </div>
            <input
              type="number"
              value={moneyInput}
              onChange={(e) => {
                const value = Number(e.target.value)
                if (!isNaN(value)) {
                  setMoneyInput(e.target.value)
                }
              }}
            />
            <button
              onClick={() => {
                socket && setMoney(player, Number(moneyInput), socket)
              }}
            >
              Update
            </button>
          </div>
        )
      })}
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
    setGameState: setGameStateAsync(dispatch),
    setQuestion: setQuestionAsync(dispatch),
    setMoney: setMoneyAsync(dispatch),
  }
}

export const Admin = connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminUnconnected)
