import React, {useState, useEffect} from 'react';

import { createTension, updateTension, getTensiones } from '../../actions/tensiones';

import {Dialog,Chip, Stepper, StepLabel, Step, DialogTitle, DialogActions, MenuItem, DialogContentText, Input,  DialogContent,TextField,Select,Paper,IconButton,InputLabel,Typography,FormControl,Divider,Grid,Button} from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';

import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import FiberManualRecordOutlinedIcon from '@material-ui/icons/FiberManualRecordOutlined';
import FiberManualRecordTwoToneIcon from '@material-ui/icons/FiberManualRecordTwoTone';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { useDispatch, RootStateOrAny, useSelector } from 'react-redux';

import MetasLista from '../../InfoMatriz/metas.json';
import ODSLista from '../../InfoMatriz/ods.json';
import DimensionesLista from '../../InfoMatriz/dimensionesLista.json';
import DimensionesGenerales from '../../InfoMatriz/dimensionesGenerales.json';

export interface Generador {situacion: String, actores: String, odsPrincipal:String, metaPrincipal: String, dimensiones:String}
export interface Implicacion {efectos: String, odsPrincipal: String, metaPrincipal: String, dimensiones:String}
export interface Reforzador {situacion: String, odsPrincipal:String, metaPrincipal: String, dimensiones:String}
export interface Liberador {situacion: String, odsPrincipal:String, metaPrincipal: String, dimensiones:String}
export interface ValoracionTensiones {intensidad: Number, impacto: Number, cronicidad: Number, ingobernabilidad: Number}
export interface Evento {quepasa: String, cuanto: String, donde: String, hacecuanto: String, ods: String, meta: String}

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    backButton: {
      marginRight: theme.spacing(1),
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
}));

