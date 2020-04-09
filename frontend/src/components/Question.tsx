import React from "react"
import { connect } from "react-redux"
import { IState } from "../store/store"
import "./Question.css"

interface IQuestionProps {
  camUrl: string
  question: string
}

function QuestionUnconnected({ camUrl, question }: IQuestionProps) {
  return (
    <div className="w-100 justify-content-center d-flex">
      {camUrl && (
        <div className="iframe-wrapper">
          <iframe
            className="scaled-frame"
            title="Question Camera"
            src={camUrl}
          ></iframe>
        </div>
      )}
      {question && (
        <div className="w-50 question-badge p-3">Question: {question}</div>
      )}
    </div>
  )
}

const mapStateToProps = (state: IState) => ({
  camUrl: state.camUrl,
  question: state.gameData.question,
})

export const Question = connect(mapStateToProps)(QuestionUnconnected)
