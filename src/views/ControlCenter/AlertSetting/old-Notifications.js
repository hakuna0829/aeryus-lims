import React, { useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
    Typography,
    Grid,
    Tooltip
} from '@material-ui/core';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// import CheckButton from 'components/CheckButton';
import brandStyles from 'theme/brand';
import HelpIcon from '@material-ui/icons/Help';

const useStyles = makeStyles(theme => ({
    root: {
        // padding: `${theme.spacing(2)}px 0px`,
    },
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
        marginLeft: 8
    },
    container: {
        alignItems: 'center',
        borderBottom: `solid 1px ${theme.palette.brandDark}`,
        padding:'8px 0',
        '&:last-child': {
            borderBottom: 'solid 0px',
        }
    },
    footer: {
        display: 'flex',
        width: '80%',
        margin: '0 auto',
        justifyContent: 'flex-end'
    },
    upContent: {
        padding: `0 ${theme.spacing(2)}px`,
        [theme.breakpoints.up('md')]: {
            padding: `0 ${theme.spacing(2)}px`,
        },
        [theme.breakpoints.up('lg')]: {
            padding: `0 ${theme.spacing(3)}px`,
        },
        paddingTop: '0px'
    },
}));

const IOSSwitch = withStyles((theme) => ({
    root: {
        width: 42,
        height: 26,
        padding: 0,
        margin: theme.spacing(1),
    },
    switchBase: {
        padding: 1,
        '&$checked': {
            transform: 'translateX(16px)',
            color: theme.palette.common.white,
            '& + $track': {
                backgroundColor: '#0F84A9',
                opacity: 1,
                border: 'none',
            },
        },
        '&$focusVisible $thumb': {
            color: '#52d869',
            border: '6px solid #fff',
        },
    },
    thumb: {
        width: 24,
        height: 24,
    },
    track: {
        borderRadius: 26 / 2,
        border: `1px solid ${theme.palette.grey[400]}`,
        backgroundColor: theme.palette.brandGray,
        opacity: 1,
        transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {},
    focusVisible: {},
}))(({ classes, ...props }) => {
    return (
        <Switch
            focusVisibleClassName={classes.focusVisible}
            disableRipple
            classes={{
                root: classes.root,
                switchBase: classes.switchBase,
                thumb: classes.thumb,
                track: classes.track,
                checked: classes.checked,
            }}
            {...props}
        />
    );
});

const Notifications = (props) => {

    const classes = useStyles();
    const brandClasses = brandStyles();
    const [didModified, setDidModified] = useState(false);
    const [formState, setFormState] = useState({
        checkedNewLocation: true,
        checkedNewDepartment: false,
        checkedTestingProtocol: false,
        checkedProviderInfomation: false,
        checkedNewUser: false,
        checkedUserUpdate: false,
        checkedTestingHistory: false,
        checkedWorkplaceHistory: false,
        checkedTestTracker: false,
        checkedResultedTests: false,
        checkedUser: false,
        checkedDepartment: false,
        checkedSite: false,
    });


    const handleChange = e => {
        e.persist();
        if (!didModified) setDidModified(true);
        console.log(e.target.type)
        if (e.target.type === 'checkbox') {
            setFormState(formState => ({
                ...formState,
                [e.target.name]: e.target.checked
            }));
        } else {
            setFormState(formState => ({
                ...formState,
                [e.target.name]: e.target.value
            }));
        }

    };

    const handleSubmit = event => {
        event.preventDefault();
    };

    return (
        <div className={classes.root}>
            <div className={classes.header} >
                <div className={classes.subHeader}>
                    {/* <img src="/images/svg/building_icon.svg" alt="" />&ensp; */}
                    <Typography variant="h2" className={brandClasses.headerTitle}>
                        {'NOTIFICATIONS '}
                    </Typography>
                    <Typography variant="h4" className={classes.headerSubTitle}>
                        {/* {'EDIT LOCATION'} */}
                        <sup>
                            {' '}
                            <Tooltip title="NOTIFICATIONS" placement="right-start">
                                <HelpIcon />
                            </Tooltip>{' '}
                        </sup>
                    </Typography>
                </div>
            </div>


            <form
                onSubmit={handleSubmit}
            >
                <div className={brandClasses.subHeaderBlueDark}>
                    <Typography variant="h5" >LOCATION MANAGER</Typography>
                </div>
                <div className={classes.upContent}>
                    <Grid container className={classes.container}>
                        <Grid item md={4}>
                            <Typography variant="h5" >New Location</Typography>
                        </Grid>
                        <Grid item md={8}>
                            <FormControlLabel
                                control={<IOSSwitch checked={formState.checkedNewLocation} onChange={handleChange} name="checkedNewLocation" />}
                                required
                                labelPlacement="top"
                                classes={{ label: classes.label }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container className={classes.container}>
                        <Grid item md={4}>
                            <Typography variant="h5" >New Department</Typography>
                        </Grid>
                        <Grid item md={8}>
                            <FormControlLabel
                                control={<IOSSwitch checked={formState.checkedNewDepartment} onChange={handleChange} name="checkedNewDepartment" />}
                                required
                                labelPlacement="top"
                                classes={{ label: classes.label }}
                            />

                        </Grid>
                    </Grid>
                    <Grid container className={classes.container}>
                        <Grid item md={4}>
                            <Typography variant="h5" >Testing Protocol</Typography>
                        </Grid>
                        <Grid item md={8}>
                            <FormControlLabel
                                control={<IOSSwitch checked={formState.checkedTestingProtocol} onChange={handleChange} name="checkedTestingProtocol" />}
                                required
                                labelPlacement="top"
                                classes={{ label: classes.label }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container className={classes.container}>
                        <Grid item md={4}>
                            <Typography variant="h5" >Provider Information</Typography>
                        </Grid>
                        <Grid item md={8}>
                            <FormControlLabel
                                control={<IOSSwitch checked={formState.checkedProviderInfomation} onChange={handleChange} name="checkedProviderInfomation" />}
                                required
                                labelPlacement="top"
                                classes={{ label: classes.label }}
                            />
                        </Grid>
                    </Grid>
                </div>

                <div className={brandClasses.subHeaderBlueDark}>
                    <Typography variant="h5" >USER MANAGER</Typography>
                </div>
                <div className={classes.upContent}>
                    <Grid container className={classes.container}>
                        <Grid item md={4}>
                            <Typography variant="h5" >New User</Typography>
                        </Grid>
                        <Grid item md={8}>
                            <FormControlLabel
                                control={<IOSSwitch checked={formState.checkedNewUser} onChange={handleChange} name="checkedNewUser" />}
                                required
                                labelPlacement="top"
                                classes={{ label: classes.label }}
                            />

                        </Grid>
                    </Grid>
                    <Grid container className={classes.container}>
                        <Grid item md={4}>
                            <Typography variant="h5" >User Updates</Typography>
                        </Grid>
                        <Grid item md={8}>
                            <FormControlLabel
                                control={<IOSSwitch checked={formState.checkedUserUpdate} onChange={handleChange} name="checkedUserUpdate" />}
                                required
                                labelPlacement="top"
                                classes={{ label: classes.label }}
                            />

                        </Grid>
                    </Grid>
                    <Grid container className={classes.container}>
                        <Grid item md={4}>
                            <Typography variant="h5" >Testing History</Typography>
                        </Grid>
                        <Grid item md={8}>
                            <FormControlLabel
                                control={<IOSSwitch checked={formState.checkedTestingHistory} onChange={handleChange} name="checkedTestingHistory" />}
                                required
                                labelPlacement="top"
                                classes={{ label: classes.label }}
                            />

                        </Grid>
                    </Grid>
                    <Grid container className={classes.container}>
                        <Grid item md={4}>
                            <Typography variant="h5" >Workplace Entry</Typography>
                        </Grid>
                        <Grid item md={8}>
                            <FormControlLabel
                                control={<IOSSwitch checked={formState.checkedWorkplaceHistory} onChange={handleChange} name="checkedWorkplaceHistory" />}
                                required
                                labelPlacement="top"
                                classes={{ label: classes.label }}
                            />

                        </Grid>
                    </Grid>
                </div>

                <div className={brandClasses.subHeaderBlueDark}>
                    <Typography variant="h5" >LAB MANAGER</Typography>
                </div>
                <div className={classes.upContent}>
                    <Grid container className={classes.container}>
                        <Grid item md={4}>
                            <Typography variant="h5" >Test Tracker</Typography>
                        </Grid>
                        <Grid item md={8}>
                            <FormControlLabel
                                control={<IOSSwitch checked={formState.checkedTestTracker} onChange={handleChange} name="checkedTestTracker" />}
                                required
                                labelPlacement="top"
                                classes={{ label: classes.label }}
                            />

                        </Grid>
                    </Grid>
                    <Grid container className={classes.container}>
                        <Grid item md={4}>
                            <Typography variant="h5" >Resulted Tests</Typography>
                        </Grid>
                        <Grid item md={8}>
                            <FormControlLabel
                                control={<IOSSwitch checked={formState.checkedResultedTests} onChange={handleChange} name="checkedResultedTests" />}
                                required
                                labelPlacement="top"
                                classes={{ label: classes.label }}
                            />

                        </Grid>
                    </Grid>
                </div>

                <div className={brandClasses.subHeaderBlueDark}>
                    <Typography variant="h5" >APPOINTMENT MANAGER</Typography>
                </div>
                <div className={classes.upContent}>
                    <Grid container className={classes.container}>
                        <Grid item md={4}>
                            <Typography variant="h5" >User</Typography>
                        </Grid>
                        <Grid item md={8}>
                            <FormControlLabel
                                control={<IOSSwitch checked={formState.checkedUser} onChange={handleChange} name="checkedUser" />}
                                required
                                labelPlacement="top"
                                classes={{ label: classes.label }}
                            />

                        </Grid>
                    </Grid>

                    <Grid container className={classes.container}>
                        <Grid item md={4}>
                            <Typography variant="h5" >Department</Typography>
                        </Grid>
                        <Grid item md={8}>
                            <FormControlLabel
                                control={<IOSSwitch checked={formState.checkedDepartment} onChange={handleChange} name="checkedDepartment" />}
                                required
                                labelPlacement="top"
                                classes={{ label: classes.label }}
                            />

                        </Grid>
                    </Grid>
                    <Grid container className={classes.container}>
                        <Grid item md={4}>
                            <Typography variant="h5" >Site</Typography>
                        </Grid>
                        <Grid item md={8}>
                            <FormControlLabel
                                control={<IOSSwitch checked={formState.checkedSite} onChange={handleChange} name="checkedSite" />}
                                required
                                labelPlacement="top"
                                classes={{ label: classes.label }}
                            />

                        </Grid>
                    </Grid>

                </div>

                <div className={classes.footer}>
                    <br/>
                    <br/>
                    <br/>
                </div>
            </form>
        </div>
    );
};

export default Notifications;