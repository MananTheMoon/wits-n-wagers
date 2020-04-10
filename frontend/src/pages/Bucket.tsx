import React from "react"
import { useParams } from "react-router-dom"
import { connect, useDispatch } from "react-redux"
import { IState, IGameData } from "../store/store"
import { updateGameData } from "../store/actions"
import { GuessPanel, ListOfBids } from "../components/Bidding"

interface IBucketProps {
  socket?: SocketIOClient.Socket
  gameData: IGameData
}

function BucketUnconnected({ socket, gameData }: IBucketProps) {
  const { index } = useParams()
  const dispatch = useDispatch()

  React.useEffect(() => {
    socket?.on("gameData", (gameData: IGameData) => {
      dispatch(updateGameData(gameData))
    })
  }, [dispatch, socket])

  const bucket = gameData.buckets[Number(index)]
  return (
    <div className="p-3 text-center">
      {bucket && bucket.value !== null ? (
        <>
          <GuessPanel bucket={bucket} />
          <ListOfBids bucket={bucket} />
        </>
      ) : (
        <div>...</div>
      )}
    </div>
  )
}

const mapStateToProps = (state: IState) => ({
  socket: state.socket,
  gameData: state.gameData,
})

export const Bucket = connect(mapStateToProps)(BucketUnconnected)
