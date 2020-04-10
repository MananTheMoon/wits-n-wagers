import React from "react"
import { IGameData, IState, Dispatch } from "../store/store"
import { connect } from "react-redux"
import { PlayerState } from "../store/gameState"
import { numberWithCommas } from "../utils/formatNumber"
import "./Bidding.css"
import { setBidsAsync } from "../store/thunks"

interface IBucket {
  payout: number
  value: number
  guessers: string[]
  bids: {
    [key: string]: number
  }
}

interface IBidSpot {
  bucket: IBucket
  checkmarkDisabled?: boolean
  currentBid?: number
  onToggleCheck?: (checked: boolean) => void
  onChangeBid?: (newBidAmount: number) => void
  showAllBids?: boolean
}

export function BidSpot({
  bucket,
  checkmarkDisabled,
  onToggleCheck,
  currentBid,
  onChangeBid,
  showAllBids,
}: IBidSpot) {
  return (
    <div className="border bid-spot m-3 p-2 d-flex flex-column align-items-center">
      <div className="font-weight-bold">Pays {bucket.payout} to 1</div>

      {bucket.value !== null && (
        <>
          <div className="d-flex flex-row justify-content-between align-items-center p-1">
            <GuessPanel bucket={bucket} />
            <div className="ml-2 bid-money">
              {onToggleCheck && (
                <input
                  type="checkbox"
                  checked={!!currentBid}
                  disabled={checkmarkDisabled && !currentBid}
                  onChange={() => {
                    onToggleCheck && onToggleCheck(!currentBid)
                  }}
                />
              )}
            </div>
            {currentBid && onChangeBid && (
              <div>
                <div className="bid-amount">
                  <div className="bid-amount-inner d-flex align-items-center justify-content-center h-100 flex-column">
                    <div
                      className="change-bid"
                      onClick={() => onChangeBid(currentBid + 100)}
                    >
                      +
                    </div>
                    <div>${currentBid}</div>
                    <div
                      className="change-bid"
                      onClick={() =>
                        onChangeBid(currentBid > 100 ? currentBid - 100 : 100)
                      }
                    >
                      -
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {showAllBids && <ListOfBids bucket={bucket} />}
        </>
      )}
    </div>
  )
}

export function GuessPanel({ bucket }: { bucket: IBucket }) {
  return (
    <div>
      <div className="bg-white p-2 guess-panel text-center">
        {bucket.guessers.map((name, i) => {
          return (
            <span>
              {i > 0 ? " / " : ""}
              {name}
            </span>
          )
        })}
        <div className="bid-guess">
          {bucket.value === 0
            ? "Smaller than lowest"
            : numberWithCommas(bucket.value)}
        </div>
      </div>
    </div>
  )
}

export function ListOfBids({ bucket }: { bucket: IBucket }) {
  return (
    <div className="bids-list-container p-2 text-white text-center">
      <div className="h5 mb-1">Bids:</div>
      <div className="d-flex flex-row flex-wrap">
        {Object.keys(bucket.bids).map((key) => {
          const bid = bucket.bids[key]
          return (
            <div className="bid-token text-center d-flex flex-column align-items-center justify-content-center m-1">
              <div>{key}:</div>
              <div>${bid}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface IBiddingProps {
  socket?: SocketIOClient.Socket
  gameData: IGameData
  playerState: PlayerState
  currentPlayer: string
  setMyBids: (
    player: string,
    bids: IBids,
    socket: SocketIOClient.Socket
  ) => void
}

// myBids = {bucket: 400, other_bucket_index: 50}

export interface IBids {
  [key: string]: number
}

function BiddingUnconnected({
  socket,
  gameData,
  playerState,
  currentPlayer,
  setMyBids,
}: IBiddingProps) {
  const [initializedBids, setInitializedBids] = React.useState(false)
  const [bids, setBids] = React.useState<IBids>({})

  React.useEffect(() => {
    if (gameData.buckets && currentPlayer) {
      if (!initializedBids) {
        setBids(
          Object.keys(gameData.buckets).reduce<IBids>((acc: IBids, key) => {
            const bucket = gameData.buckets[Number(key)]
            if (Object.keys(bucket.bids).includes(currentPlayer)) {
              return {
                ...acc,
                [String(key)]: bucket.bids[currentPlayer],
              }
            }
            return acc
          }, {})
        )
      }
      setInitializedBids(true)
    }
  }, [initializedBids, gameData, currentPlayer])
  React.useEffect(() => {
    socket && setMyBids(currentPlayer, bids, socket)
  }, [bids, setMyBids])
  if (playerState !== PlayerState.Connected || !currentPlayer) {
    return <div className="mt-2 text-center">You must join to participate</div>
  }

  return (
    <>
      <div className="h5 text-center mt-3">Make Your Bids</div>
      {Object.keys(gameData.buckets).map((key, i) => {
        const bucket = gameData.buckets[Number(key)]

        return (
          <BidSpot
            bucket={bucket}
            key={i}
            currentBid={bids[String(i)]}
            onToggleCheck={(checked) => {
              if (checked && Object.keys(bids).length < 2) {
                setBids({
                  ...bids,
                  [i]: 100,
                })
              }
              if (!checked) {
                const newBids = Object.assign({}, bids)
                delete newBids[i]
                setBids(newBids)
              }
            }}
            onChangeBid={(newBidAmount) => {
              setBids({
                ...bids,
                [i]: newBidAmount,
              })
            }}
            checkmarkDisabled={Object.keys(bids).length >= 2}
          />
        )
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

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setMyBids: setBidsAsync(dispatch),
  }
}

export const Bidding = connect(
  mapStateToProps,
  mapDispatchToProps
)(BiddingUnconnected)
