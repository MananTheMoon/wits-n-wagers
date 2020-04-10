import React from "react"
import { IState, Dispatch, IGameData } from "../store/store"
import { PlayerState } from "../store/gameState"
import { connect } from "react-redux"
import "./Guessing.css"
import { setGuessAsync } from "../store/thunks"

interface IGuessingProps {
  socket?: SocketIOClient.Socket
  gameData: IGameData
  playerState: PlayerState
  currentPlayer: string
  setGuess: (
    player: string,
    guess: string,
    socket: SocketIOClient.Socket
  ) => void
}

function GuessingUnconnected({
  socket,
  gameData,
  playerState,
  currentPlayer,
  setGuess,
}: IGuessingProps) {
  const [input, setInput] = React.useState("")
  const submittedGuess = gameData.guesses[currentPlayer]

  if (playerState !== PlayerState.Connected || !currentPlayer) {
    return <div className="mt-2 text-center">You must join to participate</div>
  }

  return (
    <>
      <div className="h5 text-center mt-3">Make Your Guess</div>
      <div className="d-flex flex-row mt-1 justify-content-center align-items-center guess">
        <input
          type="number"
          min={0}
          max={1000000000}
          placeholder={"Your Guess"}
          value={input}
          className="mr-2"
          onChange={(e) => {
            const value = Number(e.target.value)
            if (!isNaN(value)) {
              setInput(e.target.value)
            }
          }}
        />
        <button
          className="btn btn-primary"
          onClick={() => {
            socket && setGuess(currentPlayer, input, socket)
          }}
        >
          Submit
        </button>
      </div>
      {submittedGuess && (
        <div>
          You're current guess is{" "}
          <span className="font-weight-bold">{submittedGuess}</span>. Re-submit
          to change it.
        </div>
      )}
    </>
  )
}

const mapStateToProps = (state: IState) => ({
  gameData: state.gameData,
  socket: state.socket,
  playerState: state.playerState,
  currentPlayer: state.currentPlayer,
})

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setGuess: setGuessAsync(dispatch),
  }
}

export const Guessing = connect(
  mapStateToProps,
  mapDispatchToProps
)(GuessingUnconnected)
