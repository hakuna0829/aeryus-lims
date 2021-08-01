import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import {
    Button,
    Typography,
    Grid,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
} from '@material-ui/core';
import moment from "moment";
import { DatePicker, MuiPickersUtilsProvider, } from "@material-ui/pickers";
import MomentUtils from '@date-io/moment';
import brandStyles from 'theme/brand';
// import GreenButton from 'layouts/Main/components/Button/GreenButton';
import CheckButton from 'components/CheckButton';
import clsx from 'clsx';
import Download from 'icons/Download';
import Chart from 'icons/Chart';

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(0),
    },
    // header: {
    //     display: 'flex',
    //     // justifyContent: 'space-between',
    //     alignItems: 'center',
    //     marginTop: 30
    // },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing(2),
        // marginBottom: theme.spacing(2),
    },
    subHeader: {
        display: 'flex',
        alignItems: 'center'
    },
    headerSubTitle: {
        color: theme.palette.brandText,
        marginLeft: 8,
        display: 'flex',
        alignItems: 'center'
    },
    headerTitle: {
        fontFamily: 'Montserrat',
        color: '#043B5D',
        fontSize: 22

    },
    addIcon: {
        color: '#043B5D',
    },
    dialogPaper: {
        maxWidth: '1200px',
        width: '1120px',
    },
    uploadContanier: {
        border: 'solid 2px #0F84A9',
        borderRadius: 10,
        padding: 20,
        position: 'relative'
    },
    uploadImageContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        '& img': {
            marginRight: 10,
            width: 40
        }
    },
    uploadTitle: {
        color: '#0F84A9',
        fontSize: 22,
        position: 'absolute',
        top: -10,
        background: '#fff',
        padding: '0 10px'
    },
    uploadDesc: {
        color: '#9B9B9B',
        fontSize: 22,
        padding: '10px 20px'
    },
    uploadInput: {
        display: 'none',
    },
    greenButton: {
        margin: '0 30px 20px 0'

    },
    submitButton: {
        // marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
    },
    utilRoot: {
        width: 120,
        marginRight: 15,
        '& .MuiInput-underline:before': {
            borderBottom: 'solid 1px #0F84A9'
        },
        '& .MuiInput-underline:hover': {
            borderBottom: 'solid 1px #0F84A9'
        },
        '& .MuiInput-underline:after': {
            borderBottom: 'solid 1px #0F84A9'
        }
    },
}))

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const ReportDialog = props => {
    const { title, exportHeaderList, setExportHeaderList, exportOption, setExportOption, exportOptionsList } = props;

    const classes = useStyles();
    const brandClasses = brandStyles();

    const [fromDate, setFromDate] = React.useState(moment().startOf('month'));
    const [toDate, setToDate] = React.useState(moment());

    const handleClose = () => {
        props.toggleReportDlg(false);
    };

    const handleChange = index => e => {
        e.persist();
        let temp = [...exportHeaderList];
        temp[index].export = e.target.checked;
        setExportHeaderList(temp);
    };

    const handleExportOptionChange = e => {
        e.persist();
        setExportOption(e.target.value);
    };

    const handleSubmit = async event => {
        event.preventDefault();
        props.clickCSV({ fromDate: fromDate.toISOString(), toDate: toDate.toISOString() });
    };

    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={props.isShowReportDlg}
            classes={{ paper: classes.dialogPaper }}
        >
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                {/* <div className={classes.header}>
                    <Typography className={classes.headerTitle}>{title}</Typography>
                </div> */}
                <div className={classes.header} >
                    <div className={classes.subHeader}>
                        <Chart style={{ color: '#043B5D' }} />&ensp;
                        <Typography variant="h2" className={brandClasses.headerTitle}>
                            Reporting |
                        </Typography>
                        <Typography variant="h4" className={classes.headerSubTitle}>
                            {title}
                        </Typography>
                    </div>
                </div>
            </DialogTitle>

            <DialogContent style={{ padding: '0px 32px' }}>
                <form
                    onSubmit={handleSubmit}
                >
                    <div style={{ display: 'none', marginBottom: '24px' }}>
                        <MuiPickersUtilsProvider utils={MomentUtils} >
                            <DatePicker
                                label="From Date"
                                format="DD-MMM-yyyy"
                                value={fromDate}
                                onChange={setFromDate}
                                className={classes.utilRoot}
                            />
                            <DatePicker
                                label="To Date"
                                format="DD-MMM-yyyy"
                                value={toDate}
                                onChange={setToDate}
                                className={classes.utilRoot}
                            />
                        </MuiPickersUtilsProvider>
                    </div>

                    <br />

                    {exportOptionsList &&
                        <div style={{ display: 'flex', marginBottom: 24, width: 220 }}>
                            <FormControl
                                className={brandClasses.shrinkTextField}
                                required
                                fullWidth
                                variant="outlined"
                            >
                                <InputLabel shrink className={brandClasses.selectShrinkLabel}>Options</InputLabel>
                                <Select
                                    onChange={handleExportOptionChange}
                                    label="Options* "
                                    name="export_options"
                                    displayEmpty
                                    value={exportOption}
                                >
                                    {exportOptionsList.map((eo, index) => (
                                        <MenuItem key={index} value={eo}>{eo}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                    }

                    {(!exportOption || exportOption === 'Custom') &&
                        <Grid container spacing={3}>
                            {exportHeaderList.map((header, index) => (
                                <Grid item xs={12} sm={5} key={index}>
                                    <CheckButton
                                        checked={header.export}
                                        label={header.label}
                                        name={header.key}
                                        onChange={handleChange(index)}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    }
                    <div className={brandClasses.footerButton}>
                        <Button
                            className={clsx(classes.submitButton, brandClasses.button)}
                            type="submit"
                        >
                            <Download /> &nbsp;
                        {'EXPORT'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog >
    )
}

ReportDialog.propTypes = {
    title: PropTypes.string.isRequired,
    exportHeaderList: PropTypes.array.isRequired,
    setExportHeaderList: PropTypes.func.isRequired,
}

export default ReportDialog;