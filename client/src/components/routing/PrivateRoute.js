import React from "react";
import { Redirect, Route } from "react-router-dom";

export const PrivateRoute = ({ component: Component, ...rest }) => {
  return (<Route
    {...rest}
    render={props => localStorage.jwtToken
      ? (<Component {...props} />)
      : (<Redirect to={{
        pathname: "/login",
        state: { from: props.location }
      }} />)
    }
  />)
}

export const LogedInRoute = ({ component: Component, ...rest }) => {
  return (<Route
    {...rest}
    render={props => localStorage.jwtToken
      ? (<Redirect to={{
        pathname: "/feed",
        state: { from: props.location }
      }} />)
      : (<Component {...props} />)
    }
  />)
}