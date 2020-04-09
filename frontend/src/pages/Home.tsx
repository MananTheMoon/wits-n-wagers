import React from "react"
import { connect } from "react-redux"
import classnames from "classnames"
import { IState, Dispatch } from "../store/store"
import { setCurrentPlayerAsync, removePlayerAsync } from "../store/thunks"
import { PlayersList } from "../components/PlayersList"
import { Join } from "../components/Join"

interface IHomeProps {
  socket?: SocketIOClient.Socket
  players: string[]
  currentPlayer: string
  addPlayer: (name: string, socket: SocketIOClient.Socket) => void
  removePlayer: (name: string, socket: SocketIOClient.Socket) => void
}

export function HomeUnconnected({
  socket,
  players,
  currentPlayer,
  addPlayer,
  removePlayer,
}: IHomeProps) {
  // const [name, setName] = React.useState("")
  // const [canJoin, setCanJoin] = React.useState(false)

  return (
    <section className="text-center container mt-5">
      <h2>Wits N Wagers</h2>
      <Join />
      <PlayersList />
    </section>
  )
}

const mapStateToProps = (state: IState) => ({
  socket: state.socket,
  players: state.players,
  currentPlayer: state.currentPlayer,
})

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    addPlayer: setCurrentPlayerAsync(dispatch),
    removePlayer: removePlayerAsync(dispatch),
  }
}

export const Home = connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeUnconnected)
