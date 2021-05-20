import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import MenuIcon from '@material-ui/icons/Menu';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {ListItemText, InputLabel, Button, Select, Divider, FormControl, CssBaseline, IconButton, AppBar, Drawer, Hidden, List, ListItem, Toolbar, Grid, GridList, Paper, Typography } from '@material-ui/core/';

import ODS1 from '../../images/SDGs/1.png';
import ODS2 from '../../images/SDGs/2.png'; 
import ODS3 from '../../images/SDGs/3.png'; 
import ODS4 from '../../images/SDGs/4.png';
import ODS5 from '../../images/SDGs/5.png'; 
import ODS6 from '../../images/SDGs/6.png'; 
import ODS7 from '../../images/SDGs/7.png';
import ODS8 from '../../images/SDGs/8.png'; 
import ODS9 from '../../images/SDGs/9.png'; 
import ODS10 from '../../images/SDGs/10.png';
import ODS11 from '../../images/SDGs/11.png'; 
import ODS12 from '../../images/SDGs/12.png'; 
import ODS13 from '../../images/SDGs/13.png'; 
import ODS14 from '../../images/SDGs/14.png'; 
import ODS15 from '../../images/SDGs/15.png';
import ODS16 from '../../images/SDGs/16.png'; 
import ODS17 from '../../images/SDGs/17.png'; 
import Territorio from '../../images/Dashboard/territorio.png'; 
import Pregunta from '../../images/Dashboard/pregunta.png'; 
import EncuestasCount from '../../images/Dashboard/encuestasCount.png'; 
import Anio from '../../images/Dashboard/anio.png'; 

import ModelResults from '../../ModelResults/generalResult.json';
import { PieChart, Pie, Cell } from "recharts";

import {
  LineChart,
  ResponsiveContainer,
  Line,
  Bar,
  Treemap,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Brush,
} from "recharts";


import { executeLDAModel } from "../../API/LDAModelAPI.js"

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);

