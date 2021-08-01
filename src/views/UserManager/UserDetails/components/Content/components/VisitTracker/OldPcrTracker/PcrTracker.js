import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography, Divider, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Checkbox } from '@material-ui/core';
import { connect } from 'react-redux';
import brandStyles from 'theme/brand';
import LineStepProgressBar from "components/LineStepProgressBar";
import { getPatient, upsertPatient } from 'actions/api';
import clsx from 'clsx';
import SignaturePad from 'react-signature-canvas';

const useStyles = makeStyles(theme => ({
    root: {
    },
    header: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: theme.spacing(2),
    },
    headerTitle: {
        color: theme.palette.brandText,
        display: 'flex',
        '& img': {
            marginRight: 8
        }
    },
    headerSubTitle: {
        color: theme.palette.brandText,
        marginLeft: 8
    },
    heading: {
        font: 'Montserrat',
        color: '#0F84A9',
        fontSize: '16px',
        fontWeigth: 600

    },
    symptoms: {
        font: 'Montserrat',
        color: '#0F84A9',
        fontSize: '12px',
        fontWeigth: 400,
        padding: 5,
        border: '0.834148px solid #0F84A9',
        margin: 5,
        borderRadius: '13.9025px',
        lineHeight: '32px'
    },
    box: {
        font: 'Montserrat',
        color: '#0F84A9',
        fontSize: '12px',
        fontWeigth: 400,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '5px 10px',
        margin: 5,
        borderRadius: '13.9025px',
        lineHeight: '32px',
        boxShadow: 'none'
    },
    divider: {
        width: '50%',
        color: '#D8D8D8',
        border: 'solid 1px #D8D8D8',
        margin: '20px auto'
    },
    nextbutton: {
        color: ' #FFFFFF',
        display: 'flex',
        minWidth: '120px',
        fontWeight: '600',
        lineHeight: '2',
        paddingLeft: '8px',
        paddingRight: '8px',
        letterpacing: '1px',
        textTransform: 'none',
        backgroundColor: '#3ECCCD',
        '&:hover': {
            backgroundColor: '#3ECCCD',
            color: ' #FFFFFF',
        },
    },
    signatureBox: {
        // height: 218,
        width: '50%',
        border: `solid 1px`,
        borderColor: theme.palette.brandDark,
        borderRadius: 10,
        padding: 10,
        position: 'relative',
        boxShadow: '4px 4px 8px 2px rgba(15,132,169,0.15)',
        '& img': {
            width: '100%'
        }
    },
    dialogHeader: {
        color: "#25DD83"
    },
    dialogCheckbox: {
        color: theme.palette.brandDark,
        '& img': {
            marginLeft: 10,
        },
        '& .MuiTypography-body1': {
            color: theme.palette.brandDark
        },
        '& .MuiSvgIcon-root': {
            color: theme.palette.brandDark
        }
    },
}));

