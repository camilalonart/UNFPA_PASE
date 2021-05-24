import Dashboard from "@material-ui/icons/Dashboard";
import TrendingUp from "@material-ui/icons/TrendingUp";
import AppsIcon from '@material-ui/icons/Apps';
import Settings from "@material-ui/icons/Settings";
import HomePage from "./views/Home/Home.js";
import DashboardGeneral from "views/Dashboards/Dashboard.js";
import DashboardModel from "views/Dashboards/DashboardModel.js";
import DashboardTopicDetail from "views/Dashboards/DashboardTopicDetail.js";
import CrearTension from "views/MatrizTensiones/CrearTension.js";

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
  },
  {
    path: "/crear",
    name: "Crear Tensión",
    icon: AppsIcon,
    component: CrearTension,
    layout: "/tension",
  }
];

export default dashboardRoutes;
