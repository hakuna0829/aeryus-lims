import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { Typography, Grid } from '@material-ui/core';
import GreenButton from '../../../layouts/Main/components/Button/GreenButton';
import clsx from 'clsx';

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
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 30
    },
    headerTitle: {
        color: '#043B5D',
        fontFamily: 'Montserrat',
        fontSize: '32px',
        fontWeight: 600,
        paddingRight: '40px'
    },
    title: {
        color: '#043B5D',
        fontSize: '18px',
        fontWeight: 600,
        lineHeight: '22px',
        marginBottom: 10
    },
    description: {
        color: '#043B5D',
        fontSize: '18px',
        fontWeight: 500,
        lineHeight: '22px'
    },
    dialogPaper: {
        maxWidth: '1200px',
        width: '1120px',
    },
    cardContainer: {
        margin: '30px 0'
    },
    cardContainer2: {
        margin: '30px 0',
        width: '940px'
    },
    card: {
        width: 300,
        margin:'20px 0',
        border: '1px solid #0F84A9',
        borderBottomRightRadius: 8,
        borderBottomLeftRadius: 8,
        boxShadow: '4px 4px 8px 2px rgba(15,132,169,0.15)',
        [theme.breakpoints.up('lg')]: {
            width: 340,
        },
        [theme.breakpoints.between('md', 'lg')]: {
            width: 300,
        },
        [theme.breakpoints.down('sm')]: {
            width: 300,
        },
    },
    cardHeader: {
        backgroundColor: '#0F84A9',
        color: '#fff',

    },
    cardTitle: {
        fontSize: 14,
        fontWeight: 500,
        color: '#fff',
        padding: '10px 16px',
        [theme.breakpoints.up('lg')]: {

        },
        [theme.breakpoints.between('md', 'lg')]: {

        },
        [theme.breakpoints.down('sm')]: {

        },
    },
    cardBody: {
        padding: 16
    },
    greenButton: {
        margin: '20px 0',
        minWidth: 100,

    },
    table2: {
        width: '100%'
    },
    table2Header: {
        display: 'flex'
    },
    table2head: {
        backgroundColor: '#0F84A9',
        color: '#fff',
        padding: '10px 6px',
        fontFamily: 'Montserrat',
        fontSize: 14,
        borderRight: 'solid 1px #fff',
        textAlign: 'center',
        '&:last-child': {
            borderRightWidth: 0,
        },
        [theme.breakpoints.up('lg')]: {

        },
        [theme.breakpoints.between('md', 'lg')]: {

        },
        [theme.breakpoints.down('sm')]: {

        },
    },
    table2Row: {
        display: 'flex',
        // border: '1px solid #0F84A9',
        // borderBottomLeftRadius: 8,
        // borderBottomRightRadius: 8,
    },
    table2Cell: {
        padding: '10px 6px',
        color: '#043B5D',
        fontFamily: 'Montserrat',
        fontSize: 14,
        border: '1px solid #0F84A9',
        borderLeftWidth: 0,
        textAlign: 'center',
        '&:first-child': {
            borderBottomLeftRadius: 8,
            borderLeftWidth: 1,
        },
        '&:last-child': {
            borderBottomRightRadius: 8,
        },
    },
    width15: {
        width: '15%'
    },
    width20: {
        width: '20%'
    },
    width25: {
        width: '25%'
    },
    width30: {
        width: '30%'
    },
    width80: {
        width: '80%'
    },
    cardContainer3: {
        margin: '30px 0',
        width: '840px'
    },
    table3Header: {
        display: 'flex'
    },
    table3head: {
        backgroundColor: '#0F84A9',
        color: '#fff',
        padding: '10px 6px',
        fontFamily: 'Montserrat',
        fontSize: 14,
        textAlign: 'center',
        [theme.breakpoints.up('lg')]: {

        },
        [theme.breakpoints.between('md', 'lg')]: {

        },
        [theme.breakpoints.down('sm')]: {

        },
    },
    table3Cell: {
        padding: '10px 6px',
        color: '#043B5D',
        fontFamily: 'Montserrat',
        fontSize: 14,
        border: '1px solid #0F84A9',
        borderLeftWidth: 0,
        borderBottomWidth: 0,
        textAlign: 'center',
        '&:first-child':{
            borderLeftWidth: 1,
        },
    },
    totalRow:{
        display:'flex',
        justifyContent:'space-between',
        border:'solid 1px #0F84A9',
        borderBottomLeftRadius:8,
        borderBottomRightRadius:8,
    },
    totalCell:{
        padding: '10px 6px',
        color: '#043B5D',
        fontFamily: 'Montserrat',
        fontSize: 14,
        border: '1px solid #0F84A9',
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
        borderBottomWidth: 0,
        textAlign: 'center',
        '&:first-child':{
            // borderLeftWidth: 1,
        },
        '&:last-child':{
            // borderRightWidth: 1,
        },
    },
    leftAlgin:{
        textAlign:'left'
    }
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

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);


