/*!

=========================================================
* Material Dashboard React - v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import TrendingUp from "@material-ui/icons/TrendingUp";
import AppsIcon from '@material-ui/icons/Apps';
import Settings from "@material-ui/icons/Settings";
// core components/views for Admin layout
import HomePage from "./views/Home/Home.js";
import DashboardGeneral from "views/Dashboards/Dashboard.js";
import DashboardModel from "views/Dashboards/DashboardModel.js";
import DashboardTopicDetail from "views/Dashboards/DashboardTopicDetail.js";


const dashboardRoutes = [
  {
    path: "/model",
    name: "Parametros Modelo",
    icon: Settings,
    component: HomePage,
    layout: "/admin"
  },
  {
    path: "/dashboardGeneral",
    name: "Dashboard",
    icon: TrendingUp,
    component: DashboardGeneral,
    layout: "/admin",
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    component: DashboardModel,
    layout: "/admin",
  },
  {
    path: "/dashboardTopics",
    name: "Información por Tema",
    icon: AppsIcon,
    component: DashboardTopicDetail,
    layout: "/admin",
  }
];

export default dashboardRoutes;
