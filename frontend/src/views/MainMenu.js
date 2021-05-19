import React, {useState} from 'react';
import "../css/styles.css";
import { Link } from 'react-router-dom';

import {Paper, Typography,useMediaQuery,useTheme, Button, Grid} from '@material-ui/core';
import Logo from '../images/Home/UnfpaLogo.png'; 
import Lorenz from '../images/Home/Lorenz.png'; 
import Analitica from "../images/Home/Analitica.png";
import Tensiones from "../images/Home/Tensiones.png";
import Topicos from "../images/Home/Topicos.png";
import TopicGeneral from "../images/Home/TopicGeneral.png";

import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Add from '@material-ui/icons/Add';

export default function Home() {

    const theme = useTheme();
    const isMobileOrTablet = useMediaQuery(theme.breakpoints.down("sm"));
    return(
        <div style={{ backgroundColor: "#FF9C00", minHeight: "100vh" ,  overflowX: 'hidden', overflowY: 'hidden'}}>
            <Grid container direction="row" justify="center"  alignItems="center">
                <Grid item container justify="center"  spacing={1} alignItems="center" direction="column" xs={12} sm={6}>
                    <Grid item xs={12} >
                        <img alt="complex" src={Logo} style={{ display: 'block', marginTop:"15%", marginBottom:"15%", maxWidth: '55%',minWidth: '45%', marginLeft:'30%',marginRight:'30%'}}/>
                    </Grid>
                    <Grid  item xs={12} >
                        <Link href="/tensiones/crear/" to={`/tensiones/crear/`}  style={{ textDecoration: 'none' }}>
                            <Paper style={{ padding: 12, position: "relative", borderRadius: 5, marginLeft:30,marginRight:30}} elevation={3}>
                                <Grid container alignItems="center" justify="space-between" wrap="nowrap">
                                    <Grid item sm={2} xs={5}>
                                        <img src={Tensiones} alt='Tensiones' style={{ borderRadius: 5, width: "50%", height: "50%" }} />
                                    </Grid>
                                    <Grid item sm={9} xs={6}>
                                        <Typography style={{ textAlign: 'left', color:'black' }} variant={isMobileOrTablet ? "body2" : "body1"} color="primary" display="block">Ejercicio de tensiones</Typography>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <ArrowForwardIosIcon/>
                                    </Grid>
                                </Grid> 
                            </Paper>
                        </Link> 
                    </Grid> 
                    <Grid  item xs={12} >
                        <Link href="/admin/home" to={`/admin/home`}  style={{ textDecoration: 'none' }}>
                            <Paper style={{ padding: 12, position: "relative", borderRadius: 5, marginLeft:30,marginRight:30}} elevation={3}>
                                <Grid container alignItems="center" justify="space-between" wrap="nowrap">
                                    <Grid item sm={2} xs={5}>
                                        <img src={Analitica} alt='Analitica' style={{ borderRadius: 5, width: "50%", height: "50%" }} />
                                    </Grid>
                                    <Grid item sm={9} xs={6}>
                                        <Typography style={{ textAlign: 'left', color:'black' }} variant={isMobileOrTablet ? "body2" : "body1"} color="primary" display="block">Analíticas generales</Typography>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <ArrowForwardIosIcon/>
                                    </Grid>
                                </Grid> 
                            </Paper>
                        </Link> 
                    </Grid> 
                    
                    <Grid item>
                        <Link href="/dashboardModel/" to={`/dashboardModel/`} style={{ textDecoration: 'none' }}>
                            <Paper style={{ padding: 12, position: "relative", borderRadius: 5, marginLeft:30,marginRight:30}} elevation={3}>
                                <Grid container alignItems="center" justify="space-between" wrap="nowrap">
                                    <Grid item sm={2} xs={5}>
                                        <img src={TopicGeneral}  alt='Topicos' style={{ borderRadius: 5, width: "50%", height: "50%" }} />
                                    </Grid>
                                    <Grid item sm={9} xs={6}>
                                        <Typography style={{ textAlign: 'left', color:'black' }} variant={isMobileOrTablet ? "body2" : "body1"} color="primary" display="block">Hallazgos generales de los temas</Typography>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <ArrowForwardIosIcon/>
                                    </Grid>
                                </Grid> 
                            </Paper>
                        </Link>
                    </Grid>

                    <Grid item>
                        <Link href="/dashboardPerTopic/" to={`/dashboardPerTopic/`} style={{ textDecoration: 'none' }}>
                            <Paper style={{ padding: 12, position: "relative", borderRadius: 5, marginLeft:30,marginRight:30}} elevation={3}>
                                <Grid container alignItems="center" justify="space-between" wrap="nowrap">
                                    <Grid item sm={2} xs={5}>
                                        <img src={Topicos}  alt='Topicos' style={{ borderRadius: 5, width: "50%", height: "50%" }} />
                                    </Grid>
                                    <Grid item sm={9} xs={6}>
                                        <Typography style={{ textAlign: 'left', color:'black' }} variant={isMobileOrTablet ? "body2" : "body1"} color="primary" display="block">Hallazgos por cada tema</Typography>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <ArrowForwardIosIcon/>
                                    </Grid>
                                </Grid> 
                            </Paper>
                        </Link>
                    </Grid>
                    
                </Grid>
                <Grid item xs={12} sm={6}>
                    <img alt="complex" src={Lorenz} style={{ display: 'block',maxWidth: '70%',minWidth: '50%', marginTop:"10%", marginBottom:"10%", marginLeft:'10%',marginRight:'10%'}}/>
                </Grid>
            </Grid>
        </div>
    );
}