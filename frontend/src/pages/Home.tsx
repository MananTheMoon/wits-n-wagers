import React from "react"
import { connect } from "react-redux"
import { IState, Dispatch, IGameData } from "../store/store"
import { setCurrentPlayerAsync, removePlayerAsync } from "../store/thunks"
import { PlayersList } from "../components/PlayersList"
import { Question } from "../components/Question"
import { Join } from "../components/Join"
import { GameState } from "../store/gameState"

interface IHomeProps {
  gameData: IGameData
}

export function HomeUnconnected({ gameData }: IHomeProps) {
  return (
    <section className="text-center container mt-5">
      <h2>Wits N Wagers</h2>
      <Join />
      <hr />
      {gameData.question && <Question />}
      {gameData.gameState === GameState.Guessing && <div>GuessTime</div>}
      <PlayersList />
    </section>
  )
}

const mapStateToProps = (state: IState) => ({
  gameData: state.gameData,
})

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    addPlayer: setCurrentPlayerAsync(dispatch),
    removePlayer: removePlayerAsync(dispatch),
  }
}

export const Home = connect(mapStateToProps)(HomeUnconnected)
