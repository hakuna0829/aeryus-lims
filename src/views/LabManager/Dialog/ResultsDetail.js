import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles, makeStyles } from '@material-ui/core/styles';

import Dialog from '@material-ui/core/Dialog';

import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';

import { Typography, Grid, CircularProgress } from '@material-ui/core';
import GreenButton from '../../../layouts/Main/components/Button/GreenButton';

import SelectBox from '../ResultsManager/old/SelectBox';
import moment from "moment";
import 'moment-timezone';
import { showFailedDialog, showErrorDialog } from 'actions/dialogAlert';
import { updateTestingResult } from 'actions/api';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(0),
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 0

    },
    cardTitle: {
        color: '#043B5D',
        fontFamily: 'Montserrat',
        fontSize: '20px',
        fontWeight: 600,
        padding: '15px 20px',
        border: 'solid 4px #0F84A9',
        borderTop: 0,
        borderRight: 0,
        '&:first-child': {
            borderLeft: 0
        },
        '&:last-child': {
            borderRight: 0
        },
        [theme.breakpoints.up('lg')]: {
            maxWidth: '1600px',
            width: '1620px',
        },
        [theme.breakpoints.between('md', 'lg')]: {
            maxWidth: '1200px',

            // width: '1220px',
        },
        [theme.breakpoints.down('sm')]: {
            borderLeft: 0
        },
    },
    cardDesc: {
        color: '#043B5D',
        fontFamily: 'Montserrat',
        fontSize: '20px',
        fontWeight: 600,
        padding: '15px 20px 40px',
        border: 'solid 4px #0F84A9',
        borderTop: 0,
        borderRight: 0,
        borderBottom: 0,
        '&:first-child': {
            borderLeft: 0
        },
        '&:last-child': {
            borderRight: 0
        },
        [theme.breakpoints.between('md', 'lg')]: {

        },
        [theme.breakpoints.down('sm')]: {
            borderLeft: 0,
            borderBottom: 'solid 4px #0F84A9',
        },
    },
    dobContent: {
        display: 'flex',
        justifyContent: 'space-between',
        // marginBottom:15
    },
    propertyContent: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
    },
    propertyTitle: {
        width: '30%',
        position: 'relative',
        color: '#043B5D',
        fontSize: '18px',
    },
    propertyValue: {
        width: '70%',
        color: '#043B5D',
        fontSize: '18px',
    },
    speciContent: {
        display: 'flex',
        // justifyContent:'space-between',
        width: '100%',
    },
    title: {
        color: '#043B5D',
        fontSize: '20px',
        fontWeight: 600,
        marginBottom: 20
    },
    description: {
        color: '#043B5D',
        fontSize: '18px',
        fontWeight: 500,
        lineHeight: '22px'
    },
    dialogContentRoot: {
        padding: 0,
        '&:first-child': {
            padding: 0
        }
    },
    dialogPaper: {
        maxWidth: '1600px',
        width: '1620px',
        border: 'solid 5px #0F84A9',
        borderRaidus: 8,
        [theme.breakpoints.up('lg')]: {
            maxWidth: '1600px',
            width: '1620px',
        },
        [theme.breakpoints.between('md', 'lg')]: {
            maxWidth: '1200px',
            // width: '1220px',
        },
        [theme.breakpoints.down('sm')]: {

        },

    },
    cardContainer: {
        margin: 0
    },
    cardContainer2: {
        margin: 0,

    },
    card2Title: {
        backgroundColor: '#0F84A9',
        color: '#fff',
        fontFamily: 'Montserrat',
        fontSize: '19px',
        fontWeight: 500,
        padding: '15px 20px',
        borderRight: 'solid 1px #fff',
        '&:last-child': {
            borderRight: 0
        },

    },
    card2Desc: {
        color: '#FF931E',
        fontFamily: 'Montserrat',
        fontSize: '19px',
        fontWeight: 500,
        padding: '15px 20px',
        borderRight: 'solid 1px #0F84A9',
        '&:last-child': {
            borderRight: 0
        },
    },
    card3Desc: {
        color: '#FF931E',
        fontFamily: 'Montserrat',
        fontSize: '19px',
        fontWeight: 500,
        padding: '15px 20px',
        borderTop: 'solid 1px #0F84A9',
        borderBottom: 'solid 1px #0F84A9',
        '&:last-child': {
            borderRight: 0
        },
    },
    card: {
        width: 300,
        margin: '20px 0',
        border: '1px solid #0F84A9',
        borderBottomRightRadius: 8,
        borderBottomLeftRadius: 8,
        boxShadow: '4px 4px 8px 2px rgba(15,132,169,0.15)',
        [theme.breakpoints.up('lg')]: {

        },
        [theme.breakpoints.between('md', 'lg')]: {
            width: 500,
        },
        [theme.breakpoints.down('sm')]: {

        },
    },
    cardHeader: {
        backgroundColor: '#0F84A9',
        color: '#fff',

    },
    cardBody: {
        padding: 16
    },
    bottomDesc: {
        color: '#043B5D',
        fontFamily: 'Montserrat',
        fontSize: '20px',
        fontWeight: 500,
        padding: 30,
        lineHeight: '30px'
    },
    greenButton: {
        margin: '20px 0',
        minWidth: 100,
        border: 'solid 1px #25DD83',
        backgroundColor: '#25DD83'
    },
    redButton: {
        margin: '20px 0',
        minWidth: 100,
        border: 'solid 1px #DD2525',
        backgroundColor: '#DD2525'

    },

}))

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(0),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);


