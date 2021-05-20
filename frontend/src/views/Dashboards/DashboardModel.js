import React from 'react';
import { makeStyles} from '@material-ui/core/styles';

import {CssBaseline, Grid, Paper, Typography } from '@material-ui/core/';

import ChordsResults from '../../ModelResults/chordData.json';
import ChordsNameResults from '../../ModelResults/chordNames.json';
import SwarmResult from '../../ModelResults/swarnData.json';
import SwarmResultNames from '../../ModelResults/swarnNames.json';
import OdsTopicPercentageKeys from '../../ModelResults/odsTopicPercentageKeys.json';
import OdsTopicPercentage from '../../ModelResults/odsTopicPercentage.json';
import Histogram from '../../ModelResults/histogram.json';

import { ResponsiveChord } from '@nivo/chord'
import { ResponsiveSwarmPlot } from '@nivo/swarmplot'
import { ResponsiveBar } from '@nivo/bar'

import Chart from "react-google-charts";


import {
  ResponsiveContainer
} from "recharts";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);

export default function DashboardModel(props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CssBaseline />
      <main className={classes.content}>
        <div className={classes.toolbar} />
            <Grid container direction="column" justify="flex-start" alignItems="flex-start" spacing = {1}>
                <Grid item container direction="row" justify="space-between" alignItems="flex-start" spacing = {2}>
                    <Grid item lg={4} xs={12}>
                        <Paper style={{paddingTop: 10, paddingBottom: 15, height: 350 }}>
                            <Typography style={{ marginTop: 10 }} variant="body1" align="center">Relación de ODS y tópicos</Typography>
                            <div style={{ width: 310, height: 310 }}>
                            <ResponsiveChord
                                matrix={ChordsResults}
                                keys={ChordsNameResults}
                                margin={{top: 40, right: 60, bottom: 40, left: 40 }}
                                valueFormat=""
                                padAngle={0.02}
                                innerRadiusRatio={0.96}
                                innerRadiusOffset={0.02}
                                arcOpacity={1}
                                arcBorderWidth={1}
                                arcBorderColor={{ from: "color", modifiers: [["darker", 0.4]] }}
                                ribbonOpacity={0.5}
                                ribbonBorderWidth={1}
                                label="id"
                                labelOffset={12}
                                labelRotation={-90}
                                labelTextColor={{ from: "color", modifiers: [["darker", 1]] }}
                                colors={{ scheme: "nivo" }}
                                isInteractive={true}
                                arcHoverOpacity={1}
                                arcHoverOthersOpacity={0.25}
                                ribbonHoverOpacity={0.75}
                                ribbonHoverOthersOpacity={0.25}
                                animate={true}
                                motionStiffness={90}
                                motionDamping={7}
                                
                                layers = {['ribbons', 'arcs', 'labels']}
                                />
                                </div>
                            </Paper>
                    </Grid>
                    <Grid item lg={8} xs={12}>
                        <Paper style={{paddingTop: 10, paddingBottom: 15, height: 350 }}>
                            <Typography style={{ marginTop: 10 }} variant="body1" align="center" >Distribución e imporancia de palabras por tema</Typography>
                            <ResponsiveContainer width="100%" height={330}>
                                <div style={{  height: 330 }}>
                                    <ResponsiveSwarmPlot
                                        data={SwarmResult}
                                        groups={SwarmResultNames}
                                        value="value"
                                        valueFormat=""
                                        valueScale={{ type: "linear", min: 0, max: 60}}
                                        size={{ key: "volume", values: [1, 50], sizes: [5, 50] }}
                                        forceStrength={4}
                                        simulationIterations={100}
                                        borderColor={{
                                            from: 'color',
                                            modifiers: [
                                                [
                                                    'darker',
                                                    0.6
                                                ],
                                                [
                                                    'opacity',
                                                    0.5
                                                ]
                                            ]
                                        }}
                                        margin={{ top: 50, right: 50, bottom: 80, left: 50 }}
                                    />
                                </div>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                </Grid>
                <Grid item container direction="row" justify="space-between" alignItems="flex-start" spacing = {2}>
                    <Grid item lg={8} xs={12}>
                        <Paper style={{padding: 20, height: 350 }}>
                          <Typography style={{ marginTop: 10 }} variant="body1" align="center">Importancia de tópico por ods</Typography>
                          <ResponsiveContainer width="120%" height={290}>
                          <div style={{ width: 620, height: 290 }}>
                          <ResponsiveBar
                            data={OdsTopicPercentage}
                            keys={OdsTopicPercentageKeys}
                            indexBy="Temas"
                            margin={{ top: 50, right: 70, bottom: 50, left: 50 }}
                            padding={0.6}
                            valueScale={{ type: 'linear' }}
                            indexScale={{ type: 'band', round: true }}
                            colors={{ scheme: 'nivo' }}
                            
                            
                            borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
                            axisTop={null}
                            axisRight={null}
                            axisBottom={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: 'Temas',
                                legendPosition: 'middle',
                                legendOffset: 32
                            }}
                            axisLeft={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: 'ODS',
                                legendPosition: 'middle',
                                legendOffset: -40
                            }}
                            labelSkipWidth={12}
                            labelSkipHeight={12}
                            labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
                            legends={[
                                {
                                    dataFrom: 'keys',
                                    anchor: 'bottom-right',
                                    direction: 'column',
                                    justify: false,
                                    translateX: 100,
                                    translateY: 0,
                                    itemsSpacing: 0.3,
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
                            animate={true}
                            motionStiffness={90}
                            motionDamping={15}
                        />
                          </div>
                          </ResponsiveContainer>
                        </Paper>
                    </Grid>
                    <Grid item lg={4} xs={12}>
                      <Paper style={{padding: 20, height: 350 }}>
                      <Typography style={{ marginTop: 10 }} variant="body1" align="center">Distribución del recuento de palabras de respuestas</Typography>
                      <ResponsiveContainer width="100%" height={250}>
                      <Chart
                          width={300}
                          height={270}
                          chartType="Histogram"
                          loader={<div>Loading Chart</div>}
                          data={Histogram}
                          options={{
                            colors: ['#e7711c'],
                            histogram: { lastBucketPercentile: 10 },
                          }}
                      />   
                      </ResponsiveContainer>
                      </Paper>                     
                    </Grid>
                </Grid>
            </Grid>
      </main>
    </div>
  );
}