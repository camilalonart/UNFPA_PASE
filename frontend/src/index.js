import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch,Redirect } from "react-router-dom";

import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

import Admin from "layouts/Admin.js";
import AdminTensiones from "layouts/AdminTensiones.js";

import Home from "./views/MainMenu.js";
import CrearTension from "./views/MatrizTensiones/CrearTension";
import DashboardGeneral from "./views/Dashboards/Dashboard";
import DashboardModel from "./views/Dashboards/DashboardModel";
import DashboardTopicDetail from "./views/Dashboards/DashboardTopicDetail";
import "assets/css/material-dashboard-react.css?v=1.9.0";
import './index.css';

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
  <Provider store={store}>
     <Router history={hist}>
      <Switch>
        <ThemeProvider theme={theme}>
          <Route path="/admin/model" component={Admin} />
          <Route path="/tension/" component={AdminTensiones}/>
          <Route path="/mainMenu" component={Home} />
          <Redirect from="/" to="/mainMenu" />
        </ThemeProvider>
      </Switch>
    </Router>
  </Provider>,
  document.getElementById("root")
);


