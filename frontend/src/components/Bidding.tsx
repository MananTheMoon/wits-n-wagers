import React from "react"
import { IGameData, IState } from "../store/store"
import { connect } from "react-redux"
import { PlayerState } from "../store/gameState"
import "./Bidding.css"

interface IBidSpot {
  bucket: {
    payout: number
    value: number
    guessers: string[]
    bids: {
      [key: string]: number
    }
  }
}

function BidSpot({ bucket }: IBidSpot) {
  return (
    <div className="border bid-spot m-3 p-2 d-flex flex-column align-items-center">
      <div className="font-weight-bold">Pays {bucket.payout} to 1</div>
      {bucket.value !== null && (
        <div className="bg-white p-2 bid-panel w-25">
          {bucket.guessers.map((name, i) => {
            return (
              <span>
                {i > 0 ? " / " : ""}
                {name}
              </span>
            )
          })}
          <div className="bid-guess">{bucket.value}</div>
        </div>
      )}
    </div>
  )
  // Takes a bucket and displays the data from it
}

interface IBiddingProps {
  socket?: SocketIOClient.Socket
  gameData: IGameData
  playerState: PlayerState
  currentPlayer: string
}

function BiddingUnconnected({
  socket,
  gameData,
  playerState,
  currentPlayer,
}: IBiddingProps) {
  if (playerState !== PlayerState.Connected || !currentPlayer) {
    return <div className="mt-2 text-center">You must join to participate</div>
  }

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap"
        rel="stylesheet"
      ></link>
      <div className="h5 text-center mt-3">Make Your Bids</div>
      {Object.keys(gameData.buckets).map((key) => {
        const bucket = gameData.buckets[Number(key)]

        return <BidSpot bucket={bucket} />
      })}
    </>
  )
}

const mapStateToProps = (state: IState) => ({
  gameData: state.gameData,
  socket: state.socket,
  playerState: state.playerState,
  currentPlayer: state.currentPlayer,
})

export const Bidding = connect(mapStateToProps)(BiddingUnconnected)
