import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import moment from "moment";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Home from "@material-ui/icons/Home";
// core components
import Navbar from "components/Navbars/Navbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HomePage from "../views/Home/Home.js";
import DashboardGeneral from "../views/Dashboards/Dashboard.js";
import DashboardModel from "../views/Dashboards/DashboardModel.js";
import Settings from "@material-ui/icons/Settings";
import TrendingUp from "@material-ui/icons/TrendingUp";

import ModelDashboardPage from "../views/ModelDashboard/ModelDashboard.js";
//import routes from "routes.js";

import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";

import Logo from '../images/Home/UnfpaLogo.png'; 

let ps;

const useStyles = makeStyles(styles);

export default function Admin({ ...rest }) {
  // styles
  const classes = useStyles();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();
  // states and functions
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isDashboardDisabled, setIsDashboardDisabled] = React.useState(true);
  const [parameters, setParameters] = React.useState({});

  const executeModel = (modelParameters) => {
    console.log(modelParameters);
    setIsDashboardDisabled(false);
    if(modelParameters.start) {
      modelParameters.start = moment(modelParameters.start, "DD/MM/YYYY").format("YYYY-MM-DD")  + " 00:00:00.0";
    }
    if(modelParameters.end) {
      modelParameters.end = moment(modelParameters.end, "DD/MM/YYYY").format("YYYY-MM-DD") + " 23:59:59.9";
    }
    modelParameters.accounts = Object.keys(modelParameters.accounts).filter(account => modelParameters.accounts[account]).join(" ");
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
      path: "/dashboardTemplate",
      name: "Dashboard",
      icon: Dashboard,
      component: () => <ModelDashboardPage parameters={parameters}/>,
      layout: "/admin",
      disabled: isDashboardDisabled,
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
              {isDashboardDisabled && prop.path === "/dashboard" ? <Redirect to="/home" /> : prop.component}
            </Route>
          );
        }
        return null;
      })}
      <Redirect from="/admin" to="/admin/dashboard" />
    </Switch>
  );

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const getRoute = () => {
    return window.location.pathname !== "/admin/maps";
  };
  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };
  // initialize and destroy the PerfectScrollbar plugin
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", resizeFunction);
    // Specify how to clean up after this effect:
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
        {/* On the /maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
        {getRoute() ? (
          <div className={classes.content}>
            <div className={classes.container}>{switchRoutes}</div>
          </div>
        ) : (
          <div className={classes.map}>{switchRoutes}</div>
        )}
        {getRoute() ? <Footer /> : null}
      </div>
    </div>
  );
}