export default function CrearTension() {
    const [currentId, setCurrentId] = useState(0);
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    const steps = getSteps();
    const [creadoDialog, setCreadoDialog] = React.useState(false);
    const dispatch = useDispatch();

    function getSteps() {
        return ['Dimension', 'Evento', 'Generadores', 'Implicaciones','Reforzadores','Liberadores', 'Valoración'];
    }

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const processDataMetas = (odsName: String) => {
        var metas : string[] = [];
        MetasLista.map((e) => (
            e.ods === odsName ? metas = e.metas : metas = metas
        ));
        return metas;
    };
    
    const [tensionData, setTensionData] = useState({ 
        dimension: '',
        dimensionEspecifica: '',
        competencia: '',
        evento:{quepasa: '', cuanto: '', donde: '', hacecuanto: '',  ods: '', meta: ''} as Evento,
        generadorPrincipal:{situacion: '', actores: '', odsPrincipal:'', metaPrincipal: '',  dimensiones:' '} as Generador,
        generadores:[{situacion: '', actores: '', odsPrincipal:'', metaPrincipal: '',  dimensiones:' '}] as Generador[],
        implicaciones:[{efectos: '', odsPrincipal: '', metaPrincipal: '',  dimensiones:' '}] as Implicacion[],
        implicacionPrincipal:{efectos: '', odsPrincipal: '', metaPrincipal: '',  dimensiones:' '} as Implicacion,
        reforzadores:[{situacion: '', odsPrincipal:'', metaPrincipal: '',  dimensiones:' '}] as Reforzador[],
        reforzadorPrincipal:{situacion: '', odsPrincipal:'', metaPrincipal: '',  dimensiones:' '} as Reforzador,
        liberadores:[{situacion: '', odsPrincipal:'', metaPrincipal: '',  dimensiones:' '}] as Liberador[],
        liberadorPrincipal:{situacion: '', odsPrincipal:'', metaPrincipal: '',  dimensiones:' '} as Liberador,
        valoracionTensiones: {intensidad: 0, impacto: 0, cronicidad: 0, ingobernabilidad: 0} as ValoracionTensiones,
        balanceGeneral: 0,
        balanceTotal: 0,
        narrativa:'',
    });

    const clear = () => {
        setActiveStep(0)
        setCurrentId(0);
        setTensionData({
            dimension: '',
            dimensionEspecifica: '',
            competencia: '',
            evento:{quepasa: '', cuanto: '', donde: '', hacecuanto: '',  ods: '', meta: ''} as Evento,
            generadorPrincipal:{situacion: '', actores: '', odsPrincipal:'', metaPrincipal: '',  dimensiones:' '} as Generador,
            generadores:[{situacion: '', actores: '', odsPrincipal:'', metaPrincipal: '',  dimensiones:' '}] as Generador[],
            implicaciones:[{efectos: '', odsPrincipal: '', metaPrincipal: '',  dimensiones:' '}] as Implicacion[],
            implicacionPrincipal:{efectos: '', odsPrincipal: '', metaPrincipal: '',  dimensiones:' '} as Implicacion,
            reforzadores:[{situacion: '', odsPrincipal:'', metaPrincipal: '',  dimensiones:' '}] as Reforzador[],
            reforzadorPrincipal:{situacion: '', odsPrincipal:'', metaPrincipal: '',  dimensiones:' '} as Reforzador,
            liberadores:[{situacion: '', odsPrincipal:'', metaPrincipal: '',  dimensiones:' '}] as Liberador[],
            liberadorPrincipal:{situacion: '', odsPrincipal:'', metaPrincipal: '',  dimensiones:' '} as Liberador,
            valoracionTensiones: {intensidad: 0, impacto: 0, cronicidad: 0, ingobernabilidad: 0} as ValoracionTensiones,
            balanceGeneral: 0,
            balanceTotal: 0,
            narrativa:'',
        });
    };

    const handleCompetenciaChange = (e: any) => {
        setTensionData({ ...tensionData, competencia: e.target.value });
    };
    const handleDimensionChange = (e: any) => {
        setTensionData({ ...tensionData, dimension: e.target.value });
    };
    const handleDimensionEspecificaChange = (e: any) => {
        setTensionData({ ...tensionData, dimensionEspecifica: e.target.value });
    };
    const MenuProps = {
        PaperProps: {
          style: {
            maxHeight: 48 * 4.5 + 8,
            width: 250,
          },
        },
      };
    
    const addGenerador = () => {
        setTensionData(tensionData => {
          const generadorLista: Generador[] = [...tensionData.generadores];
          generadorLista.push({situacion: '', actores: '', odsPrincipal:'', metaPrincipal: '',  dimensiones:' '});
          return {...tensionData, generadores: generadorLista }
        });
    };
    const addLiberador = () => {
        setTensionData(tensionData => {
          const liberadoresLista: Liberador[] = [...tensionData.liberadores];
          liberadoresLista.push({situacion: '', odsPrincipal:'', metaPrincipal: '',  dimensiones:' '});
          return {...tensionData, liberadores: liberadoresLista }
        });
    };
    const addReforzador = () => {
        setTensionData(tensionData => {
          const reforzadorLista: Reforzador[] = [...tensionData.reforzadores];
          reforzadorLista.push({situacion: '', odsPrincipal:'', metaPrincipal: '',  dimensiones:' '});
          return {...tensionData, reforzadores: reforzadorLista }
        });
    };
    const addImplicacion = () => {
        setTensionData(tensionData => {
          const implicacionesLista: Implicacion[] = [...tensionData.implicaciones];
          implicacionesLista.push({efectos: '', odsPrincipal: '', metaPrincipal: '',  dimensiones:' '});
          return {...tensionData, implicaciones: implicacionesLista }
        });
    };
    const updateImpacto = (value: Number) => {
        var valoracionChange = {...tensionData.valoracionTensiones}
        valoracionChange.impacto = value;
        setTensionData({ ...tensionData, valoracionTensiones: valoracionChange });
    };
    const updateIntensidad = (value : Number) => {
        var valoracionChange = {...tensionData.valoracionTensiones}
        valoracionChange.intensidad = value;
        setTensionData({ ...tensionData, valoracionTensiones: valoracionChange });
    };
    const updateCronicidad = (value : Number) => {
        var valoracionChange = {...tensionData.valoracionTensiones}
        valoracionChange.cronicidad = value;
        setTensionData({ ...tensionData, valoracionTensiones: valoracionChange });
    };
    const updateIngobernabilidad = (value : Number) => {
        var valoracionChange = {...tensionData.valoracionTensiones}
        valoracionChange.ingobernabilidad = value;
        setTensionData({ ...tensionData, valoracionTensiones: valoracionChange });
    };
    const deleteGenerador = (index: number) => {
        setTensionData(tensionData => {
            const generador: Generador[] = [...tensionData.generadores];
            generador.splice(index, 1);
            return {...tensionData, generadores: generador }
        });
    };
    const deleteLiberador = (index: number) => {
        setTensionData(tensionData => {
            const liberador: Liberador[] = [...tensionData.liberadores];
            liberador.splice(index, 1);
            return {...tensionData, liberadores: liberador }
        });
    };
    const deleteReforzador = (index: number) => {
        setTensionData(tensionData => {
            const reforzador: Reforzador[] = [...tensionData.reforzadores];
            reforzador.splice(index, 1);
            return {...tensionData, reforzadores: reforzador }
        });
    };
    const deleteImplicacion = (index: number) => {
        setTensionData(tensionData => {
            const implicacion: Implicacion[] = [...tensionData.implicaciones];
            implicacion.splice(index, 1);
            return {...tensionData, implicaciones: implicacion }
        });
    };
    const changeEventoOds = (value: String) => {
        var eventoChange = {...tensionData.evento}
        eventoChange.ods = value;
        setTensionData({ ...tensionData, evento: eventoChange });
    };
    const changeEventoMeta = (value: String) => {
        var eventoChange = {...tensionData.evento}
        eventoChange.meta = value;
        setTensionData({ ...tensionData, evento: eventoChange });
    };
    const changeEventoCuanto = (value: String) => {
        var eventoChange = {...tensionData.evento}
        eventoChange.cuanto = value;
        setTensionData({ ...tensionData, evento: eventoChange });
    };
    const changeEventoDonde = (value: String) => {
        var eventoChange = {...tensionData.evento}
        eventoChange.donde = value;
        setTensionData({ ...tensionData, evento: eventoChange });
    };
    const changeEventoQuePasa = (value: String) => {
        var eventoChange = {...tensionData.evento}
        eventoChange.quepasa = value;
        setTensionData({ ...tensionData, evento: eventoChange });
    };
    const changeEventoHaceCuanto = (value: String) => {
        var eventoChange = {...tensionData.evento}
        eventoChange.hacecuanto = value;
        setTensionData({ ...tensionData, evento: eventoChange });
    };   
    const changeGeneradorPrincipalSituacion = (value: String) => {
        var generadorNuevo = {...tensionData.generadorPrincipal}
        generadorNuevo.situacion = value;
        setTensionData({ ...tensionData, generadorPrincipal: generadorNuevo });
    };   
    const changeGeneradorSituacion = (value: String, index: number) => {
        setTensionData(tensionData => {
          const generador: Generador[] = [...tensionData.generadores];
          generador[index].situacion = value;
          return { ...tensionData, generadores: generador };
        });
      };
    const changeGeneradorPrincipalActores = (value: String) => {
        var generadorNuevo = {...tensionData.generadorPrincipal}
        generadorNuevo.actores = value;
        setTensionData({ ...tensionData, generadorPrincipal: generadorNuevo });
    };
    const changeGeneradorActores = (value: String, index: number) => {
        setTensionData(tensionData => {
            const generador: Generador[] = [...tensionData.generadores];
            generador[index].actores = value;
            return { ...tensionData, generadores: generador };
        });
    };
    const changeGeneradorPrincipalODS1= (value: String) => {
        var generadorNuevo = {...tensionData.generadorPrincipal}
        generadorNuevo.odsPrincipal = value;
        setTensionData({ ...tensionData, generadorPrincipal: generadorNuevo });
    };
    const changeGeneradorODS1= (value: String, index: number) => {
        setTensionData(tensionData => {
            const generador: Generador[] = [...tensionData.generadores];
            generador[index].odsPrincipal = value;
            return { ...tensionData, generadores: generador };
        });
    };
    const changeGeneradorPrincipalMeta1 = (value: String) => {
        var generadorNuevo = {...tensionData.generadorPrincipal}
        generadorNuevo.metaPrincipal = value;
        setTensionData({ ...tensionData, generadorPrincipal: generadorNuevo });
    };
    const changeGeneradorMeta1= (value: String, index: number) => {
        setTensionData(tensionData => {
          const generador: Generador[] = [...tensionData.generadores];
          generador[index].metaPrincipal = value;
          return { ...tensionData, generadores: generador };
        });   
    };
    const changeGeneradorPrincipalDimension= (value: String) => {
        var generadorNuevo = {...tensionData.generadorPrincipal}
        generadorNuevo.dimensiones = value;
        setTensionData({ ...tensionData, generadorPrincipal: generadorNuevo });
    };
    const changeGeneradorDimensiones= (value: String, index: number) => {
        setTensionData(tensionData => {
            const generadorLista: Generador[] = [...tensionData.generadores];
            generadorLista[index].dimensiones = value;
            return { ...tensionData, generadores: generadorLista };
        });
    };
    const changeImplicacionDimension= (value: String, index: number) => {
        setTensionData(tensionData => {
          const implicacion: Implicacion[] = [...tensionData.implicaciones];
          implicacion[index].dimensiones = value;
          return { ...tensionData, implicaciones: implicacion };
        });
      };
    const changeImplicacionPrincipalDimension = (value: String) => {
        var implicacionNuevo = {...tensionData.implicacionPrincipal}
        implicacionNuevo.dimensiones = value;
        setTensionData({ ...tensionData, implicacionPrincipal: implicacionNuevo });
    };
    const changeImplicacionPrincipalMeta1 = (value: String) => {
        var implicacionNuevo = {...tensionData.implicacionPrincipal}
        implicacionNuevo.metaPrincipal = value;
        setTensionData({ ...tensionData, implicacionPrincipal: implicacionNuevo });
    };
    const changeImplicacionPrincipalODS1 = (value: String) => {
        var implicacionNuevo = {...tensionData.implicacionPrincipal}
        implicacionNuevo.odsPrincipal = value;
        setTensionData({ ...tensionData, implicacionPrincipal: implicacionNuevo });
    };
    const changeImplicacionPrincipalEfectos = (value: String) => {
        var implicacionNuevo = {...tensionData.implicacionPrincipal}
        implicacionNuevo.efectos = value;
        setTensionData({ ...tensionData, implicacionPrincipal: implicacionNuevo });
    };
    const changeImplicacionEfectos = (value: String, index: number) => {
        setTensionData(tensionData => {
            const generador: Implicacion[] = [...tensionData.implicaciones];
            generador[index].efectos = value;
            return { ...tensionData, implicaciones: generador };
        });
    };
    const changeImplicacionOdsPrincipal = (value: String, index: number) => {
        setTensionData(tensionData => {
            const generador: Implicacion[] = [...tensionData.implicaciones];
            generador[index].odsPrincipal = value;
            return { ...tensionData, implicaciones: generador };
        });
    };
    const changeImplicacionMetaPrincipal = (value: String, index: number) => {
        setTensionData(tensionData => {
          const implicacion: Implicacion[] = [...tensionData.implicaciones];
          implicacion[index].metaPrincipal = value;
          return { ...tensionData, implicaciones: implicacion };
        });
    };
    const changeLiberadorPrincipalMeta1 = (value: String) => {
        var liberadorNuevo = {...tensionData.liberadorPrincipal}
        liberadorNuevo.metaPrincipal = value;
        setTensionData({ ...tensionData, liberadorPrincipal: liberadorNuevo });
    };
    const changeLiberadorPrincipalOds1 = (value: String) => {
        var liberadorNuevo = {...tensionData.liberadorPrincipal}
        liberadorNuevo.odsPrincipal = value;
        setTensionData({ ...tensionData, liberadorPrincipal: liberadorNuevo });
    };
    const changeLiberadorPrincipalSituacion= (value: String) => {
        var liberadorNuevo = {...tensionData.liberadorPrincipal}
        liberadorNuevo.situacion = value;
        setTensionData({ ...tensionData, liberadorPrincipal: liberadorNuevo });
    };
    const changeLiberadorPrincipalDimension = (value: String) => {
        var liberadorNuevo = {...tensionData.liberadorPrincipal}
        liberadorNuevo.dimensiones = value;
        setTensionData({ ...tensionData, liberadorPrincipal: liberadorNuevo });
    };
    const changeLiberadorSituacion = (value: String, index: number) => {
        setTensionData(tensionData => {
          const liberador: Liberador[] = [...tensionData.liberadores];
          liberador[index].situacion = value;
          return { ...tensionData, liberadores: liberador };
        });
      };
    const changeLiberadorDimension= (value: String, index: number) => {
        setTensionData(tensionData => {
          const liberador: Liberador[] = [...tensionData.liberadores];
          liberador[index].dimensiones = value;
          return { ...tensionData, liberadores: liberador };
        });
    };
    const changeLiberadorOdsPrincipal= (value: String, index: number) => {
        setTensionData(tensionData => {
          const liberador: Liberador[] = [...tensionData.liberadores];
          liberador[index].odsPrincipal = value;
          return { ...tensionData, liberadores: liberador };
        });
    };
    const changeLiberadorMetaPrincipal= (value: String, index: number) => {
        setTensionData(tensionData => {
            const liberador: Liberador[] = [...tensionData.liberadores];
            liberador[index].metaPrincipal = value;
            return { ...tensionData, liberadores: liberador };
        });
    };
    const changeReforzadorSituacion = (value: String, index: number) => {
        setTensionData(tensionData => {
            const reforzador: Reforzador[] = [...tensionData.reforzadores];
            reforzador[index].situacion = value;
            return { ...tensionData, reforzadores: reforzador };
        });
    };
    const changeReforzadorDimension = (value: String, index: number) => {
        setTensionData(tensionData => {
            const reforzador: Reforzador[] = [...tensionData.reforzadores];
            reforzador[index].dimensiones = value;
            return { ...tensionData, reforzadores: reforzador };
        });
    };
    const changeReforzadorOdsPrincipal = (value: String, index: number) => {
        setTensionData(tensionData => {
          const reforzador: Reforzador[] = [...tensionData.reforzadores];
          reforzador[index].odsPrincipal = value;
          return { ...tensionData, reforzadores: reforzador };
        });
      };
    const changeReforzadorMetaPrincipal= (value: String, index: number) => {
        setTensionData(tensionData => {
          const reforzador: Reforzador[] = [...tensionData.reforzadores];
          reforzador[index].metaPrincipal = value;
          return { ...tensionData, reforzadores: reforzador };
        });
    };
    const changeReforzadorPrincipalOds1 = (value: String) => {
        var generadorNuevo = {...tensionData.reforzadorPrincipal}
        generadorNuevo.odsPrincipal = value;
        setTensionData({ ...tensionData, reforzadorPrincipal: generadorNuevo });
    };
    const changeReforzadorPrincipalMeta1 = (value: String) => {
        var generadorNuevo = {...tensionData.reforzadorPrincipal}
        generadorNuevo.metaPrincipal = value;
        setTensionData({ ...tensionData, reforzadorPrincipal: generadorNuevo });
    };
    const changeReforzadorPrincipalSituacion = (value: String) => {
        var generadorNuevo = {...tensionData.reforzadorPrincipal}
        generadorNuevo.situacion = value;
        setTensionData({ ...tensionData, reforzadorPrincipal: generadorNuevo });
    };
    const changeReforzadorPrincipalDimension = (value: String) => {
        var generadorNuevo = {...tensionData.reforzadorPrincipal}
        generadorNuevo.dimensiones = value;
        setTensionData({ ...tensionData, reforzadorPrincipal: generadorNuevo });
    };

    function getStepContent(step: Number) {
        switch (step) {
            case 0:
                return(
                <div>
                   
                </div>
                );
        }
    }

    return(
        <div style={{ backgroundColor: "#F0EDE7", minHeight: "100vh" ,  overflowX: 'hidden', overflowY: 'hidden'}}>
            <div style={{ marginTop: 120, marginLeft: 30, marginRight: 50}}>
                
                    <Grid container direction="row" alignItems="center" justify="center" spacing = {1}>
                        <Grid container item sm={12} direction="row" justify="space-between"> 
                                <Grid item >
                                    <Typography  variant={"h5"} color="primary" display="block" >Crear tensión</Typography>
                                </Grid>
                                <Grid item >
                                    <Button variant="contained" color="secondary" size="large" style={{margin:5}} onClick={clear} >Resetear</Button>
                                    <Button  variant="contained" color="primary" size="large" style={{margin:5}}> Crear Tension </Button>
                                </Grid>
                        </Grid>  
                        <Grid sm={12}>
                            <Divider style = {{marginTop:10}}/>
                        </Grid>
                        <Grid sm={12}>
                            <Stepper activeStep={activeStep} style={{ backgroundColor: "#F0EDE7"}} alternativeLabel>
                                {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                                ))}
                            </Stepper>
                        </Grid>
                        <Grid sm={12}>
                            {activeStep === steps.length ? (
                                <div style={{textAlign : 'center'}}>
                                    <Paper style = {{padding:50, backgroundColor : "#EAE3D6"}}>
                                        <Typography variant={"h6"} color="primary" display="block">
                                            NARRATIVA
                                        </Typography>
                                        <Typography variant={"body2"} color="primary" display="block">
                                            Hace  {tensionData.evento.hacecuanto !== '' ? tensionData.evento.hacecuanto : "HACE FALTA"}. Pasa que {tensionData.evento.quepasa !== '' ? tensionData.evento.quepasa : "HACE FALTA"} en {tensionData.evento.donde !== '' ? tensionData.evento.donde : "HACE FALTA"}, y la cantidad es {tensionData.evento.cuanto !== '' ? tensionData.evento.cuanto : "HACE FALTA"}.
                                        </Typography>
                                        <Typography variant={"body2"} color="primary" display="block">
                                            Generado por {tensionData.generadorPrincipal.situacion !== '' ? tensionData.generadorPrincipal.situacion : "HACE FALTA"}
                                        </Typography>
                                        <Typography variant={"body2"} color="primary" display="block">
                                            Lo cual implica que {tensionData.implicacionPrincipal.efectos !== '' ? tensionData.implicacionPrincipal.efectos : "HACE FALTA"}
                                        </Typography>
                                        <Typography variant={"body2"} color="primary" display="block">
                                            Se encuentra reforzado por {tensionData.reforzadorPrincipal.situacion !== '' ? tensionData.reforzadorPrincipal.situacion : "HACE FALTA"}
                                        </Typography>
                                        <Typography variant={"body2"} color="primary" display="block">
                                            Y se libera cuando {tensionData.liberadorPrincipal.situacion !== '' ? tensionData.liberadorPrincipal.situacion : "HACE FALTA"}
                                        </Typography>
                                    </Paper>
                                    <Button style={{margin:20}} disabled={activeStep === 0} onClick={handleBack} >
                                        Atrás
                                    </Button>
                                </div>
                                ) : (
                                <div>
                                    <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                                    <div style={{textAlign : 'center'}}>
                                        <Button style={{margin:20}}  disabled={activeStep === 0} onClick={handleBack} >
                                            Atrás
                                        </Button>
                                        <Button style={{margin:20}}  variant="contained" color="primary" onClick={handleNext}>
                                            Siguiente
                                        </Button>
                                    </div>
                                </div>
                                )}
                        </Grid>  
                        <Dialog open={creadoDialog !== false} onClose={() => setCreadoDialog(false)}>
                            <DialogTitle >{"Crear Meta"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    La tensión ha sido creada
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setCreadoDialog(false)} color="primary">
                                OK
                            </Button>
                            </DialogActions>
                        </Dialog>  
                    </Grid>   
                
            </div>
        </div> 
    );
}
