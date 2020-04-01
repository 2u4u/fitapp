import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_token from "jwt-decode";
// import { useDispatch, useSelector } from "react-redux";
import setAuthToken from "../utils/setAuthToken";

import { setCurrentUser, logoutUser } from "../actions/authAction";
import store from "../store";

import Login from "../components/auth/Login"
import Register from "../components/auth/Register"
import Account from "../components/admin/Account"
import MarathonsList from "../components/marathons/List";
import MarathonView from "../components/marathons/View"
import TrainingView from "../components/trainings/View"
import FlowView from "../components/flows/View"
import Page404 from "../components/page/Page404"

import { PrivateRoute } from "../components/routing/PrivateRoute";
import ChatRoom from '../components/chat/ChatRoom';
import Admin from '../components/admin/Admin';

// Check for token
if (localStorage.jwtToken) {
  // Set auth token header
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info
  const decoded = jwt_token(localStorage.jwtToken);
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user if expired
    store.dispatch(logoutUser());

    // Redirect to Login
    // window.location.href = "/login";
  }
}
function App() {
  // console.log("location", location)

  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <PrivateRoute exact path="/" component={Admin} />
        <Admin>
          {/* <PrivateRoute path="/admin" component={} /> */}
          <PrivateRoute path="/admin/account" component={Account} />
          {/* <PrivateRoute path="/admin/chat" component={ChatRoom} /> */}
          <PrivateRoute path="/admin/chat/:chatId" component={ChatRoom} />
          <PrivateRoute exact path="/admin/chat" component={ChatRoom} />
          <PrivateRoute path="/admin/marathons/list" component={MarathonsList} />
          <PrivateRoute exact path="/admin/marathon/:handle" component={MarathonView} />
          <PrivateRoute exact path="/admin/marathon/:marathon_handle/:handle" component={FlowView} />
          <PrivateRoute exact path="/admin/marathon/:marathon_handle/:flow_handle/:handle" component={TrainingView} />
        </Admin>
        <Route exact path="*" component={Page404} />
      </Switch>
    </Router>
  )
}

export default App;