const ResultsDetail = props => {
    const { data, showFailedDialog, showErrorDialog } = props;

    const classes = useStyles();

    const handleClose = () => {
        props.toggleResultsDetailDlg(false);
    };

    const statusData = [
        { value: 'Not Detected' },
        { value: 'Non Reactive' },
        { value: 'Inconclusive' },
    ];

    const [loading, setLoading] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState('Not Dectected');
    const [isDisplayActionBtn] = React.useState(props.isActionBtn ? true : false);

    const onClickTrack = (result) => {
        let body = {
            testing_id: data._id,
            result,
            rna: selectedValue
        };
        setLoading(true);
        updateTestingResult(body).then(res => {
            setLoading(false);
            if (res.data.success) {
                handleClose();
                props.setRefetch(refetch => refetch + 1);
            } else {
                showFailedDialog(res);
            }
        }).catch(error => {
            setLoading(false);
            showErrorDialog(error);
        });
    }

    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={props.isShowResultsDetailDlg}
            // className={classes.root}
            classes={{ paper: classes.dialogPaper }}
        >
            <DialogContent classes={{ root: classes.dialogContentRoot }}>
                <Grid container className={classes.cardContainer} spacing={0}>
                    <Grid item xs={12} md={4} className={classes.cardTitle} >
                        Patient Information
                        </Grid>

                    <Grid item xs={12} md={4} className={classes.cardTitle}>
                        Patient Information
                        </Grid>
                    <Grid item xs={12} md={4} className={classes.cardTitle}>
                        Specimen Information
                        </Grid>
                </Grid>
                <Grid container className={classes.cardContainer} spacing={0}>
                    {data && (
                        <Grid item xs={12} md={4} className={classes.cardDesc} >
                            <Typography className={classes.title}>
                                {data.dependent_id ? data.dependent_id.last_name : data.user_id.last_name}
                                &nbsp;
                                {data.dependent_id ? data.dependent_id.first_name : data.user_id.first_name}
                            </Typography>

                            <div className={classes.dobContent}>
                                <Typography className={classes.title}>
                                    {'DOB: '}
                                    {data.dependent_id
                                        ?
                                        moment.utc(data.dependent_id.dob).format('MM/DD/YYYY')
                                        :
                                        moment.utc(data.user_id.dob).format('MM/DD/YYYY')
                                    }
                                </Typography>
                                <Typography className={classes.title}>
                                    {'AGE: '}
                                    {data.dependent_id
                                        ?
                                        moment().diff(data.dependent_id.dob, 'years')
                                        :
                                        moment().diff(data.user_id.dob, 'years')
                                    }
                                </Typography>
                            </div>
                            <div className={classes.propertyContent}>
                                <Typography className={classes.propertyTitle}>Gender: </Typography>
                                <Typography className={classes.propertyValue}>
                                    {data.dependent_id ? data.dependent_id.gender : data.user_id.gender}
                                </Typography>
                            </div>
                            <div className={classes.propertyContent}>
                                <Typography className={classes.propertyTitle}>Phone: </Typography>
                                <Typography className={classes.propertyValue}>{data.user_id.phone}</Typography>
                            </div>
                            <div className={classes.propertyContent}>
                                <Typography className={classes.propertyTitle}>Patient ID: </Typography>
                                <Typography className={classes.propertyValue}>NG</Typography>
                            </div>
                        </Grid>
                    )}

                    {data && (
                        <>
                            <Grid item xs={12} md={4} className={classes.cardDesc}>
                                <div className={classes.speciContent}>
                                    <Typography className={classes.propertyTitle}>Client ID#: </Typography>
                                    <Typography className={classes.propertyValue}>{data.client_id ? data.client_id.partner_id : ''}	</Typography>
                                </div>
                                <br />
                                <div className={classes.speciContent}>
                                    <Typography className={classes.propertyTitle}>PATIENT : </Typography>
                                    <Typography className={classes.propertyValue}>{data.dependent_id ? data.dependent_id.first_name : data.user_id.first_name}</Typography>
                                </div>
                                <div className={classes.speciContent}>
                                    <Typography className={classes.propertyValue}>
                                        {data.user_id.address} {data.user_id.address2}
                                    </Typography>
                                </div>
                                <div className={classes.speciContent}>
                                    <Typography className={classes.propertyValue}>
                                        {data.user_id.city}, {data.user_id.state}  {data.user_id.zip_code}
                                    </Typography>
                                </div>
                                <br />
                                <div className={classes.speciContent}>
                                    <Typography className={classes.propertyTitle}>PHONE: </Typography>
                                    <Typography className={classes.propertyValue}>{data.user_id.phone}</Typography>
                                </div>
                            </Grid>

                            <Grid item xs={12} md={4} className={classes.cardDesc}>
                                <div className={classes.speciContent}>
                                    <Typography className={classes.propertyTitle}>Specimen: </Typography>
                                    <Typography className={classes.propertyValue}>WD052071A</Typography>
                                </div>
                                <div className={classes.speciContent}>
                                    <Typography className={classes.propertyTitle}>Requisition: </Typography>
                                    <Typography className={classes.propertyValue}>
                                        {/* 0200612 */}
                                        {data.lab_submitted_timestamp
                                            ?
                                            moment(data.lab_submitted_timestamp).format('MM/DD/YYYY')
                                            :
                                            data.date &&
                                            moment(data.date).format('MM/DD/YYYY')
                                        }
                                    </Typography>
                                </div>
                                <br />
                                <div className={classes.speciContent}>
                                    <Typography className={classes.propertyTitle}>Collected: </Typography>
                                    <Typography className={classes.propertyValue}>{data.collected_timestamp && `${moment.utc(data.collected_timestamp).tz("America/New_York").format('MM/DD/YYYY | h:mm A')} EDT`}</Typography>
                                </div>
                                <div className={classes.speciContent}>
                                    <Typography className={classes.propertyTitle}>Received: </Typography>
                                    <Typography className={classes.propertyValue}>{data.received_timestamp && `${moment.utc(data.received_timestamp).tz("America/New_York").format('MM/DD/YYYY | h:mm A')} EDT`}</Typography>
                                </div>
                                <div className={classes.speciContent}>
                                    <Typography className={classes.propertyTitle}>Reported: </Typography>
                                    <Typography className={classes.propertyValue}>{data.reported_timestamp && `${moment.utc(data.reported_timestamp).tz("America/New_York").format('MM/DD/YYYY | h:mm A')} EDT`}</Typography>
                                </div>
                            </Grid>
                        </>
                    )}
                </Grid>
                <Grid container className={classes.cardContainer2} spacing={0}>
                    <Grid item xs={12} md={3} className={classes.card2Title} >
                        Test Name
                    </Grid>
                    <Grid item xs={12} md={2} className={classes.card2Title}>
                        In Range
                    </Grid>
                    <Grid item xs={12} md={2} className={classes.card2Title}>
                        Out Of Range
                    </Grid>
                    <Grid item xs={12} md={3} className={classes.card2Title}>
                        Reference Range
                    </Grid>
                    <Grid item xs={12} md={2} className={classes.card2Title}>
                        Lab/AMD
                    </Grid>

                    <Grid item xs={12} md={3} className={classes.card2Desc} >
                        SARS CoV 2 RNA (COVID-19)<br />
                        QUALITATIVE NAAT
                    </Grid>
                    <Grid item xs={12} md={2} className={classes.card2Desc}>
                        {'<0.0'}
                    </Grid>
                    <Grid item xs={12} md={2} className={classes.card2Desc}>
                        {'0.0>'}
                    </Grid>
                    <Grid item xs={12} md={3} className={classes.card2Desc}>
                        0.0 - 0.0
                    </Grid>
                    <Grid item xs={12} md={2} className={classes.card2Desc}>

                    </Grid>
                </Grid>
                <Grid container className={classes.cardContainer2} spacing={0}>
                    <Grid item xs={12} md={3} className={classes.card3Desc} >
                        SARS CoV 2 RNA
                    </Grid>
                    <Grid item xs={12} md={9} className={classes.card3Desc}>
                        <SelectBox
                            data={statusData}
                            setSelectedValue={setSelectedValue}
                            selectedValue={selectedValue}
                        />
                    </Grid>
                </Grid>
                <Grid container className={classes.cardContainer2} spacing={0}>
                    <Typography className={classes.bottomDesc}>
                        {'<'} {selectedValue} (negative) test result for this test means that SARS-CoV-2 RNA was not present in the specimen above the limit of detection. <br /><br />
                        {"A negative result does not rule out the possibility of COVID-19 and should not be used as the sole basis for treatment or patient management decisions. If COVID-19 is still suspected, based on exposure history together with other clinical findings, re-testing should be considered in consultation with public health authorities. Laboratory test results should always be considered in the context of clinical observations and epidemiological data in making a final diganosis and patient management decisions. >"}
                    </Typography>
                </Grid>

            </DialogContent>
            <DialogActions style={isDisplayActionBtn ? { display: 'flex' } : { display: 'none' }}>
                {loading && <CircularProgress />}
                <GreenButton label="NEGATIVE" className={classes.greenButton} onClick={() => onClickTrack('Negative')} />
                <GreenButton label="POSITIVE" className={classes.redButton} onClick={() => onClickTrack('Positive')} />
            </DialogActions>
        </Dialog >

    )
}

ResultsDetail.propTypes = {
    data: PropTypes.any,
    showFailedDialog: PropTypes.func.isRequired,
    showErrorDialog: PropTypes.func.isRequired,
};

export default connect(null, { showFailedDialog, showErrorDialog })(ResultsDetail);