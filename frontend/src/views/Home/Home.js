import React, {useState} from 'react';
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import Chip from '@material-ui/core/Chip';
import Radio from '@material-ui/core/Radio';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';

// @material-ui/pickers
import MomentUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import { Link } from "react-router-dom";

import Logo from '../../images/Home/UnfpaLogo.png'; 
import Lorenz from '../../images/Home/Lorenz.png'; 
import Analitica from "../../images/Home/Analitica.png";
import Tensiones from "../../images/Home/Tensiones.png";
import Topicos from "../../images/Home/Topicos.png";
import TopicGeneral from "../../images/Home/TopicGeneral.png";
// @material-ui/icons
import VerifiedUserRounded from "@material-ui/icons/VerifiedUserSharp";
import InfoIcon from "@material-ui/icons/Info";
import TopicsIcon from "@material-ui/icons/PermDataSetting";
import CalendarIcon from "@material-ui/icons/DateRange";
import ProfileIcon from "@material-ui/icons/SupervisedUserCircle";
import Check from "@material-ui/icons/Check";
import At from "@material-ui/icons/AlternateEmailSharp";
import Spellcheck from "@material-ui/icons/Spellcheck";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import SnackbarContent from "components/Snackbar/SnackbarContent.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
// API Methods
import { getUsers } from "../../API/TwitterAPI.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import {Paper, Typography, Grid} from '@material-ui/core';

const useStyles = makeStyles(styles);

const renderInformationCard = (classes) => {
  return (
    <Grid>
        <br/>
        <p>
          En este espacio puedes elegir sobre que encuesta y cuantos temas mostrar, nuestra recomendación es que utilices 10 temas ya que arroja mejores resultados.
        </p>  
        <br/>
        <p>
         En el menú al costado izquierdo podrás acceder a los tableros de control con información y el espacio para llenar una matriz de tensiones.
        </p>
        <br/>
    </Grid>
  );
};

const renderParameterSelector = (onChange, handleFileChange, classes) => {
  return (
    <Grid container direction="column">
      <Grid>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Número de temas</h4>
          </CardHeader>
          <CardBody>
          <CustomInput
            labelText="Número de tópicos"
            id="topicsNum"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              name: "topics",
              type: "number",
              onChange: onChange,
            }}
          />
          </CardBody>
        </Card>
      </Grid>
      <Grid>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Archivo de Encuesta</h4>
          </CardHeader>
          <CardBody>
          <FormControl variant="outlined" style = {{width:300}}>
              <Select
                native
                
                onChange={handleFileChange}
                inputProps={{
                    name: "topics",
                    type: "number",
                }}
                >
                <option value={'MedellinCleaned.xlsx'}>Medellín</option>
              </Select>
          </FormControl>

          </CardBody>
        </Card>
      </Grid>
    </Grid>
  );
};

const validParameters = (parameters) => {
  console.log(parameters);
  let topicsNumber = Number(parameters.topics);
  if(!topicsNumber || topicsNumber < 1 || topicsNumber > 10) return false;
  return true;
};

export default function Home(props) {
  const classes = useStyles();
  const [parameters, setParameters] = React.useState({});
  const handleParameterChange = (event) => {
    if(event.target) {
      setParameters({
        ...parameters,
        [event.target.name]: event.target.value,
      });
    }
  };

  const handleFileChange = (e) => {
    setParameters({ ...parameters, file: e.target.value });
  };

  return (
    <div>
      <Card>
        <CardHeader color="primary">
          <h4 className={classes.cardTitleWhite}>Ejecutar modelo</h4>
        </CardHeader>
        <CardBody>
        <GridContainer>
          <GridItem xs={12} sm={12} md={6}>
            {renderInformationCard(classes)}
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            {renderParameterSelector(handleParameterChange, handleFileChange, classes)}
            {validParameters(parameters) ? (
            <div>
              <Link to="/admin/dashboardGeneral">
                <Button
                  fullWidth
                  round
                  color="primary"
                  onClick={() => props.executeModel(parameters)}
                >
                  Consultar
                </Button>
              </Link>
            </div>
            ) : (
            <div></div>
            )}
          </GridItem>
          </GridContainer> 
        </CardBody>
      </Card>
     
      
    </div>
  );
}