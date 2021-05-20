import React from 'react';
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';

import { Link } from "react-router-dom";

import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import {Grid} from '@material-ui/core';

const useStyles = makeStyles(styles);

const renderInformationCard = (parameters) => {
  return (
    <Grid>
        <br/>
        <p>
          En este espacio puedes elegir sobre que encuesta y cuantos temas mostrar, nuestra recomendación es que utilices 10 temas ya que arroja mejores resultados.
        </p>  
        <br/>
        <p>
         En el menú al costado izquierdo podrás acceder a los tableros de control con información.
        </p>
        <br/>
        <p>
         PARAMETROS SELECCIONADOS:
        </p>
        <p>
         - Número de temas: {parameters.numberOfTopics}
        </p>
        <p>
         - Nombre de archivo: {parameters.file}
        </p>
        <br/>
        <p>
        </p>
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
            labelText="Número de temas"
            id="topicsNum"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              name: "numberOfTopics",
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
                inputProps={{
                    name: "file",
                    type: "string",
                    onChange: onChange,
                }}
                >
                <option value={''}></option>
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
  let numberOfTopics = Number(parameters.numberOfTopics);
  let file = String(parameters.file);
  if(!numberOfTopics || numberOfTopics < 1 || numberOfTopics > 10) return false;
  if(!file) return false;
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
            {renderInformationCard(parameters)}
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            {renderParameterSelector(handleParameterChange, handleFileChange, classes)}
            {validParameters(parameters) ? (
            <div>
                <Button
                  fullWidth
                  round
                  color="primary"
                  onClick={()=>this.props.executeModel(parameters)}
                >
                  Consultar
                </Button>
            </div>
            ) : (
            <div>
              <p>
                No has ingresado información valida o te hace falta llenar campos...
              </p>
            </div>
            )}
          </GridItem>
          </GridContainer> 
        </CardBody>
      </Card>
    </div>
  );
}