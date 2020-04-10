import React from "react"
import { Route, Switch } from "react-router-dom"
// import logo from "./logo.svg"
// import socketIOClient from "socket.io-client"
import "./App.css"
import "bootstrap/dist/css/bootstrap.min.css"
import { Provider } from "react-redux"
import { createStore } from "./store/store"

import { Home } from "./pages/Home"
import { Admin } from "./pages/Admin"
import { Bucket } from "./pages/Bucket"
import { Money } from "./pages/Money"
import { QuestionPage } from "./pages/QuestionPage"

function App() {
  return (
    <Provider store={createStore()}>
      <link
        href="https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap"
        rel="stylesheet"
      ></link>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/admin" component={Admin} />
        <Route exact path="/bucket/:index" component={Bucket} />
        <Route exact path="/money" component={Money} />
        <Route exact path="/question" component={QuestionPage} />
      </Switch>
    </Provider>
  )
}

export default App
