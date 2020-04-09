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

function App() {
  return (
    <Provider store={createStore()}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/admin" component={Admin} />
      </Switch>
    </Provider>
  )
}

export default App
