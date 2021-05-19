import React, {useState, useEffect} from 'react';
import {Dialog,Chip, Stepper, StepLabel, Step, DialogTitle, DialogActions, MenuItem, DialogContentText, Input,  DialogContent,TextField,Select,Paper,IconButton,InputLabel,Typography,FormControl,Divider,Grid,Button} from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';

import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import FiberManualRecordOutlinedIcon from '@material-ui/icons/FiberManualRecordOutlined';
import FiberManualRecordTwoToneIcon from '@material-ui/icons/FiberManualRecordTwoTone';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';import { useDispatch, useSelector } from 'react-redux';
import { createTension, updateTension } from '../../actions/tensiones';
import Rating from 'material-ui-rating';

export interface Generador {situacion: string, actores: string, odsPrincipal:string, metaPrincipal: string, dimensiones:string[]}
export interface Implicacion {efectos: string, odsPrincipal: string, metaPrincipal: string, dimensiones:string[]}
export interface Reforzador {situacion: string, odsPrincipal:string, metaPrincipal: string, dimensiones:string[]}
export interface Liberador {situacion: string, odsPrincipal:string, metaPrincipal: string, dimensiones:string[]}
export interface ValoracionTensiones {intensidad: number, impacto: number, cronicidad: number, ingobernabilidad: number}

