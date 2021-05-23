import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

// core components
import Admin from "layouts/Admin.js";
import AdminTensiones from "layouts/AdminTensiones.js";
import MainMenu from "./views/MainMenu.js";
import "assets/css/material-dashboard-react.css?v=1.9.0";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { reducers } from './reducers';
const store = createStore(reducers, compose(applyMiddleware(thunk)));

const hist = createBrowserHistory();

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#FF9C00", 
      /*Naranja */ 
    },
    secondary: {
      main: "#F0EDE7",
      /*Beige */ 
    },
    warning: {
      main: "#F0EDE7",
      /*Rosado 2*/ 
    },
    success: {
      main: "#E8853E",
      /*Naranja 2 */ 
    },
  },
});

ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <ThemeProvider theme={theme}>
        <Route path="/admin" component={Admin} />
        <Provider store={store}>
          <Route path="/tension" component={AdminTensiones} />
        </Provider>
        <Route path="/" component={MainMenu} />

      </ThemeProvider>
    </Switch>
  </Router>,
  document.getElementById("root")
);