export default function GeneralDashboardModel(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };



  const container = window !== undefined ? () => window().document.body : undefined;

   const [state, setState] = useState({ 
    archivo: 'MedellinCleaned.xlsx',
   });
   const handleFileChange = (e) => {
       setState({ ...state, archivo: e.target.value });
   };
   
   const processPreguntas = () => {
    return ModelResults.preguntas.map( (e) => ({
      pregunta: e.pregunta,
      cantidad: e.cantidad,
    }));
  };

  const processDataGenero = () => {
    return ModelResults.sexo.map( (e) => ({
      name: e.sexoNombre,
      value: e.value,
    }));
  };
  const COLORS = ['#FF1493', '#45b6FE'];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
  const processDataEdades = () => {
    return ModelResults.edad.map(e => ({
      edad: e[0],
      cantidad: e[1],
    }));
  };

  const processDataAnio = () => {
    const anio = ModelResults.anio;
    return(
      anio[0]
    );
  };

  const dataEdades = processDataEdades();
  const dataGenero = processDataGenero();
  const pregutas = processPreguntas();
  const anio = processDataAnio();


  
 
  {ModelResults.topPalabras.map((fila) => (
    <Paper>
      <Typography>
          {fila[0]} 
        </Typography>
        <Typography>
          {fila[1]}
        </Typography>
    </Paper>
))}
  
  {ModelResults.topPalabras.map((fila) => (
    <Paper>
      <Typography>
          {fila[0]} 
        </Typography>
        <Typography>
          {fila[1]}
        </Typography>
    </Paper>
))}
  /*----------------ODS Functions and Vriables----------------*/ 
  const SDGIcons = [ODS1,ODS2,ODS3,ODS4,ODS5,ODS6,ODS7,ODS8,ODS9,ODS10,ODS11,ODS12,ODS13,ODS14,ODS15,ODS16,ODS17]
  const getTop3ODS = () => {
    const e = ModelResults.porOds
    return({
      ods1: e[0][0],
      ods2: e[1][0],
      ods3: e[2][0],
      ods4: e[3][0],
      ods5: e[4][0],
      ods6: e[5][0],
    });
  };
  const processDataODS = () => {
    return ModelResults.porOds.map(e => ({
      x: e[0],
      y: e[1],
    }));
  };
  const processODSTiempo = () => {
    return ModelResults.datosPorMes.map(e => ({
      ods: e[0][1],
      enero: e[1][1],
      febrero: e[2][1],
      marzo: e[3][1],
      abril: e[4][1],
      mayo: e[5][1],
      junio: e[6][1],
      julio: e[7][1],
      agosto: e[8][1],
      septiembre: e[9][1],
      octubre: e[10][1],
      noviembre: e[11][1],
      diciembre: e[12][1],
    }));
  };
  const getTreeMapODS = () => {
    return(
      [{
        name: "ODS",
        children: ModelResults.porOds.map(e => ({
          name: e[0],
          size: e[1],
        }))
      }]
    );
  };


  const dataODSTiempo = processODSTiempo();
  const dataODS = processDataODS();
  const top3ODS = getTop3ODS();
  const ODSTop1 = SDGIcons[ top3ODS.ods1 - 1];
  const ODSTop2 = SDGIcons[ top3ODS.ods2 - 1];
  const ODSTop3 = SDGIcons[ top3ODS.ods3 - 1];
  const ODSTop4 = SDGIcons[ top3ODS.ods4 - 1];
  const ODSTop5 = SDGIcons[ top3ODS.ods5 - 1];
  const ODSTop6 = SDGIcons[ top3ODS.ods6 - 1];
  const dataTreemapODS = getTreeMapODS();
  
  const showEdadesGraph = () => {
    return (
      <div>
        <Typography variant="h6" align="center" > Edades de encuestados </Typography> 
        <BarChart
          width={500}
          height={300}
          data={dataEdades}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}
          barSize={20}
        >
          <XAxis dataKey="edad" scale="point" padding={{ left: 10, right: 10 }} />
          <YAxis />
          <Tooltip />
          <Legend />
          <CartesianGrid strokeDasharray="3 3" />
          <Bar dataKey="cantidad" fill="#FF9C00" background={{ fill: "#EAE3D6" }} />
        </BarChart>        
      </div>
    );
  };
  
  const showODSTreeMapGraph = () => {
    return (
      <div>
        <Typography variant="h6" align="center" >Distribución de ODS</Typography> 
        <Treemap
          width={400}
          height={200}
          data={dataTreemapODS}
          dataKey="size"
          stroke="#fff"
          fill="#FF9C00"
        />
      </div>
    );
  };


  return (
    <div className={classes.root}>
      <CssBaseline />
      
      
      <main className={classes.content}>
        <div className={classes.toolbar} />
            <Grid container direction="column" justify="flex-start" alignItems="flex-start" spacing = {1}>
                <Grid item container direction="row" justify="space-between" alignItems="flex-start" spacing = {2}>
                    <Grid item lg={3} sm={6}>
                      <Paper style = {{padding: 10, height: 220}} >
                        <Typography variant="body1" align="center" >Sexo</Typography> 
                        <ResponsiveContainer width="100%" height={220}>
                          <PieChart width={100} height={100}>
                            <Pie
                              data={dataGenero}
                              cx="50%"
                              cy="40%"
                              labelLine={false}
                              label={renderCustomizedLabel}
                              outerRadius={70}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {dataGenero.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                         </ResponsiveContainer>
                      </Paper>
                    </Grid>
                    <Grid item lg={3} sm={6}>
                      <Paper style = {{padding: 10, height: 220}} >
                        <Grid item container  direction="column" justify="space-between" spacing={2}>
                          <Grid item container direction="row" justify="center" alignItems="center">
                            <Grid  item sm={4}>
                              <img alt="Territorio" src={Territorio} style={{ marginTop:"15%", marginBottom:"15%", maxWidth: '40%',minWidth: '5%', marginLeft:'30%',marginRight:'30%'}}/>
                            </Grid>
                            <Grid  item sm={8}>
                              <Typography variant="caption">
                                  Territorio
                              </Typography>
                              <Typography  variant="h6">
                                  Medellín
                              </Typography>
                            </Grid>
                          </Grid>
                          <Hidden mdDown implementation="css">
                            <Grid item container direction="row" justify="center" alignItems="center">
                              <Grid  item sm={4}>
                                <img alt="Anio" src={Anio} style={{ display: 'block', marginTop:"15%", marginBottom:"15%", maxWidth: '40%',minWidth: '5%', marginLeft:'30%',marginRight:'30%'}}/>
                              </Grid>
                              <Grid  item sm={8}>
                                <Typography variant="caption">
                                    Año de encuesta
                                </Typography>
                                <Typography  variant="h6">
                                    {anio}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Hidden>
                          <Grid item container direction="row" justify="center" alignItems="center">
                            <Grid  item sm={4}>
                              <img alt="Encuesta" src={EncuestasCount} style={{ display: 'block', marginTop:"15%", marginBottom:"15%", maxWidth: '40%',minWidth: '5%', marginLeft:'30%',marginRight:'30%'}}/>
                            </Grid>
                            <Grid  item sm={8}>
                              <Typography variant="caption">
                                  Encuestados
                              </Typography>
                              <Typography  variant="h6">
                                  {ModelResults.totalRespuestas}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                    <Grid item lg={6} sm={6}>
                        <Paper style = {{ padding :10, marginBottom:8, height: 220}}>
                            <Typography variant="body1" align="center" > Edades de encuestados </Typography> 
                            <ResponsiveContainer width="100%" height={180}>
                              <BarChart
                                width={500}
                                height={180}
                                data={dataEdades}
                                margin={{
                                  top: 5,
                                  right: 30,
                                  left: 20,
                                  bottom: 5
                                }}
                                barSize={20}
                              >
                                <XAxis dataKey="edad"scale="point" padding={{ left: 10, right: 10 }} />
                                <YAxis/>
                                <Tooltip />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Bar dataKey="cantidad" fill="#FF9C00" background={{ fill: "#EAE3D6" }} />
                              </BarChart>    
                            </ResponsiveContainer>
                          </Paper>
                    </Grid>
                </Grid>
                <Grid item container direction="row" justify="space-between" alignItems="flex-start" spacing = {2}>
                    <Grid item container lg={3} sm={6}>
                      <Paper style={{ height:310, padding:20}}>
                        <Typography style = {{marginTop: 10, marginBottom: 20}} variant="body1" align="center" >Preguntas</Typography> 
                        {ModelResults.preguntas.map((fila) => (
                          <div>
                            <Grid style={{marginTop:10}}>
                              <Grid>
                                <Typography   style = {{marginTop: 40, marginBottom: 40, fontSize:'0.9em'}} variant="caption" align="center" >{fila.pregunta}</Typography> 
                                <Typography   style = {{marginTop: 40, marginBottom: 40, fontSize:'0.6em'}} variant="caption" align="center" >{' - ' + fila.cantidad + ' respuestas'}</Typography>
                              </Grid>
                              <Grid>
                                <Divider/>
                              </Grid>
                            </Grid>
                          </div>
                        ))}
                      </Paper>
                    </Grid>
                    <Grid item container lg={5} sm={6}>
                      <Grid item container direction="column" justify="space-between">
                      <Paper style = {{padding: 10, height: 310}} >
                      <Typography variant="body1" align="center" > Cantidad de respuestas por ODS </Typography> 
                        <ResponsiveContainer width="95%" height={280}>
                          <LineChart  data={dataODSTiempo} margin={{ top: 5, right: 10, left: 10, bottom: 5}}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="ods" height={60} label="ODS" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="enero" stroke="#8884d8"/>
                            <Line type="monotone" dataKey="febrero" stroke="#EF402B"/>
                            <Line type="monotone" dataKey="marzo" stroke="#00AED9"/>
                            <Line type="monotone" dataKey="abril" stroke="#FDB714"/>
                            <Line type="monotone" dataKey="mayo" stroke="#F36D25"/>
                            <Line type="monotone" dataKey="junio" stroke="#E11484"/>
                            <Line type="monotone" dataKey="julio" stroke="#48773D"/>
                            <Line type="monotone" dataKey="agosto" stroke="#CF8D2A"/>
                            <Line type="monotone" dataKey="septiembre" stroke="#8884d8"/>
                            <Line type="monotone" dataKey="octubre" stroke="#3DB049"/>
                            <Line type="monotone" dataKey="noviembre" stroke="#02558B"/>
                            <Line type="monotone" dataKey="diciembre" stroke="#173669"/> 
                            <Brush />
                          </LineChart>  
                        </ResponsiveContainer>
                      </Paper>
                          
                         
                          
                      </Grid>
                    </Grid>
                    <Grid item lg={2} xs={6}>
                        <ResponsiveContainer width="100%" height={500}>
                          <Paper style = {{ padding :10, height: 310}}>
                            <Typography variant="body1" align="center" >Top ODS </Typography> 
                            <img alt="ODSTop1" src={ODSTop1} style={{ display: 'block', marginTop:"5%", marginBottom:"5%", maxWidth: '28%',minWidth: '10%', marginLeft:'30%',marginRight:'30%'}}/>  
                            <img alt="ODSTop2" src={ODSTop2} style={{ display: 'block', marginTop:"5%", marginBottom:"5%", maxWidth: '28%',minWidth: '10%', marginLeft:'30%',marginRight:'30%'}}/>  
                            <Hidden mdDown implementation="css">
                            <img alt="ODSTop3" src={ODSTop3} style={{ display: 'block', marginTop:"5%", marginBottom:"5%", maxWidth: '28%',minWidth: '10%', marginLeft:'30%',marginRight:'30%'}}/>  
                            <img alt="ODSTop4" src={ODSTop4} style={{ display: 'block', marginTop:"5%", marginBottom:"5%", maxWidth: '28%',minWidth: '10%', marginLeft:'30%',marginRight:'30%'}}/>     
                            <img alt="ODSTop5" src={ODSTop5} style={{ display: 'block', marginTop:"5%", marginBottom:"5%", maxWidth: '28%',minWidth: '10%', marginLeft:'30%',marginRight:'30%'}}/>     
                            <img alt="ODSTop6" src={ODSTop6} style={{ display: 'block', marginTop:"5%", marginBottom:"5%", maxWidth: '28%',minWidth: '10%', marginLeft:'30%',marginRight:'30%'}}/>     
                            </Hidden>
                          </Paper>
                        </ResponsiveContainer> 
                    </Grid>
                    <Grid item lg={2} xs={6}>
                      
                      <Paper style={{ height:310, padding:15}}>
                        <Typography variant="body2" align="center" >Top de palabras</Typography> 
                          {ModelResults.topPalabras.map((fila) => (
                            <div>
                              <Grid style={{ marginTop:10}}>
                                <Grid>
                                  <Typography style = {{fontSize:'0.8em'}} variant="caption" align="center" >{fila[0]} </Typography>
                                  <Typography style = {{fontSize:'0.6em'}} variant="caption" align="center" >{fila[1]} </Typography>
                                </Grid>
                                <Grid>
                                <Divider/>
                                </Grid>
                              </Grid>
                            </div>
                          ))}
                      </Paper>
                    </Grid>
                </Grid>
            </Grid>
      </main>
    </div>
  );
}