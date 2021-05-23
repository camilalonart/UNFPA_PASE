import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import { makeStyles } from "@material-ui/core/styles";
import Dashboard from "@material-ui/icons/Dashboard";
import Sidebar from "components/Sidebar/Sidebar.js";
import HomePage from "../views/Home/Home.js";

import Settings from "@material-ui/icons/Settings";
import TrendingUp from "@material-ui/icons/TrendingUp";
import AppsIcon from '@material-ui/icons/Apps';

import DashboardTopicDetail from "../views/Dashboards/DashboardTopicDetail.js";
import DashboardGeneral from "../views/Dashboards/Dashboard.js";
import DashboardModel from "../views/Dashboards/DashboardModel.js";

import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";

import Logo from '../images/Home/UnfpaLogo.png'; 

let ps;

const useStyles = makeStyles(styles);

export default function Admin({ ...rest }) {
  const classes = useStyles();
  const mainPanel = React.createRef();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [parameters, setParameters] = React.useState({});

  const executeModel = (modelParameters) => {
    console.log(modelParameters);

    setParameters(modelParameters);
  }

  const routes = [
    {
      path: "/model",
      name: "Parametros Modelo",
      icon: Settings,
      component: () => <HomePage executeModel={executeModel}/>,
      layout: "/admin"
    },
    {
      path: "/dashboardGeneral",
      name: "Tablero de Control",
      icon: TrendingUp,
      component: () => <DashboardGeneral parameters={parameters}/>,
      layout: "/admin",
    },
    {
      path: "/dashboardModel",
      name: "Modelo",
      icon: Dashboard,
      component: () => <DashboardModel parameters={parameters}/>,
      layout: "/admin",
    },
    {
      path: "/dashboardTopics",
      name: "Información por Tema",
      icon: AppsIcon,
      component: () => <DashboardTopicDetail parameters={parameters}/>,
      layout: "/admin",
    },
  ];

  const switchRoutes = (
    <Switch>
      {routes.map((prop, key) => {
        if (prop.layout === "/admin") {
          return (
            <Route
              path={prop.layout + prop.path}
              component={prop.component}
              key={key}
            >
            </Route>
          );
        }
        return null;
      })}
      <Redirect from="/admin" to="/admin/model" />
    </Switch>
  );

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", resizeFunction);
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
      window.removeEventListener("resize", resizeFunction);
    };
  }, [mainPanel]);
  return (
    <div className={classes.wrapper}>
      
      <Sidebar
        routes={routes}
        logoText= {<img alt="Logo" src={Logo} style={{ display: 'block', marginTop:"15%", marginBottom:"15%", maxWidth: '55%',minWidth: '45%', marginLeft:'30%',marginRight:'30%'}}/>}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        {...rest}
      />

      <div className={classes.mainPanel} ref={mainPanel}>
        {<div className={classes.content}>
          <div className={classes.container}>{switchRoutes}</div>
        </div>}
      </div>
    </div>
  );
}
