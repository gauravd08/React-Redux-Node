import React from "react";
import { Switch } from "react-router-dom";
import routes from "routes/routes.js";
import internalroutes from "routes/internalroutes.js";
import PrivateRoute from "config/PrivateRoute.js";

class ContentMapping extends React.Component {
  render() {
    return (
      <Switch>
        {routes.map((prop, key) => {
          return (
            <PrivateRoute
              path={prop.layout + prop.path}
              component={prop.component}
              key={key}
            />
          );
        })}
        {internalroutes.map((prop, key) => {
          return (
            <PrivateRoute
              path={prop.layout + prop.path}
              component={prop.component}
              key={key}
            />
          );
        })}
      </Switch>
    );
  }
}

export default ContentMapping;
