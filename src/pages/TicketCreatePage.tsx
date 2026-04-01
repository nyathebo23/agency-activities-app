import * as React from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Grid, Stack, Typography } from '@mui/material';
import { CustomerForm } from '../components/CustomerForm';
import { TicketCreateForm } from '../components/TicketCreateForm';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { PlannedTravels } from '../components/PlannedTravels';
import { TravelTicketsList } from '../components/TravelTicketsList';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export const TicketCreatePage = () => {

    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    React.useEffect(() => {
        console.log(activeStep);
    }, [activeStep]);

    const steps = [
        {
            label: 'Choose or create customer'
        },
        {
            label: 'Create ticket for customer'
        },
        {
            label: 'Confirmation'
        },
    ];
    return (
        <Grid container spacing={8}>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Box sx={{ maxWidth: 400 }}>
                    <Stepper activeStep={activeStep} orientation="vertical">
                            <Step key={steps[0].label}>
                                <StepLabel>{steps[0].label}</StepLabel>
                                <StepContent>
                                    <CustomerForm nextStep={handleNext}></CustomerForm>
                                </StepContent>
                            </Step>
                            <Step key={steps[1].label}>
                                <StepLabel>{steps[1].label}</StepLabel>
                                <StepContent>
                                    <TicketCreateForm backStep={handleBack}></TicketCreateForm>
                                </StepContent>
     
                            </Step>
                            <Step key={steps[2].label}>
                                <StepLabel>{steps[2].label}</StepLabel>
                                <StepContent>
                                    <Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column'}}>
                                        <CheckCircleIcon fontSize='large' color='success' />
                                        <Typography>
                                            Ticket created sucessfully
                                        </Typography> 
                                    </Box>
                                    <Button 
                                        variant="outlined"
                                        sx={{ textAlign: 'right' }}
                                        onClick={handleBack}
                                    >
                                        Back
                                    </Button>
                                </StepContent>
     
                            </Step>
                    </Stepper>
                    {/* {activeStep === steps.length && (
                        <Paper square elevation={0} sx={{ p: 3 }}>
                        <Typography>All steps completed - you&apos;re finished</Typography>
                        <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                            Reset
                        </Button>
                        </Paper>
                    )} */}
                </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 8, lg: 9 }}>
                <Box>
                    <Stack gap={2}>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                            >
                                <Typography component="span">Travels planned</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <PlannedTravels/>
                            </AccordionDetails>
                        </Accordion>
                        <TravelTicketsList/>
                    </Stack>
                </Box>
            </Grid>  
        </Grid>
    );
}