import React, {useState, useEffect} from 'react';

import { createTension, updateTension, getTensiones } from '../../actions/tensiones';

import {Dialog,Chip, Slider, Stepper, StepLabel, Step, DialogTitle, DialogActions, MenuItem, DialogContentText, Input,  DialogContent,TextField,Select,Paper,IconButton,InputLabel,Typography,FormControl,Divider,Grid,Button} from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';

import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import FiberManualRecordOutlinedIcon from '@material-ui/icons/FiberManualRecordOutlined';
import FiberManualRecordTwoToneIcon from '@material-ui/icons/FiberManualRecordTwoTone';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { useDispatch, RootStateOrAny, useSelector } from 'react-redux';

import GaugeChart from 'react-gauge-chart'

import MetasLista from '../../InfoMatriz/metas.json';
import ODSLista from '../../InfoMatriz/ods.json';
import DimensionesLista from '../../InfoMatriz/dimensionesLista.json';
import DimensionesGeneralesLista from '../../InfoMatriz/dimensionesG.json';
import DimensionesEspecificasLista from '../../InfoMatriz/dimensionesEspecificas.json';
import Competencias from '../../InfoMatriz/Competencias.json';
import { StringLiteralLike } from 'typescript';
import { AnyScale } from '@nivo/axes';

