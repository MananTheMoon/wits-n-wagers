import React from "react"
import { useParams } from "react-router-dom"
import { connect, useDispatch } from "react-redux"
import { IState, IGameData } from "../store/store"
import { updateGameData } from "../store/actions"

interface IBucketProps {
  socket?: SocketIOClient.Socket
  gameData: IGameData
}

function BucketUnconnected({ socket, gameData }: IBucketProps) {
  const { index } = useParams()
  const dispatch = useDispatch()

  React.useEffect(() => {
    socket?.on("gameData", (gameData: IGameData) => {
      console.log(gameData)
      dispatch(updateGameData(gameData))
    })
  }, [dispatch, socket])

  const bucket = gameData.buckets[Number(index)]
  console.log(bucket)
  return <div></div>
}

const mapStateToProps = (state: IState) => ({
  socket: state.socket,
  gameData: state.gameData,
})

export const Bucket = connect(mapStateToProps)(BucketUnconnected)
