import React from "react"
import { connect } from "react-redux"
import { IState, Dispatch, IGameData } from "../store/store"
import { setCurrentPlayerAsync, removePlayerAsync } from "../store/thunks"
import { PlayersList } from "../components/PlayersList"
import { Question } from "../components/Question"
import { Join } from "../components/Join"
import { GameState } from "../store/gameState"
import { Guessing } from "../components/Guessing"
import { Bidding } from "../components/Bidding"

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
      {gameData.gameState === GameState.Guessing && <Guessing />}
      {gameData.gameState === GameState.Bidding && <Bidding />}
      <hr />
      <PlayersList />
    </section>
  )
}

const mapStateToProps = (state: IState) => ({
  gameData: state.gameData,
})

export const Home = connect(mapStateToProps)(HomeUnconnected)