export interface Evento {
    quepasa: String,
    cuanto: String,
    donde: String,
    hacecuanto: String,
    ods: String,
    meta: String,
}
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
    const [tensionData, setTensionData] = useState({ 
        dimension: '',
        dimensionEspecifica: '',
        competencia: '',
        evento:{
            quepasa: '',
            cuanto: '',
            donde: '',
            hacecuanto: '',
            ods: '',
            meta: '',
        } as Evento,
        generadorPrincipal:{situacion: '', actores: '', odsPrincipal:'', metaPrincipal: '',  dimensiones:[]} as Generador,
        generadores:[{situacion: '', actores: '', odsPrincipal:'', metaPrincipal: '',  dimensiones:[]}] as Generador[],
        implicaciones:[{efectos: '', odsPrincipal: '', metaPrincipal: '',  dimensiones:[]}] as Implicacion[],
        implicacionPrincipal:{efectos: '', odsPrincipal: '', metaPrincipal: '',  dimensiones:[]} as Implicacion,
        reforzadores:[{situacion: '', odsPrincipal:'', metaPrincipal: '',  dimensiones:[]}] as Reforzador[],
        reforzadorPrincipal:{situacion: '', odsPrincipal:'', metaPrincipal: '',  dimensiones:[]} as Reforzador,
        liberadores:[{situacion: '', odsPrincipal:'', metaPrincipal: '',  dimensiones:[]}] as Liberador[],
        liberadorPrincipal:{situacion: '', odsPrincipal:'', metaPrincipal: '',  dimensiones:[]} as Liberador,
        valoracionTensiones: {intensidad: 0, impacto: 0, cronicidad: 0, ingobernabilidad: 0} as ValoracionTensiones,
    });
    function getSteps() {
        return ['Dimension', 'Evento', 'Generadores', 'Implicaciones','Reforzadores','Liberadores', 'Valoración'];
    }
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    function getStepContent(step) {
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
                            <option aria-label="None" value="" />
                            <option value={'Ambiente Construido'}>Ambiente Construido</option>
                            <option value={'Ambiente Natural'}>Ambiente Natural</option>
                            <option value={'Desarrollo Socio-cultural y político administrativo'}>Desarrollo Socio-cultural y político administrativo</option>
                            <option value={'Desarrollo económico'}>Desarrollo económico</option>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item sm={12} style = {{margin:10}}>
                        <FormControl style = {{minWidth:800, maxWidth:800}} variant="outlined" >
                            <InputLabel htmlFor="outlined-DimensionEsp-native-simple">Dimension Especifica</InputLabel>
                            <Select
                            value={tensionData.dimensionEspecifica}
                            onChange={handleDimensionEspecificaChange}
                            native
                            label="dimensionEspecifica"
                            inputProps={{
                                name: 'dimensionEspecifica',
                                id: 'outlined-dimensionEspecifica-native-simple',
                            }}
                            >
                            <option aria-label="None" value="" />
                            <option value={tensionData.dimension === 'Ambiente Natural' ? "Áreas de reserva ambiental" :
                                tensionData.dimension === 'Ambiente Construido' ? "Infraestructura vial y de transporte y comunicaciones" :
                                tensionData.dimension === 'Desarrollo económico' ? "Infraestructuras para desarrollo económico" :
                                "Patrimonio histórico, cultural y arquitectóncico"
                            }> 
                                    {tensionData.dimension === 'Ambiente Natural' ? "Áreas de reserva ambiental" :
                                    tensionData.dimension === 'Ambiente Construido' ? "Infraestructura vial y de transporte y comunicaciones" :
                                    tensionData.dimension === 'Desarrollo económico' ? "Infraestructuras para desarrollo económico" :
                                    "Patrimonio histórico, cultural y arquitectóncico"
                                    }
                            </option>
                            <option value={tensionData.dimension === 'Ambiente Natural' ? "Áreas expuestas a amenazas y riesgos " :
                                tensionData.dimension === 'Ambiente Construido' ? "Espacio Público" :
                                tensionData.dimension === 'Desarrollo económico' ? "Localización y áreas para la actividad económica en zonas  urbanas " :
                                "Vivienda de Interes Social"
                            }> 
                                    {tensionData.dimension === 'Ambiente Natural' ? "Áreas expuestas a amenazas y riesgos " :
                                    tensionData.dimension === 'Ambiente Construido' ? "Espacio Público" :
                                    tensionData.dimension === 'Desarrollo económico' ? "Localización y áreas para la actividad económica en zonas  urbanas " :
                                    "Vivienda de Interes Social"
                                    }
                            </option>
                            <option value={tensionData.dimension === 'Ambiente Natural' ? "Clasificación y delimitación del territorio" :
                                tensionData.dimension === 'Ambiente Construido' ? "Infraestructura de servicios públicos domiciliarios" :
                                tensionData.dimension === 'Desarrollo económico' ? "Localización y áreas para la actividad económica en zonas rurales " :
                                "Servicios sociales e institucionales e infraestructuras socioculturales para la garantia y prestación de servicios sociales a cargo del Estado. "
                            }> 
                                    {tensionData.dimension === 'Ambiente Natural' ? "Clasificación y delimitación del territorio" :
                                    tensionData.dimension === 'Ambiente Construido' ? "Infraestructura de servicios públicos domiciliarios" :
                                    tensionData.dimension === 'Desarrollo económico' ? "Localización y áreas para la actividad económica en zonas rurales " :
                                    "Servicios sociales e institucionales e infraestructuras socioculturales para la garantia y prestación de servicios sociales a cargo del Estado. "
                                    }
                            </option>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item sm={12} style = {{margin:10}}>
                        <FormControl style = {{minWidth:800, maxWidth:800}} variant="outlined" >
                            <InputLabel htmlFor="outlined-competencia-native-simple">Competencia</InputLabel>
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
                            <option value={
                                tensionData.dimensionEspecifica === 'Servicios sociales e institucionales e infraestructuras socioculturales para la garantia y prestación de servicios sociales a cargo del Estado. ' ? "Servicios de Seguridad y Justicia" :
                                ""}> 
                                {
                                tensionData.dimensionEspecifica === 'Servicios sociales e institucionales e infraestructuras socioculturales para la garantia y prestación de servicios sociales a cargo del Estado. ' ? "Servicios de Seguridad y Justicia" :
                                ""}
                            </option>

                            <option value={
                                tensionData.dimensionEspecifica === 'Servicios sociales e institucionales e infraestructuras socioculturales para la garantia y prestación de servicios sociales a cargo del Estado. ' ? "Servicios Institucionales (Alcaldía, despachos administrativos) " :
                                ""}> 
                                {
                                tensionData.dimensionEspecifica === 'Servicios sociales e institucionales e infraestructuras socioculturales para la garantia y prestación de servicios sociales a cargo del Estado. ' ? "Servicios Institucionales (Alcaldía, despachos administrativos) " :
                                ""}
                            </option>
                            <option value={tensionData.dimensionEspecifica === 'Áreas de reserva ambiental' ? "Parques Naturales Nacionales" :
                                tensionData.dimensionEspecifica === 'Áreas expuestas a amenazas y riesgos ' ? "Inundaciones" :
                                tensionData.dimensionEspecifica === 'Clasificación y delimitación del territorio' ? "" :
                                tensionData.dimensionEspecifica === 'Infraestructura vial y de transporte y comunicaciones' ? "Vias" :
                                tensionData.dimensionEspecifica === 'Espacio Público' ? "" :
                                tensionData.dimensionEspecifica === 'Infraestructura de servicios públicos domiciliarios' ? "Agua para consumo humano" :
                                tensionData.dimensionEspecifica === 'Patrimonio histórico, cultural y arquitectóncico' ? "" :
                                tensionData.dimensionEspecifica === 'Vivienda de Interes Social' ? "Vivienda de Interes Social" :
                                tensionData.dimensionEspecifica === 'Servicios sociales e institucionales e infraestructuras socioculturales para la garantia y prestación de servicios sociales a cargo del Estado. ' ? "Servicio de educación" :
                                tensionData.dimensionEspecifica === 'Infraestructuras para desarrollo económico' ? "Centros de faenado, plazas de ferias y eventos, otros" :
                                tensionData.dimensionEspecifica === 'Localización y áreas para la actividad económica en zonas  urbanas ' ? "Zonas industriales" :
                                "Zonas de producción agropecuaria"
                            }> 
                                {tensionData.dimensionEspecifica === 'Áreas de reserva ambiental' ? "Parques Naturales Nacionales" :
                                tensionData.dimensionEspecifica === 'Áreas expuestas a amenazas y riesgos ' ? "Inundaciones" :
                                tensionData.dimensionEspecifica === 'Clasificación y delimitación del territorio' ? "" :
                                tensionData.dimensionEspecifica === 'Infraestructura vial y de transporte y comunicaciones' ? "Vias" :
                                tensionData.dimensionEspecifica === 'Espacio Público' ? "" :
                                tensionData.dimensionEspecifica === 'Infraestructura de servicios públicos domiciliarios' ? "Agua para consumo humano" :
                                tensionData.dimensionEspecifica === 'Patrimonio histórico, cultural y arquitectóncico' ? "" :
                                tensionData.dimensionEspecifica === 'Vivienda de Interes Social' ? "Vivienda de Interes Social" :
                                tensionData.dimensionEspecifica === 'Servicios sociales e institucionales e infraestructuras socioculturales para la garantia y prestación de servicios sociales a cargo del Estado. ' ? "Servicio de educación" :
                                tensionData.dimensionEspecifica === 'Infraestructuras para desarrollo económico' ? "Centros de faenado, plazas de ferias y eventos, otros" :
                                tensionData.dimensionEspecifica === 'Localización y áreas para la actividad económica en zonas  urbanas ' ? "Zonas industriales" :
                                "Zonas de producción agropecuaria"}
                            </option>
                            
                            <option value={tensionData.dimensionEspecifica === 'Áreas de reserva ambiental' ? "Reservas de Ley segunda" :
                                tensionData.dimensionEspecifica === 'Áreas expuestas a amenazas y riesgos ' ? "Avenidas torrenciales" :
                                tensionData.dimensionEspecifica === 'Clasificación y delimitación del territorio' ? "" :
                                tensionData.dimensionEspecifica === 'Infraestructura vial y de transporte y comunicaciones' ? "Puertos" :
                                tensionData.dimensionEspecifica === 'Espacio Público' ? "" :
                                tensionData.dimensionEspecifica === 'Infraestructura de servicios públicos domiciliarios' ? "Saneamiento básico" :
                                tensionData.dimensionEspecifica === 'Patrimonio histórico, cultural y arquitectóncico' ? "" :
                                tensionData.dimensionEspecifica === 'Vivienda de Interes Social' ? "Vivienda de Interes Social" :
                                tensionData.dimensionEspecifica === 'Servicios sociales e institucionales e infraestructuras socioculturales para la garantia y prestación de servicios sociales a cargo del Estado. ' ? "Servicio de recreación y deporte " :
                                tensionData.dimensionEspecifica === 'Infraestructuras para desarrollo económico' ? "Centros de acopio, centros comerciales, parques industriales, etc." :
                                tensionData.dimensionEspecifica === 'Localización y áreas para la actividad económica en zonas  urbanas ' ? "Zonas comerciales" :
                                "Zonas industriales"
                            }> 
                                {tensionData.dimensionEspecifica === 'Áreas de reserva ambiental' ? "Reservas de Ley segunda" :
                                tensionData.dimensionEspecifica === 'Áreas expuestas a amenazas y riesgos ' ? "Avenidas torrenciales" :
                                tensionData.dimensionEspecifica === 'Clasificación y delimitación del territorio' ? "" :
                                tensionData.dimensionEspecifica === 'Infraestructura vial y de transporte y comunicaciones' ? "Puertos" :
                                tensionData.dimensionEspecifica === 'Espacio Público' ? "" :
                                tensionData.dimensionEspecifica === 'Infraestructura de servicios públicos domiciliarios' ? "Saneamiento básico" :
                                tensionData.dimensionEspecifica === 'Patrimonio histórico, cultural y arquitectóncico' ? "" :
                                tensionData.dimensionEspecifica === 'Vivienda de Interes Social' ? "Vivienda de Interes Social" :
                                tensionData.dimensionEspecifica === 'Servicios sociales e institucionales e infraestructuras socioculturales para la garantia y prestación de servicios sociales a cargo del Estado. ' ? "Servicio de recreación y deporte " :
                                tensionData.dimensionEspecifica === 'Infraestructuras para desarrollo económico' ? "Centros de acopio, centros comerciales, parques industriales, etc." :
                                tensionData.dimensionEspecifica === 'Localización y áreas para la actividad económica en zonas  urbanas ' ? "Zonas comerciales" :
                                "Zonas industriales"}
                            </option>

                            <option value={tensionData.dimensionEspecifica === 'Áreas de reserva ambiental' ? "Distritos de Manejo Integrado" :
                                tensionData.dimensionEspecifica === 'Áreas expuestas a amenazas y riesgos ' ? "Incendios" :
                                tensionData.dimensionEspecifica === 'Clasificación y delimitación del territorio' ? "" :
                                tensionData.dimensionEspecifica === 'Infraestructura vial y de transporte y comunicaciones' ? "Aeropuertos" :
                                tensionData.dimensionEspecifica === 'Espacio Público' ? "" :
                                tensionData.dimensionEspecifica === 'Infraestructura de servicios públicos domiciliarios' ? "Manejo y disposición de residuos sólidos" :
                                tensionData.dimensionEspecifica === 'Patrimonio histórico, cultural y arquitectóncico' ? "" :
                                tensionData.dimensionEspecifica === 'Vivienda de Interes Social' ? "Vivienda de Interes Social" :
                                tensionData.dimensionEspecifica === 'Servicios sociales e institucionales e infraestructuras socioculturales para la garantia y prestación de servicios sociales a cargo del Estado. ' ? "Servicios culturales " :
                                tensionData.dimensionEspecifica === 'Infraestructuras para desarrollo económico' ? "Sistemas de riego" :
                                tensionData.dimensionEspecifica === 'Localización y áreas para la actividad económica en zonas  urbanas ' ? "Zonas para el desarrollo del turismo" :
                                "Zonas comerciales"
                            }> 
                                {tensionData.dimensionEspecifica === 'Áreas de reserva ambiental' ? "Distritos de Manejo Integrado" :
                                tensionData.dimensionEspecifica === 'Áreas expuestas a amenazas y riesgos ' ? "Incendios" :
                                tensionData.dimensionEspecifica === 'Clasificación y delimitación del territorio' ? "" :
                                tensionData.dimensionEspecifica === 'Infraestructura vial y de transporte y comunicaciones' ? "Aeropuertos" :
                                tensionData.dimensionEspecifica === 'Espacio Público' ? "" :
                                tensionData.dimensionEspecifica === 'Infraestructura de servicios públicos domiciliarios' ? "Manejo y disposición de residuos sólidos" :
                                tensionData.dimensionEspecifica === 'Patrimonio histórico, cultural y arquitectóncico' ? "" :
                                tensionData.dimensionEspecifica === 'Vivienda de Interes Social' ? "Vivienda de Interes Social" :
                                tensionData.dimensionEspecifica === 'Servicios sociales e institucionales e infraestructuras socioculturales para la garantia y prestación de servicios sociales a cargo del Estado. ' ? "Servicios culturales " :
                                tensionData.dimensionEspecifica === 'Infraestructuras para desarrollo económico' ? "Sistemas de riego" :
                                tensionData.dimensionEspecifica === 'Localización y áreas para la actividad económica en zonas  urbanas ' ? "Zonas para el desarrollo del turismo" :
                                "Zonas comerciales"}
                            </option>

                            <option value={tensionData.dimensionEspecifica === 'Áreas de reserva ambiental' ? "Zonas de Páramo y subpáramo" :
                                tensionData.dimensionEspecifica === 'Áreas expuestas a amenazas y riesgos ' ? "Vulcanismo" :
                                tensionData.dimensionEspecifica === 'Clasificación y delimitación del territorio' ? "" :
                                tensionData.dimensionEspecifica === 'Infraestructura vial y de transporte y comunicaciones' ? "Terminales" :
                                tensionData.dimensionEspecifica === 'Espacio Público' ? "" :
                                tensionData.dimensionEspecifica === 'Infraestructura de servicios públicos domiciliarios' ? "Otros servicios públicos (Energía, Alumbrado, telefonía fija y móvil, gas, internet)" :
                                tensionData.dimensionEspecifica === 'Patrimonio histórico, cultural y arquitectóncico' ? "" :
                                tensionData.dimensionEspecifica === 'Vivienda de Interes Social' ? "Vivienda de Interes Social" :
                                tensionData.dimensionEspecifica === 'Infraestructuras para desarrollo económico' ? "" :
                                tensionData.dimensionEspecifica === 'Servicios sociales e institucionales e infraestructuras socioculturales para la garantia y prestación de servicios sociales a cargo del Estado. ' ? "Participación social y comunitaria" :
                                tensionData.dimensionEspecifica === 'Localización y áreas para la actividad económica en zonas  urbanas ' ? " " :
                                "Zonas para el desarrollo del turismo"
                            }> 
                                {tensionData.dimensionEspecifica === 'Áreas de reserva ambiental' ? "Zonas de Páramo y subpáramo" :
                                tensionData.dimensionEspecifica === 'Áreas expuestas a amenazas y riesgos ' ? "Vulcanismo" :
                                tensionData.dimensionEspecifica === 'Clasificación y delimitación del territorio' ? "" :
                                tensionData.dimensionEspecifica === 'Infraestructura vial y de transporte y comunicaciones' ? "Terminales" :
                                tensionData.dimensionEspecifica === 'Espacio Público' ? "" :
                                tensionData.dimensionEspecifica === 'Infraestructuras para desarrollo económico' ? "" :
                                tensionData.dimensionEspecifica === 'Infraestructura de servicios públicos domiciliarios' ? "Otros servicios públicos (Energía, Alumbrado, telefonía fija y móvil, gas, internet)" :
                                tensionData.dimensionEspecifica === 'Patrimonio histórico, cultural y arquitectóncico' ? "" :
                                tensionData.dimensionEspecifica === 'Vivienda de Interes Social' ? "Vivienda de Interes Social" :
                                tensionData.dimensionEspecifica === 'Servicios sociales e institucionales e infraestructuras socioculturales para la garantia y prestación de servicios sociales a cargo del Estado. ' ? "Participación social y comunitaria" :
                                tensionData.dimensionEspecifica === 'Localización y áreas para la actividad económica en zonas  urbanas ' ? "Zonas de servicios " :
                                "Zonas para el desarrollo del turismo"}
                            </option>

                            <option value={tensionData.dimensionEspecifica === 'Áreas de reserva ambiental' ? "Áreas de protección de nivel regional" :
                                tensionData.dimensionEspecifica === 'Áreas expuestas a amenazas y riesgos ' ? "Movimientos en masa" :
                                tensionData.dimensionEspecifica === 'Clasificación y delimitación del territorio' ? "" :
                                tensionData.dimensionEspecifica === 'Infraestructura vial y de transporte y comunicaciones' ? "Movilidad fluvial" :
                                tensionData.dimensionEspecifica === 'Espacio Público' ? "" :
                                tensionData.dimensionEspecifica === 'Infraestructura de servicios públicos domiciliarios' ? "" :
                                tensionData.dimensionEspecifica === 'Patrimonio histórico, cultural y arquitectóncico' ? "" :
                                tensionData.dimensionEspecifica === 'Vivienda de Interes Social' ? "Vivienda de Interes Social" :
                                tensionData.dimensionEspecifica === 'Infraestructuras para desarrollo económico' ? "" :
                                tensionData.dimensionEspecifica === 'Servicios sociales e institucionales e infraestructuras socioculturales para la garantia y prestación de servicios sociales a cargo del Estado. ' ? "Servicio de salud" :
                                tensionData.dimensionEspecifica === 'Localización y áreas para la actividad económica en zonas  urbanas ' ?   "Zonas de servicios" :
                                "Zonas de servicios"
                            }> 
                                {tensionData.dimensionEspecifica === 'Áreas de reserva ambiental' ? "Áreas de protección de nivel regional" :
                                tensionData.dimensionEspecifica === 'Áreas expuestas a amenazas y riesgos ' ? "Movimientos en masa" :
                                tensionData.dimensionEspecifica === 'Clasificación y delimitación del territorio' ? "" :
                                tensionData.dimensionEspecifica === 'Infraestructura vial y de transporte y comunicaciones' ? "Movilidad fluvial" :
                                tensionData.dimensionEspecifica === 'Espacio Público' ? "" :
                                tensionData.dimensionEspecifica === 'Infraestructuras para desarrollo económico' ? "" :
                                tensionData.dimensionEspecifica === 'Infraestructura de servicios públicos domiciliarios' ? "" :
                                tensionData.dimensionEspecifica === 'Patrimonio histórico, cultural y arquitectóncico' ? "" :
                                tensionData.dimensionEspecifica === 'Vivienda de Interes Social' ? "Vivienda de Interes Social" :
                                tensionData.dimensionEspecifica === 'Servicios sociales e institucionales e infraestructuras socioculturales para la garantia y prestación de servicios sociales a cargo del Estado. ' ? "Servicio de salud" :
                                tensionData.dimensionEspecifica === 'Localización y áreas para la actividad económica en zonas  urbanas ' ?   "Zonas de servicios" :
                                "Zonas de servicios"}
                            </option>

                            <option value={tensionData.dimensionEspecifica === 'Áreas de reserva ambiental' ? "Áreas de protección del recurso hídrico" :
                                tensionData.dimensionEspecifica === 'Áreas expuestas a amenazas y riesgos ' ? "" :
                                tensionData.dimensionEspecifica === 'Clasificación y delimitación del territorio' ? "" :
                                tensionData.dimensionEspecifica === 'Infraestructura vial y de transporte y comunicaciones' ? "" :
                                tensionData.dimensionEspecifica === 'Espacio Público' ? "" :
                                tensionData.dimensionEspecifica === 'Infraestructura de servicios públicos domiciliarios' ? "" :
                                tensionData.dimensionEspecifica === 'Patrimonio histórico, cultural y arquitectóncico' ? "" :
                                tensionData.dimensionEspecifica === 'Vivienda de Interes Social' ? "Vivienda de Interes Social" :
                                tensionData.dimensionEspecifica === 'Infraestructuras para desarrollo económico' ? "" :
                                tensionData.dimensionEspecifica === 'Servicios sociales e institucionales e infraestructuras socioculturales para la garantia y prestación de servicios sociales a cargo del Estado. ' ? "Servicios de bienestar y protección social " :
                                tensionData.dimensionEspecifica === 'Localización y áreas para la actividad económica en zonas  urbanas ' ? " " :
                                "Zonas de actividad minera"
                            }> 
                                {tensionData.dimensionEspecifica === 'Áreas de reserva ambiental' ? "Áreas de protección del recurso hídrico" :
                                tensionData.dimensionEspecifica === 'Áreas expuestas a amenazas y riesgos ' ? "" :
                                tensionData.dimensionEspecifica === 'Clasificación y delimitación del territorio' ? "" :
                                tensionData.dimensionEspecifica === 'Infraestructura vial y de transporte y comunicaciones' ? "" :
                                tensionData.dimensionEspecifica === 'Espacio Público' ? "" :
                                tensionData.dimensionEspecifica === 'Infraestructuras para desarrollo económico' ? "" :
                                tensionData.dimensionEspecifica === 'Infraestructura de servicios públicos domiciliarios' ? "" :
                                tensionData.dimensionEspecifica === 'Patrimonio histórico, cultural y arquitectóncico' ? "" :
                                tensionData.dimensionEspecifica === 'Vivienda de Interes Social' ? "Vivienda de Interes Social" :
                                tensionData.dimensionEspecifica === 'Servicios sociales e institucionales e infraestructuras socioculturales para la garantia y prestación de servicios sociales a cargo del Estado. ' ? "Servicios de bienestar y protección social " :
                                tensionData.dimensionEspecifica === 'Localización y áreas para la actividad económica en zonas  urbanas ' ? " " :
                                "Zonas de actividad minera"}
                            </option>

                            <option value={
                                tensionData.dimensionEspecifica === 'Servicios sociales e institucionales e infraestructuras socioculturales para la garantia y prestación de servicios sociales a cargo del Estado. ' ? "Otros servicios (cementerios, otros)" :
                                ""}> 
                                {
                                tensionData.dimensionEspecifica === 'Servicios sociales e institucionales e infraestructuras socioculturales para la garantia y prestación de servicios sociales a cargo del Estado. ' ? "Otros servicios (cementerios, otros)" :
                                ""}
                            </option>
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
                    <Grid item sm={12}>
                        <Typography  variant={"h6"} color="primary" display="block" >Evento</Typography>
                    </Grid>
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
                            <InputLabel htmlFor="outlined-ODS-native-simple">ODS</InputLabel>
                            <Select
                            value={tensionData.evento.ods}
                            onChange={(e) => changeEventoOds(e.target.value)}
                            native
                            label="ODS"
                            inputProps={{
                                name: 'ods',
                                id: 'outlined-age-native-simple',
                            }}
                            >
                            {odsLista.map((odsElem) => (
                                <option value={odsElem}>{odsElem}</option>
                            ))}
                            </Select>
                        </FormControl>
                        <FormControl style={{marginTop:10,marginRight:10,maxWidth:370,minWidth:370}} variant="outlined" >
                            <InputLabel htmlFor="evento-meta-native-simple">Meta</InputLabel>
                            <Select
                            value={tensionData.evento.meta}
                            onChange={(e) => changeEventoMeta(e.target.value)}
                            native
                            label="Meta"
                            inputProps={{
                                name: 'meta',
                                id: 'evento-meta-native-simple',
                            }}
                            >
                            {metas.map((metas) => (
                                <option value={metas}>{metas}</option>
                            ))}
                            </Select>
                        </FormControl>
                        </Grid>
                    </Paper>
                    </Grid>
                    <Grid item sm={3}>
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
                    </Grid>
                </Grid>
                </div>
            );
        case 2:
        return(
        <Grid container direction="column" alignItems="flex-start" justify="center" spacing = {1}>
            <Grid style={{marginTop:20}}> 
                <Typography variant={"h5"} color="primary" display="block">
                    Generadores
                </Typography>    
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
                        </Grid>
                    </Grid> 
                </Grid> 
         </Grid>
        );
        case 3:
            return(
                <Grid container direction="column" alignItems="flex-start" justify="center" spacing = {1}>
                <Grid style={{marginTop:20}}>     
                    <Typography variant={"h5"} color="primary" display="block">
                        Implicaciones
                    </Typography>
                    <Grid container direction="row" alignItems="flex-start" justify="center" spacing = {1}>
                        <Grid item sm={9}>
                            {showImplicacionPrincipal()}
                            <Divider style={{marginTop:20,marginBottom:20}}/>
                            <Grid container item direction="row" justify="space-between"> 
                                <Typography  variant={"h6"} style={{margin:10}} color="primary" display="block" >Complementarios</Typography>
                                <Button variant="contained" onClick = {() => addImplicacion()} style={{marginBottom:10}}  color="primary">
                                    Crear Implicacion
                                </Button>
                            </Grid>
                            {tensionData.implicaciones.map((generador, index) => (
                                showImplicacion(generador, index)
                            ))}    
                        </Grid> 
                        <Grid item sm={3}>
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
                            </Grid>
                        </Grid> 
                    </Grid> 
             </Grid>
            );
        case 4:
            return(
                <Grid container direction="column" alignItems="flex-start" justify="center" spacing = {1}>
                <Grid style={{marginTop:20}}>     
                    <Typography variant={"h5"} color="primary" display="block">
                        Reforzadores
                    </Typography>
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
                            {tensionData.reforzadores.map((generador, index) => (
                                showReforzador(generador, index)
                            ))}    
                        </Grid> 
                        <Grid item sm={3}>
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
                            </Grid>
                        </Grid> 
                    </Grid> 
             </Grid>
            );
        case 5:
            return(
                <Grid container direction="column" alignItems="flex-start" justify="center" spacing = {1}>
                <Grid style={{marginTop:20}}>     
                    <Typography variant={"h5"} color="primary" display="block">
                        Liberadores
                    </Typography>
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
                            {tensionData.liberadores.map((generador, index) => (
                                showLiberador(generador, index)
                            ))}    
                        </Grid> 
                        <Grid item sm={3}>
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
                            </Grid>
                        </Grid> 
                    </Grid> 
             </Grid>
            );
        case 6:
            return(
                <Grid container direction="column" alignItems="center" justify="center" spacing = {1}>
                    
                    <Grid item container sm={7} direction="row" alignItems="center" justify="center">
                        <Grid item container sm={7} direction="row" alignItems="center" justify="center">
                            <Grid  sm={12} style={{marginTop:20}}>     
                                <Typography variant={"h5"} color="primary" display="block">
                                    Valoración de las tensiones
                                </Typography>
                            </Grid>
                            <Grid item sm={6}>
                                <Typography component="legend">Cronicidad</Typography>
                                <Rating
                                name="customized-color"
                                precision={0.5}
                                value = {tensionData.valoracionTensiones.cronicidad}
                                onChange = {(val) => updateCronicidad(val)}
                                iconFilled={<FiberManualRecordIcon fontSize="inherit" />}
                                iconHovered={<FiberManualRecordTwoToneIcon fontSize="inherit" />}
                                iconNormal={<FiberManualRecordOutlinedIcon fontSize="inherit" />}
                                />
                            </Grid>
                            <Grid item sm={6}>
                                <Typography component="legend">Impacto</Typography>
                                <Rating
                                name="customized-color"
                                precision={0.5}
                                value = {tensionData.valoracionTensiones.impacto}
                                onChange = {(val) => updateImpacto(val)}
                                iconFilled={<FiberManualRecordIcon fontSize="inherit" />}
                                iconHovered={<FiberManualRecordTwoToneIcon fontSize="inherit" />}
                                iconNormal={<FiberManualRecordOutlinedIcon fontSize="inherit" />}
                                />
                            </Grid>
                            <Grid item sm={6}>
                                <Typography component="legend">Ingobernabilidad</Typography>
                                <Rating
                                name="customized-color"
                                precision={0.5}
                                value = {tensionData.valoracionTensiones.ingobernabilidad}
                                onChange = {(val) => updateIngobernabilidad(val)}
                                iconFilled={<FiberManualRecordIcon fontSize="inherit" />}
                                iconHovered={<FiberManualRecordTwoToneIcon fontSize="inherit" />}
                                iconNormal={<FiberManualRecordOutlinedIcon fontSize="inherit" />}
                                />
                            </Grid>
                            <Grid item sm={6}>
                                <Typography component="legend">Intensidad</Typography>
                                <Rating
                                name="customized-color"
                                precision={0.5}
                                value = {tensionData.valoracionTensiones.intensidad}
                                onChange = {(val) => updateIntensidad(val)}
                                iconFilled={<FiberManualRecordIcon fontSize="inherit" />}
                                iconHovered={<FiberManualRecordTwoToneIcon fontSize="inherit" />}
                                iconNormal={<FiberManualRecordOutlinedIcon fontSize="inherit" />}
                                />
                            </Grid>
                        </Grid>
                        <Grid item sm={5}>
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
                        </Grid>
                    </Grid>
                </Grid>
            );

        default:
            return 'Unknown step';
        }
      }

    const tension = useSelector((state) => (currentId ? state.tensiones.find((message) => message._id === currentId) : null));

    useEffect(() => {
        if (tension) setTensionData(tension);
    }, [tension]);

    const clear = () => {
    setActiveStep(0)
    setCurrentId(0);
    setTensionData({dimension: '',
        dimensionEspecifica: '',
        competencia: '',
        evento:{
            quepasa: '',
            cuanto: '',
            donde: '',
            hacecuanto: '',
            ods: '',
            meta: '',
        },
        generadorPrincipal:{situacion: '', actores: '', odsPrincipal:'', metaPrincipal: '',  dimensiones:[]} as Generador,
        generadores:[{situacion: '', actores: '', odsPrincipal:'', metaPrincipal: '',  dimensiones:[]}] as Generador[],
        implicaciones:[{efectos: '', odsPrincipal: '', metaPrincipal: '',  dimensiones:[]}] as Implicacion[],
        implicacionPrincipal:{efectos: '', odsPrincipal: '', metaPrincipal: '',  dimensiones:[]} as Implicacion,
        reforzadores:[{situacion: '', odsPrincipal:'', metaPrincipal: '',  dimensiones:[]}] as Reforzador[],
        reforzadorPrincipal:{situacion: '', odsPrincipal:'', metaPrincipal: '',  dimensiones:[]} as Reforzador,
        liberadores:[{situacion: '', odsPrincipal:'', metaPrincipal: '',  dimensiones:[]}] as Liberador[],
        liberadorPrincipal:{situacion: '', odsPrincipal:'', metaPrincipal: '',  dimensiones:[]} as Liberador,
        valoracionTensiones: {intensidad: 0, impacto: 0, cronicidad: 0, ingobernabilidad: 0} as ValoracionTensiones
    });
    };
    const handleSubmit = async (e) => {
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
    const handleCompetenciaChange = (e) => {
        setTensionData({ ...tensionData, competencia: e.target.value });
    };
    const handleDimensionChange = (e) => {
        setTensionData({ ...tensionData, dimension: e.target.value });
    };
    const handleDimensionEspecificaChange = (e) => {
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
    const odsLista = [
        '',
        'Fin de la pobreza',
        'Hambre cero',
        'Salud y bienestar',
        'Educación de calidad',
        'Igualdad de género',
        'Agua limpia y saneamiento',
        'Energia asequible y no contaminante',
        'Trabajo decente y crecimiento economico',
        'Industria, innovacion e infraestructura',
        'Reducción de las desigualdades',
        'Ciudades y comunidades sostenibles',
        'Produccion y consumo responsable',
        'Accion por el clima',
        'Vida Submarina',
        'Vida de ecosistemas terrestres',
        'Paz, justicia e instituciones solidas',
        'Alianzas para lograr los objetivos',
    ];
    const dimensionesLista = [
        '',
        "Poblacional",
        "Ambiente Natural",
        "Ambiente Construido",
        "Social",
        "Politico Institucional",
        "Económica",
    ];
    const metas = [
        '',
        '1.1',
        '1.2',
        '1.3',
        '1.4',
        '1.5',
        '2.1',
        '2.2',
        '2.3',
        '2.4',
        '2.5',
        '3.1',
        '3.2',
        '3.3',
        '3.4',
        '3.5',
        '3.6',
        '3.7',
        '3.8',
        '3.9',
        '4.1',
        '4.2',
        '4.3',
        '4.4',
        '4.5',
        '4.6',
        '4.7',
        '5.1',
        '5.2',
        '5.3',
        '5.4',
        '5.5',
        '5.6',
    ];
    const addGenerador = () => {
        setTensionData(tensionData => {
          const generadorLista: Generador[] = [...tensionData.generadores];
          generadorLista.push({situacion: '', actores: '', odsPrincipal:'', metaPrincipal: '',  dimensiones:[]});
          return {...tensionData, generadores: generadorLista }
        });
    };
    const addLiberador = () => {
        setTensionData(tensionData => {
          const liberadoresLista: Liberador[] = [...tensionData.liberadores];
          liberadoresLista.push({situacion: '', odsPrincipal:'', metaPrincipal: '',  dimensiones:[]});
          return {...tensionData, liberadores: liberadoresLista }
        });
    };
    const addReforzador = () => {
        setTensionData(tensionData => {
          const reforzadorLista: Reforzador[] = [...tensionData.reforzadores];
          reforzadorLista.push({situacion: '', odsPrincipal:'', metaPrincipal: '',  dimensiones:[]});
          return {...tensionData, reforzadores: reforzadorLista }
        });
    };
    const addImplicacion = () => {
        setTensionData(tensionData => {
          const implicacionesLista: Implicacion[] = [...tensionData.implicaciones];
          implicacionesLista.push({efectos: '', odsPrincipal: '', metaPrincipal: '',  dimensiones:[]});
          return {...tensionData, implicaciones: implicacionesLista }
        });
    };
    
    const updateImpacto = (value) => {
        var valoracionChange = {...tensionData.valoracionTensiones}
        valoracionChange.impacto = value;
        setTensionData({ ...tensionData, valoracionTensiones: valoracionChange });
    };

    const updateIntensidad = (value) => {
        var valoracionChange = {...tensionData.valoracionTensiones}
        valoracionChange.intensidad = value;
        setTensionData({ ...tensionData, valoracionTensiones: valoracionChange });
    };
    
    const updateCronicidad = (value) => {
        var valoracionChange = {...tensionData.valoracionTensiones}
        valoracionChange.cronicidad = value;
        setTensionData({ ...tensionData, valoracionTensiones: valoracionChange });
    };

    const updateIngobernabilidad = (value) => {
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
    const changeEventoOds = (value) => {
        var eventoChange = {...tensionData.evento}
        eventoChange.ods = value;
        setTensionData({ ...tensionData, evento: eventoChange });
    };
    const changeEventoMeta = (value) => {
        var eventoChange = {...tensionData.evento}
        eventoChange.meta = value;
        setTensionData({ ...tensionData, evento: eventoChange });
    };
    const changeEventoCuanto = (value) => {
        var eventoChange = {...tensionData.evento}
        eventoChange.cuanto = value;
        setTensionData({ ...tensionData, evento: eventoChange });
    };
    const changeEventoDonde = (value) => {
        var eventoChange = {...tensionData.evento}
        eventoChange.donde = value;
        setTensionData({ ...tensionData, evento: eventoChange });
    };
    const changeEventoQuePasa = (value) => {
        var eventoChange = {...tensionData.evento}
        eventoChange.quepasa = value;
        setTensionData({ ...tensionData, evento: eventoChange });
    };
    const changeEventoHaceCuanto = (value) => {
        var eventoChange = {...tensionData.evento}
        eventoChange.hacecuanto = value;
        setTensionData({ ...tensionData, evento: eventoChange });
    };   
    const changeGeneradorPrincipalSituacion = (value) => {
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
      const changeGeneradorPrincipalActores = (value) => {
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
    const changeGeneradorPrincipalODS1= (value) => {
        var generadorNuevo = {...tensionData.generadorPrincipal}
        generadorNuevo.odsPrincipal = value;
        setTensionData({ ...tensionData, generadorPrincipal: generadorNuevo });
    };
    const changeGeneradorODS1= (value, index: number) => {
        setTensionData(tensionData => {
            const generador: Generador[] = [...tensionData.generadores];
            generador[index].odsPrincipal = value;
            return { ...tensionData, generadores: generador };
        });
    };
    const changeGeneradorPrincipalMeta1 = (value) => {
        var generadorNuevo = {...tensionData.generadorPrincipal}
        generadorNuevo.metaPrincipal = value;
        setTensionData({ ...tensionData, generadorPrincipal: generadorNuevo });
    };
    const changeGeneradorMeta1= (value, index: number) => {
        setTensionData(tensionData => {
          const generador: Generador[] = [...tensionData.generadores];
          generador[index].metaPrincipal = value;
          return { ...tensionData, generadores: generador };
        });   
      };
    
    const changeGeneradorPrincipalDimension= (value) => {
        var generadorNuevo = {...tensionData.generadorPrincipal}
        generadorNuevo.dimensiones = value;
        setTensionData({ ...tensionData, generadorPrincipal: generadorNuevo });
    };
    const changeGeneradorDimensiones= (value, index: number) => {
        setTensionData(tensionData => {
            const generadorLista: Generador[] = [...tensionData.generadores];
            generadorLista[index].dimensiones = value;
            return { ...tensionData, generadores: generadorLista };
        });
    };
    const changeImplicacionDimension= (value, index: number) => {
        setTensionData(tensionData => {
          const implicacion: Implicacion[] = [...tensionData.implicaciones];
          implicacion[index].dimensiones = value;
          return { ...tensionData, implicaciones: implicacion };
        });
      };
    const changeImplicacionPrincipalDimension = (value) => {
        var implicacionNuevo = {...tensionData.implicacionPrincipal}
        implicacionNuevo.dimensiones = value;
        setTensionData({ ...tensionData, implicacionPrincipal: implicacionNuevo });
    };
    const changeImplicacionPrincipalMeta1 = (value) => {
        var implicacionNuevo = {...tensionData.implicacionPrincipal}
        implicacionNuevo.metaPrincipal = value;
        setTensionData({ ...tensionData, implicacionPrincipal: implicacionNuevo });
    };
    const changeImplicacionPrincipalODS1 = (value) => {
        var implicacionNuevo = {...tensionData.implicacionPrincipal}
        implicacionNuevo.odsPrincipal = value;
        setTensionData({ ...tensionData, implicacionPrincipal: implicacionNuevo });
    };
    
   
    const changeImplicacionPrincipalEfectos = (value) => {
        var implicacionNuevo = {...tensionData.implicacionPrincipal}
        implicacionNuevo.efectos = value;
        setTensionData({ ...tensionData, implicacionPrincipal: implicacionNuevo });
    };
    const changeImplicacionEfectos = (value, index: number) => {
        setTensionData(tensionData => {
            const generador: Implicacion[] = [...tensionData.implicaciones];
            generador[index].efectos = value;
            return { ...tensionData, implicaciones: generador };
        });
    };
    const changeImplicacionOdsPrincipal = (value, index: number) => {
        setTensionData(tensionData => {
            const generador: Implicacion[] = [...tensionData.implicaciones];
            generador[index].odsPrincipal = value;
            return { ...tensionData, implicaciones: generador };
        });
    };
    const changeImplicacionMetaPrincipal = (value, index: number) => {
        setTensionData(tensionData => {
          const implicacion: Implicacion[] = [...tensionData.implicaciones];
          implicacion[index].metaPrincipal = value;
          return { ...tensionData, implicaciones: implicacion };
        });
      };
   
    
    
    const changeLiberadorPrincipalMeta1 = (value) => {
        var liberadorNuevo = {...tensionData.liberadorPrincipal}
        liberadorNuevo.metaPrincipal = value;
        setTensionData({ ...tensionData, liberadorPrincipal: liberadorNuevo });
    };
    const changeLiberadorPrincipalOds1 = (value) => {
        var liberadorNuevo = {...tensionData.liberadorPrincipal}
        liberadorNuevo.odsPrincipal = value;
        setTensionData({ ...tensionData, liberadorPrincipal: liberadorNuevo });
    };
    
    const changeLiberadorPrincipalSituacion= (value) => {
        var liberadorNuevo = {...tensionData.liberadorPrincipal}
        liberadorNuevo.situacion = value;
        setTensionData({ ...tensionData, liberadorPrincipal: liberadorNuevo });
    };
    const changeLiberadorPrincipalDimension = (value) => {
        var liberadorNuevo = {...tensionData.liberadorPrincipal}
        liberadorNuevo.dimensiones = value;
        setTensionData({ ...tensionData, liberadorPrincipal: liberadorNuevo });
    };
    const changeLiberadorSituacion = (value, index: number) => {
        setTensionData(tensionData => {
          const liberador: Liberador[] = [...tensionData.liberadores];
          liberador[index].situacion = value;
          return { ...tensionData, liberadores: liberador };
        });
      };
      const changeLiberadorDimension= (value, index: number) => {
        setTensionData(tensionData => {
          const liberador: Liberador[] = [...tensionData.liberadores];
          liberador[index].dimensiones = value;
          return { ...tensionData, liberadores: liberador };
        });
      };
    const changeLiberadorOdsPrincipal= (value, index: number) => {
        setTensionData(tensionData => {
          const liberador: Liberador[] = [...tensionData.liberadores];
          liberador[index].odsPrincipal = value;
          return { ...tensionData, liberadores: liberador };
        });
      };
    
    const changeLiberadorMetaPrincipal= (value, index: number) => {
        setTensionData(tensionData => {
            const liberador: Liberador[] = [...tensionData.liberadores];
            liberador[index].metaPrincipal = value;
            return { ...tensionData, liberadores: liberador };
        });
    };
    
    
    const changeReforzadorSituacion = (value, index: number) => {
        setTensionData(tensionData => {
            const reforzador: Reforzador[] = [...tensionData.reforzadores];
            reforzador[index].situacion = value;
            return { ...tensionData, reforzadores: reforzador };
        });
    };
    const changeReforzadorDimension = (value, index: number) => {
        setTensionData(tensionData => {
            const reforzador: Reforzador[] = [...tensionData.reforzadores];
            reforzador[index].dimensiones = value;
            return { ...tensionData, reforzadores: reforzador };
        });
    };
    const changeReforzadorOdsPrincipal = (value, index: number) => {
        setTensionData(tensionData => {
          const reforzador: Reforzador[] = [...tensionData.reforzadores];
          reforzador[index].odsPrincipal = value;
          return { ...tensionData, reforzadores: reforzador };
        });
      };
    const changeReforzadorMetaPrincipal= (value, index: number) => {
        setTensionData(tensionData => {
          const reforzador: Reforzador[] = [...tensionData.reforzadores];
          reforzador[index].metaPrincipal = value;
          return { ...tensionData, reforzadores: reforzador };
        });
      };
    
    const changeReforzadorPrincipalOds1 = (value) => {
        var generadorNuevo = {...tensionData.reforzadorPrincipal}
        generadorNuevo.odsPrincipal = value;
        setTensionData({ ...tensionData, reforzadorPrincipal: generadorNuevo });
    };
    const changeReforzadorPrincipalMeta1 = (value) => {
        var generadorNuevo = {...tensionData.reforzadorPrincipal}
        generadorNuevo.metaPrincipal = value;
        setTensionData({ ...tensionData, reforzadorPrincipal: generadorNuevo });
    };
    
    const changeReforzadorPrincipalSituacion = (value) => {
        var generadorNuevo = {...tensionData.reforzadorPrincipal}
        generadorNuevo.situacion = value;
        setTensionData({ ...tensionData, reforzadorPrincipal: generadorNuevo });
    };
    const changeReforzadorPrincipalDimension = (value) => {
        var generadorNuevo = {...tensionData.reforzadorPrincipal}
        generadorNuevo.dimensiones = value;
        setTensionData({ ...tensionData, reforzadorPrincipal: generadorNuevo });
    };
    const showGenerador = (generador: Generador, index: number) => {
        return (
            <div>
                <Paper style={{padding:15, margin:5, backgroundColor : "#EAE3D6"}}>
                    <TextField size = "small" value = {generador.situacion} style={{margin:5}} fullWidth id="situacionGenerador" label="Situción" onChange={(e) => changeGeneradorSituacion(e.target.value, index)} />
                    <TextField size = "small" value = {generador.actores} style={{margin:5}} fullWidth id="actoresGenerador" label="Actores/Agentes" onChange={(e) => changeGeneradorActores(e.target.value, index)} />
                    <FormControl style={{maxWidth:200,minWidth:200,margin:5}}  size = "small"  >
                        <InputLabel htmlFor="outlined-ODS-native-simple">ODS Principal</InputLabel>
                        <Select
                        value={generador.odsPrincipal}
                        onChange={(e) => changeGeneradorODS1(e.target.value, index)} 
                        native
                        label="ODS"
                        inputProps={{
                            name: 'ods',
                            id: 'generador-age-native-simple',
                        }}
                        >
                        {odsLista.map((odsElem) => (
                            <option value={odsElem}>{odsElem}</option>
                        ))}
                        </Select>
                    </FormControl>
                    <FormControl style={{maxWidth:160,minWidth:160,margin:5}}  size = "small"  >
                        <InputLabel htmlFor="outlined-meta-native-simple">Meta Principal</InputLabel>
                        <Select
                        value={generador.metaPrincipal}
                        onChange={(e) => changeGeneradorMeta1(e.target.value, index)} 
                        native
                        label="ODS"
                        inputProps={{
                            name: 'ods',
                            id: 'generador-age-native-simple',
                        }}
                        >
                        {metas.map((metas) => (
                            <option value={metas}>{metas}</option>
                        ))}
                        </Select>
                    </FormControl>
                    
                    <FormControl size = "small" style={{maxWidth:150,minWidth:150,margin:5}}  >
                        <InputLabel id="mutiple-generador-label">Dimensiones</InputLabel>
                        <Select
                        labelId="demo-mutiple-chip-label"
                        id="demo-mutiple-chip"
                        multiple
                        value={generador.dimensiones}
                        onChange={(e) => changeGeneradorDimensiones(e.target.value, index)} 
                        input={<Input id="select-multiple-chip-Generador" />}
                        renderValue={(selected:any) => (
                            <div>
                            {selected.map((value) => (
                                <Chip key={value} label={value} />
                            ))}
                            </div>
                        )}
                        MenuProps={MenuProps}
                        >
                            {dimensionesLista.map((name) => (
                            <MenuItem key={name} value={name}>
                            {name}
                            </MenuItem>
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
                    <TextField size = "small" value = {tensionData.generadorPrincipal.situacion} style={{margin:5}} fullWidth id="situacionGenerador" label="Situción" onChange={(e) => changeGeneradorPrincipalSituacion(e.target.value)} />
                    <TextField size = "small" value = {tensionData.generadorPrincipal.actores} style={{margin:5}} fullWidth id="actoresGenerador" label="Actores/Agentes" onChange={(e) => changeGeneradorPrincipalActores(e.target.value)} />
                    <FormControl style={{maxWidth:200,minWidth:200,margin:5}}  size = "small"  >
                        <InputLabel htmlFor="outlined-ODS-native-simple">ODS Principal</InputLabel>
                        <Select
                        value={tensionData.generadorPrincipal.odsPrincipal}
                        onChange={(e) => changeGeneradorPrincipalODS1(e.target.value)} 
                        native
                        label="ODS Principal"
                        inputProps={{
                            name: 'ods',
                            id: 'generador-age-native-simple',
                        }}
                        >
                        {odsLista.map((odsElem) => (
                            <option value={odsElem}>{odsElem}</option>
                        ))}
                        </Select>
                    </FormControl>
                    <FormControl style={{maxWidth:160,minWidth:160,margin:5}}  size = "small"  >
                        <InputLabel htmlFor="outlined-meta-native-simple">Meta Principal</InputLabel>
                        <Select
                        value={tensionData.generadorPrincipal.metaPrincipal}
                        onChange={(e) => changeGeneradorPrincipalMeta1(e.target.value)} 
                        native
                        label="Meta Principal"
                        inputProps={{
                            name: 'ods',
                            id: 'generador-age-native-simple',
                        }}
                        >
                        {metas.map((metas) => (
                            <option value={metas}>{metas}</option>
                        ))}
                        </Select>
                    </FormControl>
                    
                    <FormControl size = "small" style={{maxWidth:150,minWidth:150,margin:5}}  >
                        <InputLabel id="mutiple-generador-label">Dimensiones</InputLabel>
                        <Select
                        labelId="demo-mutiple-chip-label"
                        id="demo-mutiple-chip"
                        multiple
                        value={tensionData.generadorPrincipal.dimensiones}
                        onChange={(e) => changeGeneradorPrincipalDimension(e.target.value)} 
                        input={<Input id="select-multiple-chip-Generador" />}
                        renderValue={(selected:any) => (
                            <div>
                            {selected.map((value) => (
                                <Chip key={value} label={value} />
                            ))}
                            </div>
                        )}
                        MenuProps={MenuProps}
                        >
                            {dimensionesLista.map((name) => (
                            <MenuItem key={name} value={name}>
                            {name}
                            </MenuItem>
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
                <Paper style={{padding:15, margin:5,backgroundColor : "#EAE3D6"}}>
                    <TextField size = "small" value = {implicacion.efectos} style={{margin:5}} fullWidth id="efectoImplicacion" label="Efecto" onChange={(e) => changeImplicacionEfectos(e.target.value, index)} />
                    <FormControl style={{maxWidth:200,minWidth:200,margin:5}}  size = "small"  >
                        <InputLabel htmlFor="outlined-ODS-native-simple">ODS Principal</InputLabel>
                        <Select
                        value={implicacion.odsPrincipal}
                        onChange={(e) => changeImplicacionOdsPrincipal(e.target.value, index)} 
                        native
                        label="ODS Principal"
                        inputProps={{
                            name: 'ods',
                            id: 'generador-age-native-simple',
                        }}
                        >
                        {odsLista.map((odsElem) => (
                            <option value={odsElem}>{odsElem}</option>
                        ))}
                        </Select>
                    </FormControl>
                    <FormControl style={{maxWidth:160,minWidth:160,margin:5}}  size = "small"  >
                        <InputLabel htmlFor="outlined-meta-native-simple">Meta Principal</InputLabel>
                        <Select
                        value={implicacion.metaPrincipal}
                        onChange={(e) => changeImplicacionMetaPrincipal(e.target.value, index)} 
                        native
                        label="ODS Complementario"
                        inputProps={{
                            name: 'meta',
                            id: 'generador-age-native-simple',
                        }}
                        >
                        {metas.map((metas) => (
                            <option value={metas}>{metas}</option>
                        ))}
                        </Select>
                    </FormControl>
                   
                    <FormControl size = "small" style={{maxWidth:160,minWidth:160,margin:5}}  >
                        <InputLabel id="mutiple-generador-label">Dimensiones</InputLabel>
                        <Select
                        labelId="demo-mutiple-chip-label"
                        id="demo-mutiple-chip"
                        multiple
                        value={implicacion.dimensiones}
                        onChange={(e) => changeImplicacionDimension(e.target.value, index)} 
                        input={<Input id="select-multiple-chip-Generador" />}
                        renderValue={(selected:any) => (
                            <div>
                            {selected.map((value) => (
                                <Chip key={value} label={value} />
                            ))}
                            </div>
                        )}
                        MenuProps={MenuProps}
                        >
                        {dimensionesLista.map((name) => (
                            <MenuItem key={name} value={name}>
                            {name}
                            </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <IconButton edge="end" aria-label="deleteGenerador" onClick={() => deleteImplicacion(index)} >
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
                    <FormControl style={{maxWidth:200,minWidth:200,margin:5}}  size = "small"  >
                        <InputLabel htmlFor="outlined-ODS-native-simple">ODS Principal</InputLabel>
                        <Select
                        value={tensionData.implicacionPrincipal.odsPrincipal}
                        onChange={(e) => changeImplicacionPrincipalODS1(e.target.value)} 
                        native
                        label="ODS"
                        inputProps={{
                            name: 'ods',
                            id: 'generador-age-native-simple',
                        }}
                        >
                        {odsLista.map((odsElem) => (
                            <option value={odsElem}>{odsElem}</option>
                        ))}
                        </Select>
                    </FormControl>
                    <FormControl style={{maxWidth:160,minWidth:160,margin:5}}  size = "small"  >
                        <InputLabel htmlFor="outlined-meta-native-simple">Meta Principal</InputLabel>
                        <Select
                        value={tensionData.implicacionPrincipal.metaPrincipal}
                        onChange={(e) => changeImplicacionPrincipalMeta1(e.target.value)} 
                        native
                        label="Meta Principal"
                        inputProps={{
                            name: 'metaPrincipal',
                            id: 'generador-age-native-simple',
                        }}
                        >
                        {metas.map((metas) => (
                            <option value={metas}>{metas}</option>
                        ))}
                        </Select>
                    </FormControl>
                    
                    <FormControl size = "small" style={{maxWidth:200,minWidth:200,margin:5}}  >
                        <InputLabel id="mutiple-generador-label">Dimensiones</InputLabel>
                        <Select
                        labelId="demo-mutiple-chip-label"
                        id="demo-mutiple-chip"
                        multiple
                        value={tensionData.implicacionPrincipal.dimensiones}
                        onChange={(e) => changeImplicacionPrincipalDimension(e.target.value)} 
                        input={<Input id="select-multiple-chip-Generador" />}
                        renderValue={(selected:any) => (
                            <div>
                            {selected.map((value) => (
                                <Chip key={value} label={value} />
                            ))}
                            </div>
                        )}
                        MenuProps={MenuProps}
                        >
                        {dimensionesLista.map((name) => (
                            <MenuItem key={name} value={name}>
                            {name}
                            </MenuItem>
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
                <Paper style={{padding:15, margin:5,backgroundColor : "#EAE3D6"}}>
                    <TextField size = "small" value = {liberador.situacion} style={{margin:5}} fullWidth id="situacionLiberador" label="Situación" onChange={(e) => changeLiberadorSituacion(e.target.value, index)} />
                    <FormControl style={{maxWidth:200,minWidth:200,margin:5}}  size = "small"  >
                        <InputLabel htmlFor="outlined-ODS-native-simple">ODS Principal</InputLabel>
                        <Select
                        value={liberador.odsPrincipal}
                        onChange={(e) => changeLiberadorOdsPrincipal(e.target.value, index)} 
                        native
                        label="ODS Principal"
                        inputProps={{
                            name: 'ods',
                            id: 'generador-age-native-simple',
                        }}
                        >
                        {odsLista.map((odsElem) => (
                            <option value={odsElem}>{odsElem}</option>
                        ))}
                        </Select>
                    </FormControl>
                    <FormControl style={{maxWidth:200,minWidth:200,margin:5}}  size = "small"  >
                        <InputLabel htmlFor="outlined-meta-native-simple">Meta Principal</InputLabel>
                        <Select
                        value={liberador.metaPrincipal}
                        onChange={(e) => changeLiberadorMetaPrincipal(e.target.value, index)} 
                        native
                        label="Meta Principal"
                        inputProps={{
                            name: 'meta',
                            id: 'generador-age-native-simple',
                        }}
                        >
                        {metas.map((metas) => (
                            <option value={metas}>{metas}</option>
                        ))}
                        </Select>
                    </FormControl>
                    
                    <FormControl size = "small" style={{maxWidth:150,minWidth:150,margin:5}}  >
                        <InputLabel id="mutiple-generador-label">Dimensiones</InputLabel>
                        <Select
                        labelId="demo-mutiple-chip-label"
                        id="demo-mutiple-chip"
                        multiple
                        value={liberador.dimensiones}
                        onChange={(e) => changeLiberadorDimension(e.target.value, index)} 
                        input={<Input id="select-multiple-chip-Generador" />}
                        renderValue={(selected:any) => (
                            <div>
                            {selected.map((value) => (
                                <Chip key={value} label={value} />
                            ))}
                            </div>
                        )}
                        MenuProps={MenuProps}
                        >
                        {dimensionesLista.map((name) => (
                            <MenuItem key={name} value={name}>
                            {name}
                            </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <IconButton edge="end" aria-label="deleteGenerador" onClick={() => deleteLiberador(index)} >
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
                    <FormControl style={{maxWidth:200,minWidth:200,margin:5}}  size = "small"  >
                        <InputLabel htmlFor="outlined-ODS-native-simple">ODS Principal</InputLabel>
                        <Select
                        value={tensionData.liberadorPrincipal.odsPrincipal}
                        onChange={(e) => changeLiberadorPrincipalOds1(e.target.value)} 
                        native
                        label="ODS Principal"
                        inputProps={{
                            name: 'ods',
                            id: 'generador-age-native-simple',
                        }}
                        >
                        {odsLista.map((odsElem) => (
                            <option value={odsElem}>{odsElem}</option>
                        ))}
                        </Select>
                    </FormControl>
                    <FormControl style={{maxWidth:150,minWidth:150,margin:5}}  size = "small"  >
                        <InputLabel htmlFor="outlined-meta-native-simple">Meta Principal</InputLabel>
                        <Select
                        value={tensionData.liberadorPrincipal.metaPrincipal}
                        onChange={(e) => changeLiberadorPrincipalMeta1(e.target.value)} 
                        native
                        label="Meta Principal"
                        inputProps={{
                            name: 'meta',
                            id: 'generador-age-native-simple',
                        }}
                        >
                        {metas.map((metas) => (
                            <option value={metas}>{metas}</option>
                        ))}
                        </Select>
                    </FormControl>
                    
                    <FormControl size = "small" style={{maxWidth:150,minWidth:150,margin:5}}  >
                        <InputLabel id="mutiple-generador-label">Dimensiones</InputLabel>
                        <Select
                        labelId="demo-mutiple-chip-label"
                        id="demo-mutiple-chip"
                        multiple
                        value={tensionData.liberadorPrincipal.dimensiones}
                        onChange={(e) => changeLiberadorPrincipalDimension(e.target.value)} 
                        input={<Input id="select-multiple-chip-Generador" />}
                        renderValue={(selected:any) => (
                            <div>
                            {selected.map((value) => (
                                <Chip key={value} label={value} />
                            ))}
                            </div>
                        )}
                        MenuProps={MenuProps}
                        >
                        {dimensionesLista.map((name) => (
                            <MenuItem key={name} value={name}>
                            {name}
                            </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Paper>
            </div>
        );
    }
    const showReforzador = (reforzador: Reforzador, index: number) => {
        return (
            <div>
                <Paper style={{padding:15, margin:5,backgroundColor : "#EAE3D6"}}>
                    <TextField size = "small" value = {reforzador.situacion} fullWidth style={{margin:5}} id="situacionreforzador" label="Situación" onChange={(e) => changeReforzadorSituacion(e.target.value, index)} />
                    <FormControl style={{maxWidth:200,minWidth:200,margin:5}}  size = "small"  >
                        <InputLabel htmlFor="outlined-ODS-native-simple">ODS Principal</InputLabel>
                        <Select
                        value={reforzador.odsPrincipal}
                        onChange={(e) => changeReforzadorOdsPrincipal(e.target.value, index)} 
                        native
                        label="ODS Principal"
                        inputProps={{
                            name: 'ods',
                            id: 'generador-age-native-simple',
                        }}
                        >
                        {odsLista.map((odsElem) => (
                            <option value={odsElem}>{odsElem}</option>
                        ))}
                        </Select>
                    </FormControl>
                    <FormControl style={{maxWidth:150,minWidth:150,margin:5}}  size = "small"  >
                        <InputLabel htmlFor="outlined-meta-native-simple">Meta Principal</InputLabel>
                        <Select
                        value={reforzador.metaPrincipal}
                        onChange={(e) => changeReforzadorMetaPrincipal(e.target.value, index)} 
                        native
                        label="Meta Principal"
                        inputProps={{
                            name: 'meta',
                            id: 'generador-age-native-simple',
                        }}
                        >
                        {metas.map((metas) => (
                            <option value={metas}>{metas}</option>
                        ))}
                        </Select>
                    </FormControl>
                    
                    <FormControl size = "small" style={{maxWidth:100,minWidth:100,margin:5}}  >
                        <InputLabel id="mutiple-generador-label">Dimensiones</InputLabel>
                        <Select
                        labelId="demo-mutiple-chip-label"
                        id="demo-mutiple-chip"
                        multiple
                        value={reforzador.dimensiones}
                        onChange={(e) => changeReforzadorDimension(e.target.value, index)} 
                        input={<Input id="select-multiple-chip-Generador" />}
                        renderValue={(selected:any) => (
                            <div>
                            {selected.map((value) => (
                                <Chip key={value} label={value} />
                            ))}
                            </div>
                        )}
                        MenuProps={MenuProps}
                        >
                        {dimensionesLista.map((name) => (
                            <MenuItem key={name} value={name}>
                            {name}
                            </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <IconButton edge="end" aria-label="deleteGenerador" onClick={() => deleteReforzador(index)} >
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
                    <FormControl style={{maxWidth:200,minWidth:200,margin:5}}  size = "small"  >
                        <InputLabel htmlFor="outlined-ODS-native-simple">ODS Principal</InputLabel>
                        <Select
                        value={tensionData.reforzadorPrincipal.odsPrincipal}
                        onChange={(e) => changeReforzadorPrincipalOds1(e.target.value)} 
                        native
                        label="ODS Principal"
                        inputProps={{
                            name: 'ods',
                            id: 'generador-age-native-simple',
                        }}
                        >
                        {odsLista.map((odsElem) => (
                            <option value={odsElem}>{odsElem}</option>
                        ))}
                        </Select>
                    </FormControl>
                    <FormControl style={{maxWidth:200,minWidth:200,margin:5}}  size = "small"  >
                        <InputLabel htmlFor="outlined-meta-native-simple">Meta Principal</InputLabel>
                        <Select
                        value={tensionData.reforzadorPrincipal.metaPrincipal}
                        onChange={(e) => changeReforzadorPrincipalMeta1(e.target.value)} 
                        native
                        label="Meta Principal"
                        inputProps={{
                            name: 'meta',
                            id: 'generador-age-native-simple',
                        }}
                        >
                        {metas.map((metas) => (
                            <option value={metas}>{metas}</option>
                        ))}
                        </Select>
                    </FormControl>
                    
                    <FormControl size = "small" style={{maxWidth:100,minWidth:100,margin:5}}  >
                        <InputLabel id="mutiple-generador-label">Dimensiones</InputLabel>
                        <Select
                        labelId="demo-mutiple-chip-label"
                        id="demo-mutiple-chip"
                        multiple
                        value={tensionData.reforzadorPrincipal.dimensiones}
                        onChange={(e) => changeReforzadorPrincipalDimension(e.target.value)} 
                        input={<Input id="select-multiple-chip-Generador" />}
                        renderValue={(selected:any) => (
                            <div>
                            {selected.map((value) => (
                                <Chip key={value} label={value} />
                            ))}
                            </div>
                        )}
                        MenuProps={MenuProps}
                        >
                        {dimensionesLista.map((name) => (
                            <MenuItem key={name} value={name}>
                            {name}
                            </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Paper>
            </div>
        );
    }
    return (
        <div style={{ backgroundColor: "#F0EDE7", minHeight: "100vh" ,  overflowX: 'hidden', overflowY: 'hidden'}}>
            <div style={{ marginTop: 120, marginLeft: 30, marginRight: 50}}>
                <form onSubmit={handleSubmit}>
                    <Grid container direction="row" alignItems="center" justify="center" spacing = {1}>
                        <Grid container item sm={12} direction="row" justify="space-between"> 
                                <Grid item >
                                    <Typography  variant={"h5"} color="primary" display="block" >Crear tensión</Typography>
                                </Grid>
                                <Grid item >
                                    <Button variant="contained" color="secondary" size="large" style={{margin:5}} onClick={clear} >Resetear</Button>
                                    <Button  variant="contained" color="primary" size="large" style={{margin:5}} onClick={handleSubmit} type="submit" >Crear Tension</Button>
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
                    
                </form>
            </div>
        </div>   
  );
}
