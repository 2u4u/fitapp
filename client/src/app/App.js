import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_token from "jwt-decode";
// import { useDispatch, useSelector } from "react-redux";
import setAuthToken from "../utils/setAuthToken";

import { setCurrentUser, logoutUser } from "../actions/authAction";
import store from "../store";

import Admin from "../components/admin/Admin"
import Login from "../components/auth/Login"
import Register from "../components/auth/Register"
import Account from "../components/admin/Account"
import MarathonsAdd from "../components/marathons/Add";
import MarathonsList from "../components/marathons/List";
import MarathonNews from "../components/marathons/News";
import TrainingsAdd from "../components/trainings/AddTrainingForm";
import TrainingsList from "../components/trainings/List";
import MarathonView from "../components/marathons/View"
import TrainingView from "../components/trainings/View"
import Page404 from "../components/page/Page404"

import { PrivateRoute } from "../components/routing/PrivateRoute";

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
  return (
    <Router>
      <Switch>
        {/* <Route exact path="/" component={Admin} /> */}
        <PrivateRoute exact path="/" component={Admin} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        {/* <Route exact path="/user" component={User} /> */}
        <PrivateRoute exact path="/" component={Account} />
        <PrivateRoute exact path="/admin" component={Account} />
        <PrivateRoute exact path="/admin/account" component={Account} />
        <PrivateRoute path={"/admin/marathons/list"} component={MarathonsList} />
        <PrivateRoute path={"/admin/marathons/add"} component={MarathonsAdd} />
        <PrivateRoute path={"/admin/marathon/:handle"} component={MarathonView} />
        <PrivateRoute path={"/admin/marathon/news"} component={MarathonNews} />
        <PrivateRoute path={"/admin/training/:handle"} component={TrainingView} />
        <PrivateRoute path={"/admin/trainings/list"} component={TrainingsList} />
        <PrivateRoute path={"/admin/trainings/add"} component={TrainingsAdd} />
        <Route exact path="*" component={Page404} />
      </Switch>
    </Router>
  )
}

export default App;