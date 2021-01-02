import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { AnimalForm } from '../animals/AnimalForms';
import { PersonForm } from '../people/PeopleForms';
import { ServiceRequestForm } from './HotlineForms';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  test: {
    borderRadius: "0.25rem",
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function getSteps() {
  return ['Create Contacts', 'Create Animals', 'Create Service Request'];
}

function getStepContent(step, handleStepSubmit, handleBack, state) {
  switch (step) {
    case 0:
      return <PersonForm onSubmit={handleStepSubmit} handleBack={handleBack} state={state} />;
    case 1:
      return <AnimalForm onSubmit={handleStepSubmit} handleBack={handleBack} state={state} />;
    case 2:
      return <ServiceRequestForm onSubmit={handleStepSubmit} handleBack={handleBack} state={state} />;
    default:
      return 'Unknown step';
  }
}

export default function HotlineWorkflow() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();
  const [state, setState] = useState({
    activeStep: 0,
    hasOwner: false,
    animalIndex: 0,
    steps: {
      reporter: {first_name: '',
        last_name: '',
        phone: '',
        alt_phone: '',
        email: '',
        best_contact: '',
        agency: '',
        address: '',
        apartment: '',
        city: '',
        state: '',
        zip_code: '',
        latitude: null,
        longitude: null,
        change_reason: '',},
      owner: {first_name: '',
        last_name: '',
        phone: '',
        alt_phone: '',
        email: '',
        best_contact: '',
        agency: '',
        address: '',
        apartment: '',
        city: '',
        state: '',
        zip_code: '',
        latitude: null,
        longitude: null,
        change_reason: '',},
      animals: [],
    }
  });
  const [contactCount, setContactCount] = React.useState(0);

  function handleBack (stepIndex, next) {
    if (next === 'backward') {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }

    var track_index = state.animalIndex;
    if (next === 'animals' && stepIndex === 'animals') {
      track_index = state.animalIndex -1;
    }
    setState((prevState) => ({
      ...prevState,
      activeStep: prevState.activeStep - 1,
      animalIndex: track_index,
    }))
  };

  function handleStepSubmit (stepIndex, data, next) {
    // Only count contacts the first time.
    if ((stepIndex === 'reporter' && state.steps.reporter.first_name === '') || (stepIndex === 'owner' && state.steps.owner.first_name === '')) {
      setContactCount((count) => count + 1);
    }

    // Treat animals differently since we need an array of N animals.
    if (stepIndex === 'animals') {
      // Only increase animal index on save if we're adding another animal.
      var index = state.animalIndex;
      if (next === 'animals') {
        index = index + 1
      }
      // If we're not on the last animal, update the current animal based on the index.
      if (state.animalIndex !== state.steps.animals.length) {
        const animalList = [...state.steps.animals];
        animalList[state.animalIndex] = data;
        setState((prevState) => ({
          ...prevState,
          activeStep: prevState.activeStep + 1,
          animalIndex: index,
          steps: { ...prevState.steps, [stepIndex]:animalList }
        }))
      }
      // Otherwise add a new animal to the list.
      else {
        setState((prevState) => ({
          ...prevState,
          activeStep: prevState.activeStep + 1,
          animalIndex: index,
          steps: { ...prevState.steps, [stepIndex]:[...prevState.steps.animals, data] }
        }))
      }
    }
    // Otherwise update the data respective of the current step.
    else {
      setState((prevState) => ({
        ...prevState,
        hasOwner: stepIndex === 'owner',
        activeStep: prevState.activeStep + 1,
        steps: { ...prevState.steps, [stepIndex]:data }
      }))
    }

    // Only bump up the active step when designated.
    if (next === 'forward'){
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  }

  return (
    <div className={classes.root}>
      <Stepper className={classes.test} activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (index === 0) {
            labelProps.optional = <Typography variant="caption" component={'span'}>{contactCount} Contact{contactCount === 1 ? "" : "s"} Created</Typography>;
          }
          else if (index === 1) {
            labelProps.optional = <Typography variant="caption" component={'span'}>{state.steps.animals.length} Animal{state.steps.animals.length === 1 ? "" : "s"} Created</Typography>;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div>
          <div>
            <Typography className={classes.instructions} component={'span'}>{getStepContent(activeStep, handleStepSubmit, handleBack, state)}</Typography>
          </div>
      </div>
    </div>
  );
}