import React, {useState} from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import { CssBaseline,Hidden, Grid, Paper, Typography } from '@material-ui/core/';

import { PieChart, Pie, Cell } from "recharts";

import {
  ResponsiveContainer,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Brush,
} from "recharts";

import WordsResults from '../../ModelResults/dataPerTopic.json';
import ReactWordcloud from 'react-wordcloud';
import { ResponsiveBar } from '@nivo/bar'

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

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

const SDGIcons = [ODS1,ODS2,ODS3,ODS4,ODS5,ODS6,ODS7,ODS8,ODS9,ODS10,ODS11,ODS12,ODS13,ODS14,ODS15,ODS16,ODS17]


const useStyles = makeStyles(styles);

export default function DashboardModel(props) {

  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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
  const container = window !== undefined ? () => window().document.body : undefined;
  return (
    <div className={classes.root}>
      <CssBaseline />
      <main className={classes.content}>
        <div className={classes.toolbar} />  
          {WordsResults.map((topic) => (
            <div>
              <Grid container direction="column" justify="flex-start" alignItems="flex-start">
                <Grid container direction="row" justify="flex-start" alignItems="flex-start">
                  <Typography style={{ marginTop: 15, marginBottom: 10}} variant="body1" color = 'primary'>
                    {topic.name}
                  </Typography>
                  <Grid item container direction="row" justify="flex-start" alignItems="flex-start" spacing={1}>
                    <Grid lg={2} xs={3}>
                      <Paper style={{padding: 5, height:200 }}>
                        <ResponsiveContainer width="100%" height={190} >
                          <ReactWordcloud words={topic.words} />
                        </ResponsiveContainer>
                      </Paper>
                    </Grid>
                    <Grid lg={2} xs={3}>
                      <Paper style={{padding: 5, height:200 }}>
                        <Typography style={{ marginTop: 5 ,  marginRight: 20,  marginLeft: 20}}  variant="body2" align="center" >Sexo</Typography> 
                        <ResponsiveContainer width="100%" height={190} >
                           <PieChart width={70} height={70}>
                            <Pie
                                data={
                                  topic.sexo.map( (e) => ({
                                      name: e.sexoNombre,
                                      value: e.value,
                                  }))
                                  }
                                cx="50%"
                                cy="40%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius={70}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {
                                  topic.sexo.map( (e) => ({
                                      name: e.sexoNombre,
                                      value: e.value,
                                  })).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))
                                  }
                              
                              </Pie>
                              <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                      </Paper>
                    </Grid>
                    <Grid lg={2} xs={3}>
                      <Paper style={{padding: 5, height:200 }}>
                        <Typography style={{ marginTop: 5 ,  marginRight: 20,  marginLeft: 20}}  variant="body2" align="center" >Edades</Typography> 
                        <ResponsiveContainer width="100%" height={160} >
                          <BarChart
                            width={130}
                            height={150}
                            data={
                              topic.edades.map(e => ({
                                edad: e[0],
                                cantidad: e[1],
                              }))
                            }
                            margin={{
                              top: 10,
                              right: 40,
                              left: 0,
                              bottom: 1
                            }}
                            barSize={5}
                          >
                            <XAxis dataKey="edad" scale="point" padding={{ left: 10, right: 10 }} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Bar dataKey="cantidad" fill="#FF9C00" background={{ fill: "#EAE3D6" }} />
                          </BarChart> 
                        </ResponsiveContainer>
                      </Paper>
                    </Grid>
                    
                    <Grid lg={2} xs={3}>
                      <Paper style={{padding: 5, height:200 }}>
                        <Typography style={{ marginTop: 5 ,  marginRight: 20,  marginLeft: 20}}  variant="body2" align="center" >ODSs</Typography> 
                          <img alt="ODS" src={SDGIcons[ topic.ods - 1]} style={{ display: 'block', marginTop:"5%", marginBottom:"5%", maxWidth: '65%',minWidth: '40%', marginLeft:'10%',marginRight:'30%'}}/>
                          <Hidden mdDown implementation="css">
                            <img alt="ODS" src={SDGIcons[ topic.odsComplementario - 1]} style={{ display: 'block', marginBottom:"5%", maxWidth: '30%',minWidth: '30%', marginLeft:'10%',marginRight:'30%'}}/>
                          </Hidden>
                      </Paper>
                    </Grid>
                    <Grid lg={4}>
                      <Paper style={{padding: 5, height: 200 }}>
                        <Typography style={{ marginTop: 5 ,  marginRight: 20,  marginLeft: 20}} variant="body2" align="center">Recuento de palabras y su importancia</Typography>
                        <ResponsiveContainer width="100%" height={120}>
                          <div style={{ width: 360, height: 170 }}>
                            <ResponsiveBar
                                keys={['Importancia','Frecuencia']}
                                data={topic.infoCompleta}
                                indexBy="word"
                                margin={{ top: 5, right: 50, bottom: 50, left: 50 }}
                                padding={0.2}
                                valueScale={{ type: 'linear' }}
                                indexScale={{ type: 'band', round: true }}
                                colors={{ scheme: 'paired' }}
                                enableLabel={false}
                                groupMode="grouped"
                                borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
                                axisTop={null}
                                axisRight={null}
                                axisBottom={{
                                    tickSize: 2,
                                    tickPadding: 2,
                                    tickRotation: 0,
                                    legend: 'Palabras',
                                    legendPosition: 'middle',
                                    legendOffset: 32
                                }}
                                axisLeft={{
                                    tickSize: 2,
                                    tickPadding: 2,
                                    tickRotation: 0,
                                    legend: 'Cantidad',
                                    legendPosition: 'middle',
                                    legendOffset: -40
                                }}
                                
                                labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
                                legends={[
                                    {
                                        dataFrom: 'keys',
                                        anchor: 'bottom',
                                        direction: 'column',
                                        justify: false,
                                        translateX: 100,
                                        translateY: 50,
                                        itemsSpacing: 0,
                                        itemWidth: 100,
                                        itemHeight: 20,
                                        itemDirection: 'left-to-right',
                                        itemOpacity: 0.85,
                                        symbolSize: 10,
                                        effects: [
                                            {
                                                on: 'hover',
                                                style: {
                                                    itemOpacity: 1
                                                }
                                            }
                                        ]
                                    }
                                ]}
                                
                              />
                            </div>  
                            </ResponsiveContainer>
                          </Paper>              
                      </Grid>           
                    </Grid>
                </Grid>
                <Grid container direction="row" justify="flex-start" alignItems="flex-start">
                  <Grid>
                  
                  </Grid>
                </Grid>
          </Grid>
          </div>            
          ))}   
      </main>
    </div>
  );
}