let patientSigPad = {};
let medicalSigPad = {};
const PcrTracker = (props) => {
    const { user, getPatient } = props;
    const classes = useStyles();
    const brandClasses = brandStyles();
    const labelArray = ['Patient Approval', 'Checklist']

    const [patientDetails, setPatientDetails] = useState({ guardian_signature: false, specimen_taken_yes: false, package_readyto_send_yes: false, specimen_taken_no: false, package_readyto_send_no: false });
    const [step, setStep] = useState(0);
    const [showDialog, setShowDialog] = useState(false)
    const [disablenext, setDisableNext] = useState(true)

    useEffect(() => {
        if (user._id) {
            async function fetchData() {
                const res = await getPatient(user._id);
                if (res.success && res.data) {
                    setPatientDetails(patientDetails => ({ ...patientDetails, ...res.data }));
                }
            }
            fetchData();

        }
    }, [user._id, getPatient])

    const onStepChange = async () => {
        if (step === 1) {
            setShowDialog(true)
        } else {
            setStep(step + 1)
            setDisableNext(true);
        }


    }

    const onStepBack = () => {
        setStep(step - 1)
    }
    const patientSigClear = () => {
        patientSigPad.clear();
        checkPatientSig();
    };

    const medicalSigClear = () => {
        medicalSigPad.clear();
        checkPatientSig();
    }

    const checkPatientSig = () => {
        if (!patientSigPad.isEmpty() && !medicalSigPad.isEmpty()) {
            setDisableNext(false);
        } else {
            setDisableNext(true);
        }
    }


    const closeDialog = () => {
        setShowDialog(false)
    }

    const handleChange = e => {
        e.persist();
        let temp = patientDetails;
        temp[e.target.name] = e.target.checked;
        setPatientDetails({ ...patientDetails, temp });
        if (temp.specimen_taken_yes && temp.package_readyto_send_yes) {
            setDisableNext(false);
        }
    }

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <Typography variant="h2" className={brandClasses.headerTitle}>
                    <img src="/images/svg/status/users_icon.svg" alt="" />
                    {user.last_name} {user.first_name} |
        </Typography>
                <Typography variant="h4" className={classes.headerSubTitle}>Patient approval</Typography>
            </div>
            <Grid container >
                <Grid item xs={12} className="text-left d-flex">
                    <LineStepProgressBar activeIndex={step} labels={labelArray} totalCount={2} />
                </Grid>
            </Grid>
            {step === 0 && <>
                <Grid container direction="column" justify="center" alignitems="center">
                    <Grid container direction="row" justify="center" alignitems="center">
                        <Typography variant="h6" style={{ marginTop: '10px', marginBottom: '20px' }}>We need the patient and technician’s signatures for consent to administer the PCR Test</Typography>
                    </Grid>
                    <Grid container direction="row" justify="center" alignitems="center">
                        <div className={classes.signatureBox}>
                            <Typography variant="h5" className={brandClasses.signBoxTitle}> Patient Signature </Typography>
                            <Typography variant="h5" className={brandClasses.signBoxDesc}>Patient sign here</Typography>
                            <SignaturePad
                                penColor='#0F84A9'
                                canvasProps={{ width: 500, height: 150, className: 'sigCanvas' }}
                                // canvasProps={{ className: brandClasses.sigPad }}
                                // clearOnResize={false}
                                ref={(ref) => { patientSigPad = ref }}
                                onEnd={checkPatientSig}
                            />
                            <Grid container direction="row" alignitems="center">
                                <Grid item xs={8}>
                                    <Typography variant="h6">All medical information is encrypted and private</Typography></Grid>
                                <Grid item xs={4}><Button
                                    className={clsx(brandClasses.button, brandClasses.whiteButton)}
                                    style={{ margin: 'auto', float: 'right' }}
                                    onClick={patientSigClear}
                                >
                                    {'Clear Signature'}
                                </Button>
                                </Grid>

                            </Grid>
                        </div>

                    </Grid>
                    <Grid container direction="row" justify="center" alignitems="center" style={{ marginBottom: '20px' }}>
                        <Typography variant="h6" style={{ fontSize: '10px' }}>You will be notified of your test results 24-48 hours on the<br></br> TESTD | ID app or via email.</Typography>&ensp;
                        <FormControlLabel
                            control={<Checkbox onChange={handleChange} name="guardian_signature" checked={patientDetails.guardian_signature} />}
                            label="Guardian signature"
                            className={classes.dialogCheckbox}
                        />
                    </Grid>
                    <Grid container direction="row" justify="center" alignitems="center" style={{ marginTop: '10px', marginBottom: '20px' }}>
                        <div className={classes.signatureBox}>
                            <Typography variant="h5" className={brandClasses.signBoxTitle}> Medical Technician</Typography>
                            <Typography variant="h5" className={brandClasses.signBoxDesc}>Medical Technician sign here</Typography>
                            <SignaturePad
                                penColor='#0F84A9'
                                canvasProps={{ width: 500, height: 150, className: 'sigCanvas' }}
                                // canvasProps={{ className: brandClasses.sigPad }}
                                // clearOnResize={false}
                                ref={(ref) => { medicalSigPad = ref }}
                                onEnd={checkPatientSig}
                            />
                            <Grid container direction="row" alignitems="center">
                                <Grid xs={8}>
                                    <Typography variant="h6">All medical information is encrypted and private</Typography></Grid>
                                <Grid xs={4}><Button
                                    className={clsx(brandClasses.button, brandClasses.whiteButton)}
                                    style={{ margin: 'auto', float: 'right' }}
                                    onClick={medicalSigClear}
                                >
                                    {'Clear Signature'}
                                </Button>
                                </Grid>

                            </Grid>
                        </div>

                    </Grid>
                    <Grid>

                    </Grid>
                </Grid>
            </>
            }
            {step === 1 && <>
                <Grid container direction="column" justify="center" alignitems='center'>
                    <Grid container direction="row" justify="center" alignitems="center">
                        <Grid item xs={3}></Grid>
                        <Grid item xs={3} spacing={3} style={{ textAlign: 'center' }}>
                            <Typography variant="h6">
                                {'PATIENT NAME:'}
                            </Typography>
                            <Typography variant="h6" style={{ color: '#043B5D' }}>
                                {user.first_name} {user.last_name}
                            </Typography>
                        </Grid>
                        <Grid item xs={3} spacing={3} style={{ textAlign: 'center' }}>
                            <Typography variant="h6">
                                {'LABEL FOR'}
                            </Typography>
                            <Typography variant="h6" style={{ color: '#043B5D' }}>
                                {'LABEL FOR'}
                            </Typography>
                        </Grid>
                        <Grid item xs={3}></Grid>
                    </Grid>
                    <Divider className={classes.divider} style={{ margin: '5px auto' }} flexItem={true} />
                    <Grid container direction="row" justify="center" alignitems="center">
                        <Grid item xs={3}></Grid>
                        <Grid item xs={3} spacing={3} style={{ textAlign: 'center' }}>
                            <Typography variant="h6" >
                                {'SESSION ID'}
                            </Typography>
                            <Typography variant="h6" style={{ color: '#043B5D' }}>
                                {'SESSION ID'}
                            </Typography>
                        </Grid>
                        <Grid item xs={3} spacing={3} style={{ textAlign: 'center' }}>
                            <Typography variant="h6">
                                {'VACCINE ID'}
                            </Typography>
                            <Typography variant="h6" style={{ color: '#043B5D' }}>
                                {'VACCINE ID'}
                            </Typography>
                        </Grid>
                        <Grid item xs={3}></Grid>
                    </Grid>
                    <Grid item xs={12} direction="row" justify="flex-start" alignItems="center" style={{ marginTop: '10px' }}>
                        <Grid container direction="row" justify="center" alignItems="center">
                            {/* <Grid item xs={3}></Grid> */}
                            <Grid item xs={6} >
                                <Typography variant="h6" style={{ textAlign: 'right', marginRight: '10px' }}>{'Specimen taken'}</Typography></Grid>
                            <Grid item xs={3}>
                                <FormControlLabel
                                    control={<Checkbox onChange={handleChange} name="specimen_taken_yes" checked={patientDetails.specimen_taken_yes} />}
                                    label="Yes"
                                    className={classes.dialogCheckbox}
                                />
                                <FormControlLabel
                                    control={<Checkbox onChange={handleChange} name="specimen_taken_no" checked={patientDetails.specimen_taken_no} />}
                                    label="no"
                                    className={classes.dialogCheckbox}
                                />
                            </Grid>
                            <Grid item xs={3}></Grid>
                        </Grid>
                        <Grid container direction="row" justify="center" alignItems="center">
                            {/* <Grid item xs={3}></Grid> */}
                            <Grid item xs={6} >
                                <Typography variant="h6" style={{ textAlign: 'right', marginRight: '10px' }}>{'Is test in package ready to send to the lab?'}</Typography></Grid>
                            <Grid item xs={3}>
                                <FormControlLabel
                                    control={<Checkbox onChange={handleChange} name="package_readyto_send_yes" checked={patientDetails.package_readyto_send_yes} />}
                                    label="Yes"
                                    className={classes.dialogCheckbox}
                                />
                                <FormControlLabel
                                    control={<Checkbox onChange={handleChange} name="package_readyto_send_no" checked={patientDetails.package_readyto_send_no} />}
                                    label="no"
                                    className={classes.dialogCheckbox}
                                />
                            </Grid>
                            <Grid item xs={3}></Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </>
            }
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
            > <div className={brandClasses.footerButton} style={{ marginBottom: 10 }}>
                    {step !== 0 ?
                        <Button className={clsx(classes.nextbutton, brandClasses.whiteButton)} onClick={onStepBack}>
                            BACK</Button> : ''}  &ensp;
                         <Button className={classes.nextbutton} classes={{ disabled: brandClasses.buttonDisabled }} type="submit" onClick={onStepChange}
                        disabled={disablenext}
                    >NEXT</Button>
                </div>
            </Grid>
            {step === 1 && showDialog &&
                <>
                    <Dialog
                        open={showDialog}
                        onClose={closeDialog}
                        fullWidth={true}
                        maxWidth="sm"
                    >
                        <DialogTitle>
                        </DialogTitle>
                        <DialogContent>
                            <Grid container direction="row" justify="center" alignitems="center" style={{ marginBottom: '10px' }}>
                                <Typography variant="h2" style={{ color: '#25DD83' }}>
                                    Success
                                </Typography><img src="/images/svg/status/check_green.svg" alt="" style={{ width: '5%' }} />
                            </Grid>
                            <Grid container direction="row" justify="center" alignitems="center" style={{ marginBottom: '10px' }}>
                                <Typography variant="h4" style={{ color: '#043B5D' }}>
                                    Double check these items below:
                                    </Typography>
                            </Grid>
                            <Grid container direction="row" justify="center" alignitems="center" style={{ marginBottom: '10px' }}>
                                <Typography variant="h5" >

                                    • Did you label the specimen?
                                    </Typography>
                            </Grid>
                            <Grid container direction="row" justify="center" alignitems="center" style={{ marginBottom: '10px' }}>
                                <Typography variant="h5" >
                                    • Is the test label legible?
                                    </Typography>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Grid
                                container
                                direction="row"
                                justify="flex-end"
                                alignItems="flex-end"
                            > <div className={brandClasses.footerButton} style={{ marginBottom: 10 }}>
                                    <Button onClick={closeDialog} className={brandClasses.blueBtn} color="primary">
                                        REPRINT
            </Button> &ensp;
                                    <Button className={classes.nextbutton} classes={{ disabled: brandClasses.buttonDisabled }} type="submit" onClick={closeDialog}
                                    >COMPLETE</Button>
                                </div>
                            </Grid>
                        </DialogActions>
                    </Dialog>
                </>
            }
        </div >


    )
}
PcrTracker.propTypes = {
    getPatient: PropTypes.func.isRequired,
    // upsertPatient: PropTypes.func.isRequired
}
export default connect(null, { getPatient, upsertPatient })(PcrTracker);