const InvoiceDetail = props => {
    const classes = useStyles();
    const handleClose = () => {
        props.toggleInvoiceDetailDlg(false);
    };

    const onClickTrack = () => {
        console.log('clicked button')
    }

    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={props.isShowInvoiceDetailDlg}
            // className={classes.root}
            classes={{ paper: classes.dialogPaper }}
        >
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                <div className={classes.header}>
                    <img src='./images/svg/empty_profile.svg' alt='profile' />
                    <Typography className={classes.headerTitle}>Invoice</Typography>
                </div>

            </DialogTitle>
            <DialogContent >
                <Typography className={classes.title}>Lab Name</Typography>
                <Typography className={classes.description}>
                    123 Any Street<br />
                    Anytown, ST 12345-1234<br /><br />

                    000.000.0000<br />
                    name@companyname.com
                </Typography>

                <Grid container className={classes.cardContainer} spacing={0}>
                    <Grid item xs={12} lg={4} >
                        <div className={classes.card}>
                            <div className={classes.cardHeader}>
                                <Typography className={classes.cardTitle}>
                                    BILL TO
                                </Typography>
                            </div>
                            <div className={classes.cardBody}>
                                <Typography className={classes.description}>
                                    Company Name
                                </Typography><br />
                                <Typography className={classes.description}>
                                    123 Any Street
                                </Typography>
                                <Typography className={classes.description}>
                                    Anytown, ST 12345-1234
                                </Typography>
                                <br />
                                <Typography className={classes.description}>
                                    Att: First name, Last name
                                </Typography>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} lg={4} >
                        <div className={classes.card}>
                            <div className={classes.cardHeader}>
                                <Typography className={classes.cardTitle}>
                                    SHIP TO
                                </Typography>
                            </div>
                            <div className={classes.cardBody}>
                                <Typography className={classes.description}>
                                    Company Name
                                </Typography><br />
                                <Typography className={classes.description}>
                                    123 Any Street
                                </Typography>
                                <Typography className={classes.description}>
                                    Anytown, ST 12345-1234
                                </Typography>
                                <br />
                                <Typography className={classes.description}>
                                    Att: First name, Last name
                                </Typography>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} lg={4} >
                        <div className={classes.card}>
                            <div className={classes.cardHeader}>
                                <Typography className={classes.cardTitle}>
                                    TRACKING NUMBER
                                </Typography>
                            </div>
                            <div className={classes.cardBody}>
                                <Typography className={classes.description}>
                                    12jh576823nk12344
                                </Typography>
                            </div>
                        </div>
                        <GreenButton label="TRACK" className={classes.greenButton} onClick={() => onClickTrack()} />
                    </Grid>
                </Grid>

                <div className={classes.cardContainer2}>
                    <Grid container className={classes.cardContainer} spacing={0}>
                        <Grid item xs={12} sm={12} >
                            <div className={classes.table2}>

                                <div className={classes.table2Header} >
                                    <div className={clsx(classes.table2head, classes.width15)}> DATE</div>
                                    <div className={clsx(classes.table2head, classes.width25)}> INVOICE NUMBER</div>
                                    <div className={clsx(classes.table2head, classes.width25)}> PO NUMBER</div>
                                    <div className={clsx(classes.table2head, classes.width15)}> TERMS</div>
                                    <div className={clsx(classes.table2head, classes.width25)}> ORDER FILLED BY</div>
                                </div>
                                <div className={classes.table2Row} >
                                    <div className={clsx(classes.table2Cell, classes.width15)}> 00/00/2020</div>
                                    <div className={clsx(classes.table2Cell, classes.width25)}> LAB4892474984376</div>
                                    <div className={clsx(classes.table2Cell, classes.width25)}> LAB4892474984376</div>
                                    <div className={clsx(classes.table2Cell, classes.width15)}> 30 days</div>
                                    <div className={clsx(classes.table2Cell, classes.width25)}> Last name, First name</div>
                                </div>
                            </div>
                        </Grid>
                    </Grid>

                </div>
                <div className={classes.cardContainer3}>
                    <Grid container className={classes.cardContainer} spacing={0}>
                        <Grid item xs={12} sm={12} >
                            <div className={classes.table2}>

                                <div className={classes.table3Header} >
                                    <div className={clsx(classes.table3head, classes.width20)}>ITEM</div>
                                    <div className={clsx(classes.table3head, classes.width30)}>LOT NUMBER</div>
                                    <div className={clsx(classes.table3head, classes.width30)}>QUANTITY</div>
                                    <div className={clsx(classes.table3head, classes.width20)}>PRICE</div>
                                </div>
                                <div className={classes.table2Row} >
                                    <div className={clsx(classes.table3Cell, classes.width20, classes.leftAlgin)}> Serology Test</div>
                                    <div className={clsx(classes.table3Cell, classes.width30)}> 12495837ght04tR</div>
                                    <div className={clsx(classes.table3Cell, classes.width30)}> 230</div>
                                    <div className={clsx(classes.table3Cell, classes.width20)}> $2,300</div>                                    
                                </div>
                                <div className={classes.table2Row} >
                                    <div className={clsx(classes.table3Cell, classes.width20, classes.leftAlgin)}> PCR Test</div>
                                    <div className={clsx(classes.table3Cell, classes.width30)}> 12495837ght04tR</div>
                                    <div className={clsx(classes.table3Cell, classes.width30)}> 25</div>
                                    <div className={clsx(classes.table3Cell, classes.width20)}> $2,500</div>                                    
                                </div>
                                <div className={classes.table2Row} >
                                    <div className={clsx(classes.table3Cell, classes.width20, classes.leftAlgin)}> Sub Total</div>
                                    <div className={clsx(classes.table3Cell, classes.width30)}> </div>
                                    <div className={clsx(classes.table3Cell, classes.width30)}> </div>
                                    <div className={clsx(classes.table3Cell, classes.width20)}> $4,700</div>                                    
                                </div>
                                <div className={classes.table2Row} >
                                    <div className={clsx(classes.table3Cell, classes.width20, classes.leftAlgin)}> Shipping</div>
                                    <div className={clsx(classes.table3Cell, classes.width30)}> </div>
                                    <div className={clsx(classes.table3Cell, classes.width30)}> </div>
                                    <div className={clsx(classes.table3Cell, classes.width20)}> $200</div>
                                </div>
                                <div className={ classes.totalRow} >
                                    <div className={clsx(classes.totalCell, classes.width20, classes.leftAlgin)}> TOTAL</div>
                                    <div className={clsx(classes.totalCell, classes.width30)}> </div>
                                    <div className={clsx(classes.totalCell, classes.width30)}> </div>
                                    <div className={clsx(classes.totalCell, classes.width20)}> $4,900</div>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </div>

            </DialogContent>
            <DialogActions>
                <GreenButton label="EMAIL" className={classes.greenButton} onClick={() => onClickTrack()} />
                <GreenButton label="PRINT" className={classes.greenButton} onClick={() => onClickTrack()} />
            </DialogActions>
        </Dialog >

    )
}

export default InvoiceDetail;