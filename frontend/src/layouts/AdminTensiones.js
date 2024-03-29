import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import { makeStyles } from "@material-ui/core/styles";
import Sidebar from "components/Sidebar/Sidebar.js";
import CrearTension from "../views/MatrizTensiones/CrearTension.tsx";

import AddIcon from '@material-ui/icons/Add';

import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";

import Logo from '../images/Home/UnfpaLogo.png'; 

let ps;

const useStyles = makeStyles(styles);

export default function AdminTensiones({ ...rest }) {
  const classes = useStyles();
  const mainPanel = React.createRef();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const routes = [
    {
      path: "/crear",
      name: "Crear Tension",
      icon: AddIcon,
      component: () => <CrearTension/>,
      layout: "/tension"
    },
  ];

  const switchRoutes = (
    <Switch>
      {routes.map((prop, key) => {
        if (prop.layout === "/tension") {
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
      <Redirect from="/tension" to="/tension" />
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
        {
          <div className={classes.content}>
            <div className={classes.container}>{switchRoutes}</div>
          </div>
        }
      </div>
    </div>
  );
}
