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
import { BidSpot } from "../components/Bidding"
import "../components/Bidding.css"

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
      <div className="d-flex flex-row">
        <MoneyEditors gameData={gameData} socket={socket} setMoney={setMoney} />
        <AdminBidSpots gameData={gameData} />
      </div>
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

function MoneyEditors({ socket, gameData, setMoney }: IMoneyEditorProps) {
  return (
    <div>
      <div className="h4 text-center">Money Edit</div>
      {Object.keys(gameData.money).map((player) => {
        return (
          <MoneyEditor
            gameData={gameData}
            socket={socket}
            setMoney={setMoney}
            player={player}
          />
        )
      })}
    </div>
  )
}

function MoneyEditor({
  socket,
  gameData,
  player,
  setMoney,
}: {
  socket?: SocketIOClient.Socket
  gameData: IGameData
  player: string
  setMoney: (
    player: string,
    money: number,
    socket: SocketIOClient.Socket
  ) => void
}) {
  const [moneyInput, setMoneyInput] = React.useState("")
  const playerMoney = gameData.money[player]
  return (
    <div className="d-flex flex-row justify-content-start align-items-center p-1">
      <div className="mr-2">
        {player}: ${playerMoney}
      </div>
      <input
        type="number"
        className="mr-2"
        value={moneyInput}
        onChange={(e) => {
          const value = Number(e.target.value)
          if (!isNaN(value)) {
            setMoneyInput(e.target.value)
          }
        }}
      />
      <button
        className="mr-2"
        onClick={() => {
          socket && setMoney(player, playerMoney + Number(moneyInput), socket)
        }}
      >
        Add
      </button>

      <button
        className="mr-2"
        onClick={() => {
          socket && setMoney(player, playerMoney - Number(moneyInput), socket)
        }}
      >
        Subtract
      </button>

      <button
        className="mr-2"
        onClick={() => {
          socket && setMoney(player, Number(moneyInput), socket)
        }}
      >
        Update
      </button>
      <button
        className="btn btn-danger btn-sm"
        onClick={() => {
          socket && socket.emit("removePlayerFromGameData", player)
        }}
      >
        X
      </button>
    </div>
  )
}

function AdminBidSpots({ gameData }: { gameData: IGameData }) {
  return (
    <>
      {gameData.gameState === GameState.Bidding && (
        <div className="d-flex flex-column">
          <div className="h4 text-center">Bids</div>
          {Object.keys(gameData.buckets).map((key, i) => {
            const bucket = gameData.buckets[Number(key)]
            return <BidSpot bucket={bucket} key={i} showAllBids={true} />
          })}
        </div>
      )}
    </>
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