export interface Generador {situacion: string, actores: string, odsPrincipal:string, metaPrincipal: string, dimensiones:string}
export interface Implicacion {efectos: string, odsPrincipal: string, metaPrincipal: string, dimensiones:string}
export interface Reforzador {situacion: string, odsPrincipal:string, metaPrincipal: string, dimensiones:string}
export interface ReforzadorPrincipal {situacion: string, odsPrincipal:string, metaPrincipal: string, dimensiones:string, valoracion:string}
export interface LiberadorPrincipal {situacion: string, odsPrincipal:string, metaPrincipal: string, dimensiones:string, valoracion: string}
export interface Liberador {situacion: string, odsPrincipal:string, metaPrincipal: string, dimensiones:string}
export interface ValoracionTensiones {intensidad: string, impacto: string, cronicidad: string, ingobernabilidad: string}
export interface Evento {quepasa: string, cuanto: string, donde: string, hacecuanto: string, ods: string, meta: string}

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
        return ['Dimensiones', 'Evento', 'Generadores', 'Implicaciones','Reforzadores','Liberadores', 'Valoración'];
    }

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const processDataMetas = (odsName: string) => {
        var metas : string[] = [];
        MetasLista.map((e) => (
            e.ods === odsName ? metas = e.metas : metas = metas
        ));
        return metas;
    };

    const handleSubmit = async (e:any) => {
        setCreadoDialog(true);
        e.preventDefault();
        if (currentId === 0) {
            dispatch(createTension(tensionData));
            clear();
        } else {
            dispatch(updateTension(currentId, tensionData));
            clear();
        }
      };

    const processDataDimensionEspecifica = (dimensionGeneral: string) => {
        var dimensiones : string[] = [];
        DimensionesEspecificasLista.map((e) => (
            e.Dimension === dimensionGeneral ? dimensiones = e.Especificas : dimensiones = dimensiones
        ));
        return dimensiones;
    };
    const processDataCompetencia = (dimensionEspecifica: string) => {
        var dimensiones : string[] = [];
        Competencias.map((e) => (
            e.Especifica === dimensionEspecifica ? dimensiones = e.Competencia : dimensiones = dimensiones
        ));
        return dimensiones;
    };
    const processDataDimensionesGenerales = () => {
        return DimensionesGeneralesLista.map( (e) => ({
            dimension: e.Dim,
        }));
      };
    
    const processDataODSLista = () => {
        return ODSLista.map( (e) => ({
            ods: e,
        }));
    };
    const processDataDimensionElemento = () => {
        return DimensionesLista.map( (e) => ({
            dimension: e,
        }));
    };
    
    const DimensionesElementos = processDataDimensionElemento();

    const [tensionData, setTensionData] = useState({ 
        dimension: '',
        dimensionEspecifica: '',
        competencia:'',
        evento:{quepasa: '', cuanto: '', donde: '', hacecuanto: '',  ods: '', meta: ''} as Evento,
        generadorPrincipal:{situacion: '', actores: '', odsPrincipal:'', metaPrincipal: '',  dimensiones:' '} as Generador,
        generadores:[{situacion: '', actores: '', odsPrincipal:'', metaPrincipal: '',  dimensiones:' '}] as Generador[],
        implicaciones:[{efectos: '', odsPrincipal: '', metaPrincipal: '',  dimensiones:' '}] as Implicacion[],
        implicacionPrincipal:{efectos: '', odsPrincipal: '', metaPrincipal: '',  dimensiones:' '} as Implicacion,
        reforzadores:[{situacion: '', odsPrincipal:'', metaPrincipal: '',  dimensiones:' '}] as Reforzador[],
        reforzadorPrincipal:{situacion: '', odsPrincipal:'', metaPrincipal: '',  dimensiones:' ', valoracion:''} as ReforzadorPrincipal,
        liberadores:[{situacion: '', odsPrincipal:'', metaPrincipal: '',  dimensiones:' '}] as Liberador[],
        liberadorPrincipal:{situacion: '', odsPrincipal:'', metaPrincipal: '',  dimensiones:' ', valoracion:''} as LiberadorPrincipal,
        valoracionTensiones: {intensidad: '0', impacto: '0', cronicidad: '0', ingobernabilidad: '0'} as ValoracionTensiones,
        balanceTotal: 0,
        narrativa: 'NARRATIVA \n',
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
            reforzadorPrincipal:{situacion: '', odsPrincipal:'', metaPrincipal: '',  dimensiones:' ',valoracion:''} as ReforzadorPrincipal,
            liberadores:[{situacion: '', odsPrincipal:'', metaPrincipal: '',  dimensiones:' '}] as Liberador[],
            liberadorPrincipal:{situacion: '', odsPrincipal:'', metaPrincipal: '',  dimensiones:' ',valoracion:''} as LiberadorPrincipal,
            valoracionTensiones: {intensidad: '0', impacto: '0', cronicidad: '0', ingobernabilidad: '0'} as ValoracionTensiones,
            balanceTotal: 0,
            narrativa:'NARRATIVA \n',
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
    const updateImpacto = (value: string) => {
        var valorado = {...tensionData.valoracionTensiones}
        valorado.impacto = value;
        setTensionData({ ...tensionData, valoracionTensiones: valorado });
    };
    const updateIntensidad = (value : string) => {
        var valoracionChange = {...tensionData.valoracionTensiones}
        valoracionChange.intensidad = value;
        setTensionData({ ...tensionData, valoracionTensiones: valoracionChange });
    };
    const updateCronicidad = (value : string) => {
        var valoracionChange = {...tensionData.valoracionTensiones}
        valoracionChange.cronicidad = value;
        setTensionData({ ...tensionData, valoracionTensiones: valoracionChange });
    };
    const updateIngobernabilidad = (value : string) => {
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
    const changeEventoOds = (value: string) => {
        var eventoChange = {...tensionData.evento}
        eventoChange.ods = value;
        setTensionData({ ...tensionData, evento: eventoChange });
    };
    const changeEventoMeta = (value: string) => {
        var eventoChange = {...tensionData.evento}
        eventoChange.meta = value;
        setTensionData({ ...tensionData, evento: eventoChange });
    };
    const changeEventoCuanto = (value: string) => {
        var eventoChange = {...tensionData.evento}
        eventoChange.cuanto = value;
        setTensionData({ ...tensionData, evento: eventoChange });
    };
    const changeEventoDonde = (value: string) => {
        var eventoChange = {...tensionData.evento}
        eventoChange.donde = value;
        setTensionData({ ...tensionData, evento: eventoChange });
    };
    const changeEventoQuePasa = (value: string) => {
        var eventoChange = {...tensionData.evento}
        eventoChange.quepasa = value;
        setTensionData({ ...tensionData, evento: eventoChange });
    };
    const changeEventoHaceCuanto = (value: string) => {
        var eventoChange = {...tensionData.evento}
        eventoChange.hacecuanto = value;
        setTensionData({ ...tensionData, evento: eventoChange });
    };   
    const changeGeneradorPrincipalSituacion = (value: string) => {
        var generadorNuevo = {...tensionData.generadorPrincipal}
        generadorNuevo.situacion = value;
        setTensionData({ ...tensionData, generadorPrincipal: generadorNuevo });
    };   
    const changeGeneradorSituacion = (value: string, index: number) => {
        setTensionData(tensionData => {
          const generador: Generador[] = [...tensionData.generadores];
          generador[index].situacion = value;
          return { ...tensionData, generadores: generador };
        });
      };
    const changeGeneradorPrincipalActores = (value: string) => {
        var generadorNuevo = {...tensionData.generadorPrincipal}
        generadorNuevo.actores = value;
        setTensionData({ ...tensionData, generadorPrincipal: generadorNuevo });
    };
    const changeGeneradorActores = (value: string, index: number) => {
        setTensionData(tensionData => {
            const generador: Generador[] = [...tensionData.generadores];
            generador[index].actores = value;
            return { ...tensionData, generadores: generador };
        });
    };
    const changeGeneradorPrincipalODS1= (value: string) => {
        var generadorNuevo = {...tensionData.generadorPrincipal}
        generadorNuevo.odsPrincipal = value;
        setTensionData({ ...tensionData, generadorPrincipal: generadorNuevo });
    };
    const changeGeneradorODS1= (value: string, index: number) => {
        setTensionData(tensionData => {
            const generador: Generador[] = [...tensionData.generadores];
            generador[index].odsPrincipal = value;
            return { ...tensionData, generadores: generador };
        });
    };
    const changeGeneradorPrincipalMeta1 = (value: string) => {
        var generadorNuevo = {...tensionData.generadorPrincipal}
        generadorNuevo.metaPrincipal = value;
        setTensionData({ ...tensionData, generadorPrincipal: generadorNuevo });
    };
    const changeGeneradorMeta1= (value: string, index: number) => {
        setTensionData(tensionData => {
          const generador: Generador[] = [...tensionData.generadores];
          generador[index].metaPrincipal = value;
          return { ...tensionData, generadores: generador };
        });   
    };
    const changeGeneradorPrincipalDimension= (value: string) => {
        var generadorNuevo = {...tensionData.generadorPrincipal}
        generadorNuevo.dimensiones = value;
        setTensionData({ ...tensionData, generadorPrincipal: generadorNuevo });
    };
    const changeGeneradorDimensiones= (value: string, index: number) => {
        setTensionData(tensionData => {
            const generadorLista: Generador[] = [...tensionData.generadores];
            generadorLista[index].dimensiones = value;
            return { ...tensionData, generadores: generadorLista };
        });
    };
    const changeImplicacionDimension= (value: string, index: number) => {
        setTensionData(tensionData => {
          const implicacion: Implicacion[] = [...tensionData.implicaciones];
          implicacion[index].dimensiones = value;
          return { ...tensionData, implicaciones: implicacion };
        });
      };
    const changeImplicacionPrincipalDimension = (value: string) => {
        var implicacionNuevo = {...tensionData.implicacionPrincipal}
        implicacionNuevo.dimensiones = value;
        setTensionData({ ...tensionData, implicacionPrincipal: implicacionNuevo });
    };
    const changeImplicacionPrincipalMeta1 = (value: string) => {
        var implicacionNuevo = {...tensionData.implicacionPrincipal}
        implicacionNuevo.metaPrincipal = value;
        setTensionData({ ...tensionData, implicacionPrincipal: implicacionNuevo });
    };
    const changeImplicacionPrincipalODS1 = (value: string) => {
        var implicacionNuevo = {...tensionData.implicacionPrincipal}
        implicacionNuevo.odsPrincipal = value;
        setTensionData({ ...tensionData, implicacionPrincipal: implicacionNuevo });
    };
    const changeImplicacionPrincipalEfectos = (value: string) => {
        var implicacionNuevo = {...tensionData.implicacionPrincipal}
        implicacionNuevo.efectos = value;
        setTensionData({ ...tensionData, implicacionPrincipal: implicacionNuevo });
    };
    const changeImplicacionEfectos = (value: string, index: number) => {
        setTensionData(tensionData => {
            const generador: Implicacion[] = [...tensionData.implicaciones];
            generador[index].efectos = value;
            return { ...tensionData, implicaciones: generador };
        });
    };
    const changeImplicacionOdsPrincipal = (value: string, index: number) => {
        setTensionData(tensionData => {
            const generador: Implicacion[] = [...tensionData.implicaciones];
            generador[index].odsPrincipal = value;
            return { ...tensionData, implicaciones: generador };
        });
    };
    const changeImplicacionMetaPrincipal = (value: string, index: number) => {
        setTensionData(tensionData => {
          const implicacion: Implicacion[] = [...tensionData.implicaciones];
          implicacion[index].metaPrincipal = value;
          return { ...tensionData, implicaciones: implicacion };
        });
    };
    const changeLiberadorPrincipalMeta1 = (value: string) => {
        var liberadorNuevo = {...tensionData.liberadorPrincipal}
        liberadorNuevo.metaPrincipal = value;
        setTensionData({ ...tensionData, liberadorPrincipal: liberadorNuevo });
    };
    const changeLiberadorPrincipalOds1 = (value: string) => {
        var liberadorNuevo = {...tensionData.liberadorPrincipal}
        liberadorNuevo.odsPrincipal = value;
        setTensionData({ ...tensionData, liberadorPrincipal: liberadorNuevo });
    };
    const changeLiberadorPrincipalSituacion= (value: string) => {
        var liberadorNuevo = {...tensionData.liberadorPrincipal}
        liberadorNuevo.situacion = value;
        setTensionData({ ...tensionData, liberadorPrincipal: liberadorNuevo });
    };
    const changeLiberadorPrincipalDimension = (value: string) => {
        var liberadorNuevo = {...tensionData.liberadorPrincipal}
        liberadorNuevo.dimensiones = value;
        setTensionData({ ...tensionData, liberadorPrincipal: liberadorNuevo });
    };
    const changeLiberadorPrincipalValoracion= (value: string) => {
        var liberadorNuevo = {...tensionData.liberadorPrincipal}
        liberadorNuevo.valoracion = value;
        setTensionData({ ...tensionData, liberadorPrincipal: liberadorNuevo });
    };
    const changeLiberadorSituacion = (value: string, index: number) => {
        setTensionData(tensionData => {
          const liberador: Liberador[] = [...tensionData.liberadores];
          liberador[index].situacion = value;
          return { ...tensionData, liberadores: liberador };
        });
      };
    const changeLiberadorDimension= (value: string, index: number) => {
        setTensionData(tensionData => {
          const liberador: Liberador[] = [...tensionData.liberadores];
          liberador[index].dimensiones = value;
          return { ...tensionData, liberadores: liberador };
        });
    };
    const changeLiberadorOdsPrincipal= (value: string, index: number) => {
        setTensionData(tensionData => {
          const liberador: Liberador[] = [...tensionData.liberadores];
          liberador[index].odsPrincipal = value;
          return { ...tensionData, liberadores: liberador };
        });
    };
    const changeLiberadorMetaPrincipal= (value: string, index: number) => {
        setTensionData(tensionData => {
            const liberador: Liberador[] = [...tensionData.liberadores];
            liberador[index].metaPrincipal = value;
            return { ...tensionData, liberadores: liberador };
        });
    };
    const changeReforzadorSituacion = (value: string, index: number) => {
        setTensionData(tensionData => {
            const reforzador: Reforzador[] = [...tensionData.reforzadores];
            reforzador[index].situacion = value;
            return { ...tensionData, reforzadores: reforzador };
        });
    };
    const changeReforzadorDimension = (value: string, index: number) => {
        setTensionData(tensionData => {
            const reforzador: Reforzador[] = [...tensionData.reforzadores];
            reforzador[index].dimensiones = value;
            return { ...tensionData, reforzadores: reforzador };
        });
    };
    const changeReforzadorOdsPrincipal = (value: string, index: number) => {
        setTensionData(tensionData => {
          const reforzador: Reforzador[] = [...tensionData.reforzadores];
          reforzador[index].odsPrincipal = value;
          return { ...tensionData, reforzadores: reforzador };
        });
      };
    const changeReforzadorMetaPrincipal= (value: string, index: number) => {
        setTensionData(tensionData => {
          const reforzador: Reforzador[] = [...tensionData.reforzadores];
          reforzador[index].metaPrincipal = value;
          return { ...tensionData, reforzadores: reforzador };
        });
    };
    const changeReforzadorPrincipalOds1 = (value: string) => {
        var generadorNuevo = {...tensionData.reforzadorPrincipal}
        generadorNuevo.odsPrincipal = value;
        setTensionData({ ...tensionData, reforzadorPrincipal: generadorNuevo });
    };
    const changeReforzadorPrincipalMeta1 = (value: string) => {
        var generadorNuevo = {...tensionData.reforzadorPrincipal}
        generadorNuevo.metaPrincipal = value;
        setTensionData({ ...tensionData, reforzadorPrincipal: generadorNuevo });
    };
    const changeReforzadorPrincipalValoracion = (value: string) => {
        var reforzadorNuevo = {...tensionData.reforzadorPrincipal}
        reforzadorNuevo.valoracion = value;
        setTensionData({ ...tensionData, reforzadorPrincipal: reforzadorNuevo });
    };
    const changeReforzadorPrincipalSituacion = (value: string) => {
        var generadorNuevo = {...tensionData.reforzadorPrincipal}
        generadorNuevo.situacion = value;
        setTensionData({ ...tensionData, reforzadorPrincipal: generadorNuevo });
    };
    const changeReforzadorPrincipalDimension = (value: string) => {
        var generadorNuevo = {...tensionData.reforzadorPrincipal}
        generadorNuevo.dimensiones = value;
        setTensionData({ ...tensionData, reforzadorPrincipal: generadorNuevo });
    };
    const changeNarrativa = () => {
        var narrativaTexto =  'NARRATIVA \n' + 'Hace' + tensionData.evento.hacecuanto !== '' ? tensionData.evento.hacecuanto : "HACE FALTA" + '. Pasa que' + tensionData.evento.quepasa !== '' ? tensionData.evento.quepasa : "HACE FALTA" + ' en ' + tensionData.evento.donde !== '' ? tensionData.evento.donde : "HACE FALTA" + ', y la cantidad es ' + tensionData.evento.cuanto !== '' ? tensionData.evento.cuanto : "HACE FALTA" + '\n Generado por ' + tensionData.generadorPrincipal.situacion !== '' ? tensionData.generadorPrincipal.situacion : "HACE FALTA" + '\n Lo cual implica que' + tensionData.implicacionPrincipal.efectos !== '' ? tensionData.implicacionPrincipal.efectos : "HACE FALTA" + '\n Se encuentra reforzado por'+ tensionData.reforzadorPrincipal.situacion !== '' ? tensionData.reforzadorPrincipal.situacion : "HACE FALTA" + '\n Y se libera cuando ' + tensionData.liberadorPrincipal.situacion !== '' ? tensionData.liberadorPrincipal.situacion : "HACE FALTA";
        setTensionData({ ...tensionData, narrativa: narrativaTexto});
    };
    const changeBalance = () => {
        var valoracionActual = {...tensionData.valoracionTensiones}
        var valoracionLiberador = {...tensionData.liberadorPrincipal}
        var valoracionReforzador = {...tensionData.reforzadorPrincipal}
        var suma = parseInt(valoracionActual.cronicidad) + parseInt(valoracionActual.impacto) + parseInt(valoracionActual.ingobernabilidad) + parseInt(valoracionActual.intensidad)
        var promedio = suma/4
        var balanceTotalCalculo = (promedio + parseInt(valoracionReforzador.valoracion))/ parseInt(valoracionLiberador.valoracion)
        setTensionData({ ...tensionData, balanceTotal: balanceTotalCalculo})
    }
    const showGenerador = (generador: Generador, index: number) => {
        return (
            <div>
                <Paper style={{padding:15, margin:5, backgroundColor : "#EAE3D6"}}>
                    <TextField size = "small" value = {generador.situacion} style={{margin:5}} fullWidth id="situacionGenerador" label="situación" onChange={(e) => changeGeneradorSituacion(e.target.value, index)} />
                    <TextField size = "small" value = {generador.actores} style={{margin:5}} fullWidth id="actoresGenerador" label="Actores/Agentes" onChange={(e) => changeGeneradorActores(e.target.value, index)} />
                    <FormControl style={{marginTop:10,marginRight:10,maxWidth:280,minWidth:280}} variant="outlined" >
                        <InputLabel htmlFor="generador-ods-native-simple">ODS</InputLabel>
                        <Select
                        value={generador.odsPrincipal}
                        onChange={(e) => changeGeneradorODS1(e.target.value as string, index as number)} 
                        native
                        label="ODS"
                        inputProps={{
                            name: 'ods',
                            id: 'generador-ods-native-simple',
                        }}
                        >
                        {processDataODSLista().map((odsElem) => (
                            <option value={odsElem.ods}>{odsElem.ods}</option>
                        ))}
                        </Select>
                    </FormControl>
                    <FormControl style={{marginTop:10,marginRight:10,maxWidth:80,minWidth:80}} variant="outlined" >
                        <InputLabel htmlFor="generadorMeta-meta-native-simple">Meta</InputLabel>
                        <Select
                        value={generador.metaPrincipal}
                        onChange={(e) => changeGeneradorMeta1(e.target.value as string, index as number)} 
                        native
                        label="Meta"
                        inputProps={{
                            name: 'meta',
                            id: 'generadorMeta-meta-native-simple',
                        }}
                        >
                        {processDataMetas(generador.odsPrincipal).map((meta) => (
                            <option value={meta}>{meta}</option>
                        ))}
                        </Select>
                    </FormControl>
                    <FormControl style={{marginTop:10,marginRight:10,maxWidth:200,minWidth:200}} variant="outlined" >
                        <InputLabel htmlFor="generadorDIM-dim-native-simple">Dimensión</InputLabel>
                        <Select
                        value={generador.dimensiones}
                        onChange={(e) => changeGeneradorDimensiones(e.target.value as string, index as number)} 
                        label="Dimensión"
                        inputProps={{
                            name: 'Dimensión',
                            id: 'generadorDIM-dim-native-simple',
                        }}
                        >
                        {DimensionesElementos.map((d) => (
                            <option value={d.dimension}>{d.dimension}</option>
                        ))}
                        </Select>
                    </FormControl>
                    <IconButton edge="end" aria-label="deleteGenerador" onClick={() => deleteGenerador(index)} >
                        <DeleteForeverIcon/>
                    </IconButton>
                </Paper>
            </div>
        );
    }
    const showGeneradorPrincipal = () => {
        return (
            <div>
                <Paper style={{padding:15, margin:5,backgroundColor : "#EAE3D6"}}>
                    <TextField size = "small" value = {tensionData.generadorPrincipal.situacion} style={{margin:5}} fullWidth id="situacionGenerador" label="situación" onChange={(e) => changeGeneradorPrincipalSituacion(e.target.value)} />
                    <TextField size = "small" value = {tensionData.generadorPrincipal.actores} style={{margin:5}} fullWidth id="actoresGenerador" label="Actores/Agentes" onChange={(e) => changeGeneradorPrincipalActores(e.target.value)} />
                    <FormControl style={{marginTop:10,marginRight:10,maxWidth:320,minWidth:320}} variant="outlined" >
                        <InputLabel htmlFor="generador-ods-native-simple">ODS</InputLabel>
                        <Select
                        value={tensionData.generadorPrincipal.odsPrincipal}
                        onChange={(e) => changeGeneradorPrincipalODS1(e.target.value as string)} 
                        native
                        label="ODS"
                        inputProps={{
                            name: 'ods',
                            id: 'generador-ods-native-simple',
                        }}
                        >
                        {processDataODSLista().map((odsElem) => (
                            <option value={odsElem.ods}>{odsElem.ods}</option>
                        ))}
                        </Select>
                    </FormControl>
                    <FormControl style={{marginTop:10,marginRight:10,maxWidth:80,minWidth:80}} variant="outlined" >
                        <InputLabel htmlFor="generadorMeta-meta-native-simple">Meta</InputLabel>
                        <Select
                        value={tensionData.generadorPrincipal.metaPrincipal}
                        onChange={(e) => changeGeneradorPrincipalMeta1(e.target.value as string)} 
                        native
                        label="Meta"
                        inputProps={{
                            name: 'meta',
                            id: 'generadorMeta-meta-native-simple',
                        }}
                        >
                        {processDataMetas(tensionData.generadorPrincipal.odsPrincipal).map((meta) => (
                            <option value={meta}>{meta}</option>
                        ))}
                        </Select>
                    </FormControl>
                    <FormControl style={{marginTop:10,marginRight:10,maxWidth:200,minWidth:200}} variant="outlined" >
                        <InputLabel htmlFor="DimensiónG-native-simple">Dimensión</InputLabel>
                        <Select
                        value={tensionData.generadorPrincipal.dimensiones}
                        onChange={(e) => changeGeneradorPrincipalDimension(e.target.value as string)} 
                        native
                        label="Dimensión"
                        inputProps={{
                            name: 'Dimensión',
                            id: 'DimensiónG-native-simple',
                        }}
                        >
                         {DimensionesElementos.map((d) => (
                            <option value={d.dimension}>{d.dimension}</option>
                        ))}
                        </Select>
                    </FormControl>                    
                </Paper>
            </div>
        );
    }
    const showImplicacion = (implicacion: Implicacion, index: number) => {
        return (
            <div>
                <Paper style={{padding:15, margin:5, backgroundColor : "#EAE3D6"}}>
                <TextField size = "small" value = {implicacion.efectos} style={{margin:5}} fullWidth id="efectoImplicacion" label="Efecto" onChange={(e) => changeImplicacionEfectos(e.target.value, index)} />
                    <FormControl style={{marginTop:10,marginRight:10,maxWidth:280,minWidth:280}} variant="outlined" >
                        <InputLabel htmlFor="implicacion-ods-native-simple">ODS</InputLabel>
                        <Select
                        value={implicacion.odsPrincipal}
                        onChange={(e) => changeImplicacionOdsPrincipal(e.target.value as string, index as number)} 
                        native
                        label="ODS"
                        inputProps={{
                            name: 'ods',
                            id: 'implicacion-ods-native-simple',
                        }}
                        >
                        {processDataODSLista().map((odsElem) => (
                            <option value={odsElem.ods}>{odsElem.ods}</option>
                        ))}
                        </Select>
                    </FormControl>
                    <FormControl style={{marginTop:10,marginRight:10,maxWidth:80,minWidth:80}} variant="outlined" >
                        <InputLabel htmlFor="ImplicacionMeta-meta-native-simple">Meta</InputLabel>
                        <Select
                        value={implicacion.metaPrincipal}
                        onChange={(e) => changeImplicacionMetaPrincipal(e.target.value as string, index as number)} 
                        native
                        label="Meta"
                        inputProps={{
                            name: 'meta',
                            id: 'ImplicacionMeta-meta-native-simple',
                        }}
                        >
                        {processDataMetas(implicacion.odsPrincipal).map((meta) => (
                            <option value={meta}>{meta}</option>
                        ))}
                        </Select>
                    </FormControl>
                    <FormControl style={{marginTop:10,marginRight:10,maxWidth:200,minWidth:200}} variant="outlined" >
                        <InputLabel htmlFor="ImplicacionDIM-dim-native-simple">Dimensión</InputLabel>
                        <Select
                        value={implicacion.dimensiones}
                        onChange={(e) => changeImplicacionDimension(e.target.value as string, index as number)} 
                        label="Dimensión"
                        inputProps={{
                            name: 'Dimensión',
                            id: 'ImplicacionDIM-dim-native-simple',
                        }}
                        >
                        {DimensionesElementos.map((d) => (
                            <option value={d.dimension}>{d.dimension}</option>
                        ))}
                        </Select>
                    </FormControl>
                    <IconButton edge="end" aria-label="deleteImplicacion" onClick={() => deleteImplicacion(index)} >
                        <DeleteForeverIcon/>
                    </IconButton>
                </Paper>
            </div>
        );
    }
    const showImplicacionPrincipal = () => {
        return (
            <div>
                <Paper style={{padding:15, margin:5,backgroundColor : "#EAE3D6"}}>
                <TextField size = "small" value = {tensionData.implicacionPrincipal.efectos} style={{margin:5}} fullWidth id="efectoImplicacion" label="Efecto" onChange={(e) => changeImplicacionPrincipalEfectos(e.target.value)} />
                    <FormControl style={{marginTop:10,marginRight:10,maxWidth:320,minWidth:320}} variant="outlined" >
                        <InputLabel htmlFor="implicacion-ods-native-simple">ODS</InputLabel>
                        <Select
                        value={tensionData.implicacionPrincipal.odsPrincipal}
                        onChange={(e) => changeImplicacionPrincipalODS1(e.target.value as string)} 
                        native
                        label="ODS"
                        inputProps={{
                            name: 'ods',
                            id: 'implicacion-ods-native-simple',
                        }}
                        >
                        {processDataODSLista().map((odsElem) => (
                            <option value={odsElem.ods}>{odsElem.ods}</option>
                        ))}
                        </Select>
                    </FormControl>
                    <FormControl style={{marginTop:10,marginRight:10,maxWidth:80,minWidth:80}} variant="outlined" >
                        <InputLabel htmlFor="ImplicacionMeta-meta-native-simple">Meta</InputLabel>
                        <Select
                        value={tensionData.implicacionPrincipal.metaPrincipal}
                        onChange={(e) => changeImplicacionPrincipalMeta1(e.target.value as string)} 
                        native
                        label="Meta"
                        inputProps={{
                            name: 'meta',
                            id: 'ImplicacionMeta-meta-native-simple',
                        }}
                        >
                        {processDataMetas(tensionData.implicacionPrincipal.odsPrincipal).map((meta) => (
                            <option value={meta}>{meta}</option>
                        ))}
                        </Select>
                    </FormControl>
                    <FormControl style={{marginTop:10,marginRight:10,maxWidth:200,minWidth:200}} variant="outlined" >
                        <InputLabel htmlFor="DimensiónG-native-simple">Dimensión</InputLabel>
                        <Select
                        value={tensionData.implicacionPrincipal.dimensiones}
                        onChange={(e) => changeImplicacionPrincipalDimension(e.target.value as string)} 
                        native
                        label="Dimensión"
                        inputProps={{
                            name: 'Dimensión',
                            id: 'DimensiónG-native-simple',
                        }}
                        >
                         {DimensionesElementos.map((d) => (
                            <option value={d.dimension}>{d.dimension}</option>
                        ))}
                        </Select>
                    </FormControl>                    
                </Paper>
            </div>
        );
    }
    const showLiberador = (liberador: Liberador, index: number) => {
        return (
            <div>
                <Paper style={{padding:15, margin:5, backgroundColor : "#EAE3D6"}}>
                    <TextField size = "small" value = {liberador.situacion} style={{margin:5}} fullWidth id="situacionLiberador" label="Situación" onChange={(e) => changeLiberadorSituacion(e.target.value, index)} />
                    <FormControl style={{marginTop:10,marginRight:10,maxWidth:280,minWidth:280}} variant="outlined" >
                        <InputLabel htmlFor="liberador-ods-native-simple">ODS</InputLabel>
                        <Select
                        value={liberador.odsPrincipal}
                        onChange={(e) => changeLiberadorOdsPrincipal(e.target.value as string, index as number)} 
                        native
                        label="ODS"
                        inputProps={{
                            name: 'ods',
                            id: 'liberador-ods-native-simple',
                        }}
                        >
                        {processDataODSLista().map((odsElem) => (
                            <option value={odsElem.ods}>{odsElem.ods}</option>
                        ))}
                        </Select>
                    </FormControl>
                    <FormControl style={{marginTop:10,marginRight:10,maxWidth:80,minWidth:80}} variant="outlined" >
                        <InputLabel htmlFor="LiberadorMeta-meta-native-simple">Meta</InputLabel>
                        <Select
                        value={liberador.metaPrincipal}
                        onChange={(e) => changeLiberadorMetaPrincipal(e.target.value as string, index as number)} 
                        native
                        label="Meta"
                        inputProps={{
                            name: 'meta',
                            id: 'LiberadorMeta-meta-native-simple',
                        }}
                        >
                        {processDataMetas(liberador.odsPrincipal).map((meta) => (
                            <option value={meta}>{meta}</option>
                        ))}
                        </Select>
                    </FormControl>
                    <FormControl style={{marginTop:10,marginRight:10,maxWidth:200,minWidth:200}} variant="outlined" >
                        <InputLabel htmlFor="LiberadorDIM-dim-native-simple">Dimensión</InputLabel>
                        <Select
                        value={liberador.dimensiones}
                        onChange={(e) => changeLiberadorDimension(e.target.value as string, index as number)} 
                        label="Dimensión"
                        inputProps={{
                            name: 'Dimensión',
                            id: 'LiberadorDIM-dim-native-simple',
                        }}
                        >
                        {DimensionesElementos.map((d) => (
                            <option value={d.dimension}>{d.dimension}</option>
                        ))}
                        </Select>
                    </FormControl>
                    <IconButton edge="end" aria-label="deleteLiberador" onClick={() => deleteLiberador(index)} >
                        <DeleteForeverIcon/>
                    </IconButton>
                </Paper>
            </div>
        );
    }
    const showLiberadorPrincipal = () => {
        return (
            <div>
                <Paper style={{padding:15, margin:5,backgroundColor : "#EAE3D6"}}>
                    <TextField size = "small" value = {tensionData.liberadorPrincipal.situacion} style={{margin:5}} fullWidth id="situacionLiberador" label="Situación" onChange={(e) => changeLiberadorPrincipalSituacion(e.target.value)} />
                    <FormControl style={{marginTop:10,marginRight:10,maxWidth:200,minWidth:200}} variant="outlined" >
                        <InputLabel htmlFor="liberador-ods-native-simple">ODS</InputLabel>
                        <Select
                        value={tensionData.liberadorPrincipal.odsPrincipal}
                        onChange={(e) => changeLiberadorPrincipalOds1(e.target.value as string)} 
                        native
                        label="ODS"
                        inputProps={{
                            name: 'ods',
                            id: 'liberador-ods-native-simple',
                        }}
                        >
                        {processDataODSLista().map((odsElem) => (
                            <option value={odsElem.ods}>{odsElem.ods}</option>
                        ))}
                        </Select>
                    </FormControl>
                    <FormControl style={{marginTop:10,marginRight:10,maxWidth:60,minWidth:60}} variant="outlined" >
                        <InputLabel htmlFor="LiberadorMeta-meta-native-simple">Meta</InputLabel>
                        <Select
                        value={tensionData.liberadorPrincipal.metaPrincipal}
                        onChange={(e) => changeLiberadorPrincipalMeta1(e.target.value as string)} 
                        native
                        label="Meta"
                        inputProps={{
                            name: 'meta',
                            id: 'LiberadorMeta-meta-native-simple',
                        }}
                        >
                        {processDataMetas(tensionData.liberadorPrincipal.odsPrincipal).map((meta) => (
                            <option value={meta}>{meta}</option>
                        ))}
                        </Select>
                    </FormControl>
                    <FormControl style={{marginTop:10,marginRight:10,maxWidth:180,minWidth:180}} variant="outlined" >
                        <InputLabel htmlFor="DimensiónG-native-simple">Dimensión</InputLabel>
                        <Select
                        value={tensionData.liberadorPrincipal.dimensiones}
                        onChange={(e) => changeLiberadorPrincipalDimension(e.target.value as string)} 
                        native
                        label="Dimensión"
                        inputProps={{
                            name: 'Dimensión',
                            id: 'DimensiónG-native-simple',
                        }}
                        >
                         {DimensionesElementos.map((d) => (
                            <option value={d.dimension}>{d.dimension}</option>
                        ))}
                        </Select>
                    </FormControl>              
                    <FormControl style={{marginTop:10,marginRight:10,maxWidth:120,minWidth:120}} variant="outlined" >
                        <InputLabel htmlFor="Valoración-native-simple">Valoración</InputLabel>
                        <Select
                            value={tensionData.liberadorPrincipal.valoracion}
                            onChange = {(e : any) => changeLiberadorPrincipalValoracion(e.target.value as string)}                                                native
                            label="Valoración"
                            inputProps={{name:'Valoración-native-simple'}}
                        >
                                <option value={''}>{}</option>
                                <option value={'1'}>{1}</option>
                                <option value={'2'}>{2}</option>
                                <option value={'3'}>{3}</option>
                                <option value={'4'}>{4}</option>
                                <option value={'5'}>{5}</option>
                        </Select>
                    </FormControl>        
                </Paper>
            </div>
        );
    }
    const showReforzador = (reforzador: Reforzador, index: number) => {
        return (
            <div>
                <Paper style={{padding:15, margin:5, backgroundColor : "#EAE3D6"}}>
                    <TextField size = "small" value = {reforzador.situacion} fullWidth style={{margin:5}} id="situacionreforzador" label="Situación" onChange={(e) => changeReforzadorSituacion(e.target.value, index)} />
                    <FormControl style={{marginTop:10,marginRight:10,maxWidth:280,minWidth:280}} variant="outlined" >
                        <InputLabel htmlFor="reforzador-ods-native-simple">ODS</InputLabel>
                        <Select
                        value={reforzador.odsPrincipal}
                        onChange={(e) =>  changeReforzadorOdsPrincipal(e.target.value as string, index as number)} 
                        native
                        label="ODS"
                        inputProps={{
                            name: 'ods',
                            id: 'reforzador-ods-native-simple',
                        }}
                        >
                        {processDataODSLista().map((odsElem) => (
                            <option value={odsElem.ods}>{odsElem.ods}</option>
                        ))}
                        </Select>
                    </FormControl>
                    <FormControl style={{marginTop:10,marginRight:10,maxWidth:80,minWidth:80}} variant="outlined" >
                        <InputLabel htmlFor="ReforzadorMeta-meta-native-simple">Meta</InputLabel>
                        <Select
                        value={reforzador.metaPrincipal}
                        onChange={(e) => changeReforzadorMetaPrincipal(e.target.value as string, index as number)} 
                        native
                        label="Meta"
                        inputProps={{
                            name: 'meta',
                            id: 'ReforzadorMeta-meta-native-simple',
                        }}
                        >
                        {processDataMetas(reforzador.odsPrincipal).map((meta) => (
                            <option value={meta}>{meta}</option>
                        ))}
                        </Select>
                    </FormControl>
                    <FormControl style={{marginTop:10,marginRight:10,maxWidth:200,minWidth:200}} variant="outlined" >
                        <InputLabel htmlFor="ReforzadorDIM-dim-native-simple">Dimensión</InputLabel>
                        <Select
                        value={reforzador.dimensiones}
                        onChange={(e) => changeReforzadorDimension(e.target.value as string, index as number)} 
                        label="Dimensión"
                        inputProps={{
                            name: 'Dimensión',
                            id: 'ReforzadorDIM-dim-native-simple',
                        }}
                        >
                        {DimensionesElementos.map((d) => (
                            <option value={d.dimension}>{d.dimension}</option>
                        ))}
                        </Select>
                    </FormControl>
                    <IconButton edge="end" aria-label="deleteReforzador" onClick={() => deleteReforzador(index)} >
                        <DeleteForeverIcon/>
                    </IconButton>
                </Paper>
            </div>
        );
    }
    const showReforzadorPrincipal = () => {
        return (
            <div>
                <Paper style={{padding:15, margin:5,backgroundColor : "#EAE3D6"}}>
                    <TextField size = "small" value = {tensionData.reforzadorPrincipal.situacion} fullWidth style={{margin:5}} id="situacionreforzador" label="Situación" onChange={(e) => changeReforzadorPrincipalSituacion(e.target.value)} />
                    <FormControl style={{marginTop:10,marginRight:10,maxWidth:200,minWidth:200}} variant="outlined" >
                        <InputLabel htmlFor="reforzador-ods-native-simple">ODS</InputLabel>
                        <Select
                        value={tensionData.liberadorPrincipal.odsPrincipal}
                        onChange={(e) =>  changeReforzadorPrincipalOds1(e.target.value as string)} 
                        native
                        label="ODS"
                        inputProps={{
                            name: 'ods',
                            id: 'reforzador-ods-native-simple',
                        }}
                        >
                        {processDataODSLista().map((odsElem) => (
                            <option value={odsElem.ods}>{odsElem.ods}</option>
                        ))}
                        </Select>
                    </FormControl>
                    <FormControl style={{marginTop:10,marginRight:10,maxWidth:60,minWidth:60}} variant="outlined" >
                        <InputLabel htmlFor="ReforzadorMeta-meta-native-simple">Meta</InputLabel>
                        <Select
                        value={tensionData.liberadorPrincipal.metaPrincipal}
                        onChange={(e) => changeReforzadorPrincipalMeta1(e.target.value as string)} 
                        native
                        label="Meta"
                        inputProps={{
                            name: 'meta',
                            id: 'ReforzadorMeta-meta-native-simple',
                        }}
                        >
                        {processDataMetas(tensionData.liberadorPrincipal.odsPrincipal).map((meta) => (
                            <option value={meta}>{meta}</option>
                        ))}
                        </Select>
                    </FormControl>
                    <FormControl style={{marginTop:10,marginRight:10,maxWidth:180,minWidth:180}} variant="outlined" >
                        <InputLabel htmlFor="DimensiónG-native-simple">Dimensión</InputLabel>
                        <Select
                        value={tensionData.liberadorPrincipal.dimensiones}
                        onChange={(e) => changeReforzadorPrincipalDimension(e.target.value as string)} 
                        native
                        label="Dimensión"
                        inputProps={{
                            name: 'Dimensión',
                            id: 'DimensiónG-native-simple',
                        }}
                        >
                         {DimensionesElementos.map((d) => (
                            <option value={d.dimension}>{d.dimension}</option>
                        ))}
                        </Select>
                    </FormControl>  
                    <FormControl style={{marginTop:10,marginRight:10,maxWidth:120,minWidth:120}} variant="outlined" >
                        <InputLabel htmlFor="Valoración-native-simple">Valoración</InputLabel>
                        <Select
                            value={tensionData.reforzadorPrincipal.valoracion}
                            onChange = {(e : any) => changeReforzadorPrincipalValoracion(e.target.value as string)}                                                native
                            label="Valoración"
                            inputProps={{name:'Valoración-native-simple'}}
                        >
                                <option value={''}>{}</option>
                                <option value={'1'}>{1}</option>
                                <option value={'2'}>{2}</option>
                                <option value={'3'}>{3}</option>
                                <option value={'4'}>{4}</option>
                                <option value={'5'}>{5}</option>
                        </Select>
                    </FormControl>                        
                </Paper>
            </div>
        );
    }
    const showNarrativa = () => {
        return(
            <div>
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
            </div>
        );
    }
    function getStepContent(step: number) {
        switch (step) {
            case 0:
                return(
                <div>
                    <Grid container direction="column" alignItems="center" justify="center" >
                        <Paper style = {{padding:50, backgroundColor : "#EAE3D6"}}>
                        <Grid item sm={12} style = {{margin:10}}>
                            <FormControl style = {{minWidth:800, maxWidth:800}} variant="outlined" >
                                <InputLabel htmlFor="outlined-age-native-simple">Dimension</InputLabel>
                                <Select
                                value={tensionData.dimension}
                                onChange={handleDimensionChange}
                                native
                                label="dimension"
                                inputProps={{
                                    name: 'dimension',
                                    id: 'outlined-dimension-native-simple',
                                }}
                                >
                                {
                                    processDataDimensionesGenerales().map((e) => (
                                        <option value={e.dimension} > {e.dimension}</option>
                                    ))
                                }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item sm={12} style = {{margin:10}}>
                            <FormControl style = {{minWidth:800, maxWidth:800}} variant="outlined" >
                                <InputLabel htmlFor="outlined-age-native-simple">Dimensión Específica</InputLabel>
                                <Select
                                value={tensionData.dimensionEspecifica}
                                onChange={handleDimensionEspecificaChange}
                                native
                                label="dimension"
                                inputProps={{
                                    name: 'dimension',
                                    id: 'outlined-dimension-native-simple',
                                }}
                                >
                                {
                                    processDataDimensionEspecifica(tensionData.dimension).map((dimensiones) => (
                                        <option value={dimensiones} > {dimensiones}</option>
                                    ))
                                }
                                </Select>
                            </FormControl>
                        </Grid>
                        

                        <Grid item sm={12} style = {{margin:10}}>
                            <FormControl style = {{minWidth:800, maxWidth:800}} variant="outlined" >
                                <InputLabel htmlFor="outlined-age-native-simple">Competencia</InputLabel>
                                <Select
                                value={tensionData.competencia}
                                onChange={handleCompetenciaChange}
                                native
                                label="competencia"
                                inputProps={{
                                    name: 'competencia',
                                    id: 'outlined-competencia-native-simple',
                                }}
                                >
                                {
                                    processDataCompetencia(tensionData.dimensionEspecifica).map((dimensiones) => (
                                        <option value={dimensiones} > {dimensiones}</option>
                                    ))
                                }
                                </Select>
                            </FormControl>
                        </Grid>
                        </Paper>
                    </Grid>
                </div>
                );
            case 1:
                return(
                    <div>
                    <Grid container direction="row" alignItems="flex-start" justify="center" spacing = {1}>
                    <Grid item sm={9}>
                    <Paper style = {{paddingRight:40, paddingLeft:40, paddingBottom:10, paddingTop:10, backgroundColor:"#EAE3D6"}}>
                        <Grid item sm={12} style={{marginTop:10}} >
                            <TextField size="small" fullWidth style={{minWidth:300}} id="Quepasa" label="¿Qué pasa?" variant="outlined" value={tensionData.evento.quepasa} onChange={(e) => changeEventoQuePasa(e.target.value)}/>
                        </Grid>
                        <Grid item sm={12} style={{marginTop:10}}>
                            <TextField size="small" fullWidth style={{minWidth:300}} id="Cuanto" label="¿Cuánto?" variant="outlined" value={tensionData.evento.cuanto} onChange={(e) => changeEventoCuanto(e.target.value)}/>
                        </Grid>
                        <Grid item sm={12} style={{marginTop:10}}>
                            <TextField size="small" fullWidth style={{minWidth:300}} id="Donde" label="¿Dónde?" variant="outlined" value={tensionData.evento.donde} onChange={(e) => changeEventoDonde(e.target.value)}/>
                        </Grid>
                        <Grid item sm={12} style={{marginTop:10}}>
                            <TextField size="small" fullWidth style={{minWidth:300}} id="Hacecuanto" label="¿Hace cuánto tiempo?" variant="outlined" value={tensionData.evento.hacecuanto} onChange={(e) => changeEventoHaceCuanto(e.target.value)}/>
                        </Grid>
                        <Grid item sm={12} >
                            <FormControl style={{marginTop:10,marginRight:10,maxWidth:370,minWidth:370}} variant="outlined" >
                                <InputLabel htmlFor="outlined-ods-native-simple">ODS</InputLabel>
                                <Select
                                value={tensionData.evento.ods}
                                onChange={(e) => changeEventoOds(e.target.value as string)}
                                native
                                label="ODS"
                                inputProps={{
                                    name: 'ods',
                                    id: 'outlined-ods-native-simple',
                                }}
                                >
                                {processDataODSLista().map((odsElem) => (
                                    <option value={odsElem.ods}>{odsElem.ods}</option>
                                ))}
                                </Select>
                            </FormControl>
                            <FormControl style={{marginTop:10,marginRight:10,maxWidth:400,minWidth:200}} variant="outlined" >
                                <InputLabel htmlFor="evento-meta-native-simple">Meta</InputLabel>
                                <Select
                                value={tensionData.evento.meta}
                                onChange={(e) => changeEventoMeta(e.target.value as string)}
                                native
                                label="Meta"
                                inputProps={{
                                    name: 'meta',
                                    id: 'evento-meta-native-simple',
                                }}
                                >
                                {processDataMetas(tensionData.evento.ods).map((meta) => (
                                    <option value={meta}>{meta}</option>
                                ))}
                                </Select>
                            </FormControl>
                    </Grid>
                </Paper>
                </Grid>
                <Grid item sm={3}>
                    {showNarrativa()}
                </Grid>
            </Grid>
            </div>
            );
            case 2:
                return(
                <Grid container direction="column" alignItems="flex-start" justify="center" spacing = {1}>
                    <Grid style={{marginTop:20}}>    
                        <Grid container direction="row" alignItems="flex-start" justify="center" spacing = {1}>
                            <Grid item sm={9}>
                                {showGeneradorPrincipal()}
                                <Divider style={{marginTop:20,marginBottom:20}}/>
                                <Grid container item direction="row" justify="space-between"> 
                                    <Typography  variant={"h6"} style={{margin:10}} color="primary" display="block" >Complementarios</Typography>
                                    <Button variant="contained" onClick = {() => addGenerador()} style={{marginBottom:10}}  color="primary">
                                        Crear Generador
                                    </Button>
                                </Grid>
                                {tensionData.generadores.map((generador, index) => (
                                    showGenerador(generador, index)
                                ))}    
                            </Grid> 
                                <Grid item sm={3}>
                                    {showNarrativa()} 
                                </Grid>
                            </Grid> 
                        </Grid> 
                    </Grid>
                );
            case 3:
                return(
                <Grid container direction="column" alignItems="flex-start" justify="center" spacing = {1}>
                    <Grid style={{marginTop:20}}>    
                        <Grid container direction="row" alignItems="flex-start" justify="center" spacing = {1}>
                            <Grid item sm={9}>
                                {showImplicacionPrincipal()}
                                <Divider style={{marginTop:20,marginBottom:20}}/>
                                <Grid container item direction="row" justify="space-between"> 
                                    <Typography  variant={"h6"} style={{margin:10}} color="primary" display="block" >Complementarios</Typography>
                                    <Button variant="contained" onClick = {() => addImplicacion()} style={{marginBottom:10}}  color="primary">
                                        Crear Implicación
                                    </Button>
                                </Grid>
                                {tensionData.implicaciones.map((implicacion, index) => (
                                    showImplicacion(implicacion, index)
                                ))}    
                            </Grid> 
                                <Grid item sm={3}>
                                    {showNarrativa()} 
                                </Grid>
                            </Grid> 
                        </Grid> 
                    </Grid>
                );
            case 4:
                return(
                <Grid container direction="column" alignItems="flex-start" justify="center" spacing = {1}>
                    <Grid style={{marginTop:20}}>    
                        <Grid container direction="row" alignItems="flex-start" justify="center" spacing = {1}>
                            <Grid item sm={9}>
                                {showReforzadorPrincipal()}
                                <Divider style={{marginTop:20,marginBottom:20}}/>
                                <Grid container item direction="row" justify="space-between"> 
                                    <Typography  variant={"h6"} style={{margin:10}} color="primary" display="block" >Complementarios</Typography>
                                    <Button variant="contained" onClick = {() => addReforzador()} style={{marginBottom:10}}  color="primary">
                                        Crear Reforzador
                                    </Button>
                                </Grid>
                                {tensionData.reforzadores.map((reforzador, index) => (
                                    showReforzador(reforzador, index)
                                ))}    
                            </Grid> 
                                <Grid item sm={3}>
                                    {showNarrativa()} 
                                </Grid>
                            </Grid> 
                        </Grid> 
                    </Grid>
                );
            case 5:
                return(
                <Grid container direction="column" alignItems="flex-start" justify="center" spacing = {1}>
                    <Grid style={{marginTop:20}}>    
                        <Grid container direction="row" alignItems="flex-start" justify="center" spacing = {1}>
                            <Grid item sm={9}>
                                {showLiberadorPrincipal()}
                                <Divider style={{marginTop:20,marginBottom:20}}/>
                                <Grid container item direction="row" justify="space-between"> 
                                    <Typography  variant={"h6"} style={{margin:10}} color="primary" display="block" >Complementarios</Typography>
                                    <Button variant="contained" onClick = {() => addLiberador()} style={{marginBottom:10}}  color="primary">
                                        Crear Liberador
                                    </Button>
                                </Grid>
                                {tensionData.liberadores.map((liberador, index) => (
                                    showLiberador(liberador, index)
                                ))}    
                            </Grid> 
                                <Grid item sm={3}>
                                    {showNarrativa()} 
                                </Grid>
                            </Grid> 
                        </Grid> 
                    </Grid>
                );
            case 6:
                return(
                    <Grid item container direction="row" alignItems="center" justify="center">   
                        <Grid item container sm={2} direction="column" alignItems="center" justify="center">
                            <Grid sm={12} style={{marginTop:20}}>     
                                <FormControl style={{marginTop:10,marginRight:10,maxWidth:130,minWidth:130}} variant="outlined" >
                                    <InputLabel htmlFor="Cronicidad-native-simple">Cronicidad</InputLabel>
                                    <Select
                                        value={tensionData.valoracionTensiones.cronicidad}
                                        onChange = {(val : any) => updateCronicidad(val.target.value as string)}                                                native
                                        label="Cronicidad"
                                        inputProps={{ name: 'Cronicidad-native-simple', }}
                                    >
                                            <option value={''}>{}</option>
                                            <option value={'1'}>{1}</option>
                                            <option value={'2'}>{2}</option>
                                            <option value={'3'}>{3}</option>
                                            <option value={'4'}>{4}</option>
                                            <option value={'5'}>{5}</option>
                                    </Select>
                                </FormControl>          
                            </Grid>
                            <Grid sm={12} style={{marginTop:20}}>     
                                <FormControl style={{marginTop:10,marginRight:10,maxWidth:130,minWidth:130}} variant="outlined" >
                                    <InputLabel htmlFor="Impacto-native-simple">Impacto</InputLabel>
                                    <Select
                                        value={tensionData.valoracionTensiones.impacto}
                                        onChange = {(val : any) => updateImpacto(val.target.value as string)}                                                native
                                        label="Impacto"
                                        inputProps={{name:'Impacto-native-simple'}}
                                    >
                                            <option value={''}>{}</option>
                                            <option value={'1'}>{1}</option>
                                            <option value={'2'}>{2}</option>
                                            <option value={'3'}>{3}</option>
                                            <option value={'4'}>{4}</option>
                                            <option value={'5'}>{5}</option>
                                    </Select>
                                </FormControl>          
                            </Grid>
                            <Grid sm={12} style={{marginTop:20}}>     
                                <FormControl style={{marginTop:10,marginRight:10,maxWidth:130,minWidth:130}} variant="outlined" >
                                    <InputLabel htmlFor="Ingobernabilidad-native-simple">Ingobernabilidad</InputLabel>
                                    <Select
                                        value={tensionData.valoracionTensiones.ingobernabilidad}
                                        onChange = {(e : any) => updateIngobernabilidad(e.target.value as string)}                                                native
                                        label="Ingobernabilidad"
                                        inputProps={{name:'Ingobernabilidad-native-simple'}}
                                    >
                                            <option value={''}>{}</option>
                                            <option value={'1'}>{1}</option>
                                            <option value={'2'}>{2}</option>
                                            <option value={'3'}>{3}</option>
                                            <option value={'4'}>{4}</option>
                                            <option value={'5'}>{5}</option>
                                    </Select>
                                </FormControl>          
                            </Grid>
                            <Grid sm={12} style={{marginTop:20}}>     
                                <FormControl style={{marginTop:10,marginRight:10,maxWidth:130,minWidth:130}} variant="outlined" >
                                    <InputLabel htmlFor="Intensidad-native-simple">Intensidad</InputLabel>
                                    <Select
                                        value={tensionData.valoracionTensiones.intensidad}
                                        onChange = {(val : any) => updateIntensidad(val.target.value as string)}                                                native
                                        label="Intensidad"
                                        inputProps={{name:'Intensidad-native-simple'}}
                                    >
                                            <option value={''}>{}</option>
                                            <option value={'1'}>{1}</option>
                                            <option value={'2'}>{2}</option>
                                            <option value={'3'}>{3}</option>
                                            <option value={'4'}>{4}</option>
                                            <option value={'5'}>{5}</option>
                                    </Select>
                                </FormControl>          
                            </Grid>
                        </Grid>
                        <Grid item container sm={6} direction="column" alignItems="center" justify="center">
                            <Button variant="contained" onClick = {() => changeBalance()} style={{marginBottom:10}}  color="primary">
                                Calcular balance
                            </Button>
                            <Grid direction="column">
                                <Grid style={{margin:20}}>
\                                   <Typography variant={'body1'}> {tensionData.balanceTotal !== 0 ? "Balance "+tensionData.balanceTotal :''} </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item sm={3}>
                            {showNarrativa()} 
                        </Grid>
                    </Grid>
                
            );
                    
                            
        }
    }

    return(
        <div style={{ backgroundColor: "#F0EDE7", minHeight: "100vh" ,  overflowX: 'hidden', overflowY: 'hidden'}}>
            <div style={{ marginTop: 20, marginLeft: 30, marginRight: 50}}>
                <form onSubmit={handleSubmit}>
                    <Grid container direction="row" alignItems="center" justify="center" spacing = {1}>
                        <Grid container item sm={12} direction="row" justify="space-between"> 
                            <Grid item >
                                <Typography  variant={"h5"} color="primary" display="block" >Crear tensión</Typography>
                            </Grid>
                            <Grid item >
                                <Button variant="contained" color="secondary" size="large" style={{margin:5}} onClick={clear} >Resetear</Button>
                                <Button onClick={handleSubmit} variant="contained" color="primary" size="large" style={{margin:5}}> Crear Tension </Button>
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
                                    <Button style={{margin:20}} disabled={activeStep === 0} onClick={handleBack} >
                                        Atrás
                                    </Button>
                                    {showNarrativa()}
                                </div>
                                ) : (
                                <div style={{marginBottom:300}}>
                                    <Grid container item sm={12} direction="row" justify="space-between"> 
                                        <Grid item >
                                            <Typography  variant={"h6"} color="primary" display="block" >{getSteps()[activeStep]}</Typography>
                                        </Grid>
                                        <Grid item >
                                            <Button style={{margin:20}}  disabled={activeStep === 0} onClick={handleBack} >
                                                Atrás
                                            </Button>
                                            <Button style={{margin:20}}  variant="contained" color="primary" onClick={handleNext}>
                                                Siguiente
                                            </Button>
                                        </Grid>
                                    </Grid> 
                                    
                                    <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                                    <br/>
                                    
                                </div>
                                )}
                        </Grid>  
                    </Grid>   
                </form>
            </div>
        </div> 
    );
}
