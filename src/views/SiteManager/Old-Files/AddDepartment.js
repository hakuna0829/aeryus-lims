import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Grid,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    TextField,
    CircularProgress
} from '@material-ui/core';
import { getLocations } from 'actions/api';
import Typography from '@material-ui/core/Typography';
import { showFailedDialog, showErrorDialog } from 'actions/dialogAlert';
import {
    ValidatorForm,
} from 'react-material-ui-form-validator';
import brandStyles from 'theme/brand';
import clsx from 'clsx';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(0),
    },
    content: {
        padding: '10px 32px',
        // textAlign: 'center'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2),
        '& div': {
            display: 'flex',
            alignItems: 'center'
        }
    },
    headerSubTitle: {
        color: theme.palette.brandText,
        marginLeft: 8
    },
    pageBar: {
        backgroundColor: 'rgba(15,132,169,0.8)'
    },
    titleContainer: {
        padding: '12px 5px !important'
    },
    title: {
        color: '#0F84A9',
        lineHeight: '27px'
    },
    greenBtnContainer: {
        padding: '12px 5px !important',
        '@media (max-width:620px)': {
            justifyContent: 'center'
        }
    },
    greenBtn: {
        backgroundColor: theme.palette.brandGreen,
        color: theme.palette.white,
        textTransform: 'capitalize',
        fontSize: '16px',
        borderRadius: '10px',
        '&:hover': {
            backgroundColor: theme.palette.brandDark
        }
    },
    locationContainer: {
        '@media (max-width:730px)': {
            justifyContent: 'center'
        }
    },
    location: {
        margin: '50px 0'
    },
    loader: {
        height: '100px',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    noLocations: {
        height: '50px',
        marginTop: '10px'
    },
    itemPaper: {
        border: '1px solid #0F84A9',
        padding: '20px',
        position: 'relative',
        marginBottom: '20px',
        borderRadius: 10,
        boxShadow: '4px 4px 8px 2px rgba(15,132,169,0.15)'
    },
    propertyLabel: {
        color: theme.palette.brandDark,
        fontFamily: 'Montserrat',
        fontSize: '22px',
        fontWeight: 500,

        textAlign: 'left',
        [theme.breakpoints.up('lg')]: {
            fontSize: '22px',
            lineHeight: '37px'
        },
        [theme.breakpoints.between('md', 'lg')]: {
            fontSize: '20px',
            lineHeight: '30px'
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: '16px',
            lineHeight: '24px'
        }
    },
    propertyValue: {
        color: theme.palette.brandGray,
        fontSize: '22px',
        '&:last-child': {
            marginBottom: 0
        },
        [theme.breakpoints.up('lg')]: {
            fontSize: '22px',
            lineHeight: '37px'
        },
        [theme.breakpoints.between('md', 'lg')]: {
            fontSize: '20px',
            lineHeight: '30px'
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: '16px',
            lineHeight: '24px'
        }
    },
    submitBtn: {
        marginTop: theme.spacing(2),
        '& .MuiTypography-h4': {
            color: theme.palette.white,
            fontSize: '16px'
        }
    },
    actionButtonRow: {
        display: 'flex',
        justifyContent: 'center',
        [theme.breakpoints.down('sm')]: {
            marginTop: 20
        }
    },
    buttonRed: {
        color: '#DD2525 !important',
        borderColor: '#DD2525 !important'
    },
    footer: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginRight: theme.spacing(4)
    }
}));

const AddDepartment = props => {
    // const { history } = props;
    const classes = useStyles();
    const brandClasses = brandStyles();
    const [setFormError] = useState(false);
    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [departmentDetailsState, setDepartmentDetailsState] = useState({
        location_id: '',
        name: '',
        head: '',
        phone: '',
        extension: '',
        email: '',
        active: false
    });

    const updateDepartmentDetails = async e => {

    };
    React.useEffect(() => {
        fetchLocations();
        // eslint-disable-next-line react-hooks/exhaustive-deps

    }, []);

    const fetchLocations = () => {
        setIsLoading(true);
        getLocations()
            .then(res => {
                setIsLoading(false);
                if (res.data.success) {
                    setLocations(res.data.data);
                } else {
                    showFailedDialog(res);
                }
            })
            .catch(error => {
                setIsLoading(false);
                showErrorDialog(error);
                console.error(error);
            });
    };

    const handleFormErrors = () => {
        setFormError(true);
        window.scrollTo(0, 0);
    };

    const changeHandler = e => {
        e.persist();

        setDepartmentDetailsState(departmentDetailsState => ({
            ...departmentDetailsState,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <div>
                    <Typography variant="h2" className={brandClasses.headerTitle2}>
                        <img src="/images/svg/department_header_icon.svg" alt="" style={{ width: 35 }} />
                        {'DEPARTMENT MANAGER'} |
                    </Typography>
                    <Typography variant="h4" className={classes.headerSubTitle}>ADD DEPARTMENT</Typography>
                </div>

            </div>
            <div className={classes.content}>
                {isLoading ? (
                    <div className={classes.loader}>
                        {' '}
                        <CircularProgress />{' '}
                    </div>
                ) : (
                        <ValidatorForm
                            onSubmit={() => {
                                updateDepartmentDetails();
                            }}
                            onError={() => handleFormErrors()}>
                            <Grid container spacing={3}>
                                <Grid item md={3}>

                                    <FormControl
                                        className={brandClasses.shrinkTextField}
                                        required
                                        fullWidth
                                        variant="outlined"
                                    >
                                        <InputLabel shrink className={brandClasses.selectShrinkLabel}>Locations</InputLabel>
                                        <Select
                                            onChange={changeHandler}
                                            label="Locations* "
                                            name="location_id"
                                            displayEmpty
                                            value={departmentDetailsState.location_id || ''}
                                        >
                                            <MenuItem value=''>
                                                <Typography className={brandClasses.selectPlaceholder}>Select Location</Typography>
                                            </MenuItem>
                                            {locations.map((location, index) => (
                                                <MenuItem key={index} value={location._id}>{location.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                </Grid>
                                <Grid item md={9}></Grid>

                                <Grid item sm={4}>
                                    <TextField
                                        type="text"
                                        label="Department Name"
                                        placeholder="Enter department"
                                        name="name"
                                        className={brandClasses.shrinkTextField}
                                        onChange={changeHandler}
                                        value={departmentDetailsState.name || ''}
                                        required
                                        fullWidth
                                        InputProps={{ classes: { root: classes.inputLabel } }}
                                        InputLabelProps={{ shrink: true }}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item sm={4}>
                                    <TextField
                                        type="text"
                                        label="Department Head"
                                        placeholder="Enter Department Head Name"
                                        name="head"
                                        className={brandClasses.shrinkTextField}
                                        onChange={changeHandler}
                                        value={departmentDetailsState.head || ''}
                                        required
                                        fullWidth
                                        InputProps={{ classes: { root: classes.inputLabel } }}
                                        InputLabelProps={{ shrink: true }}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item sm={4}></Grid>

                                <Grid item sm={4}>
                                    <TextField
                                        type="text"
                                        label="Phone Number"
                                        placeholder="Enter phone number"
                                        name="phone"
                                        className={brandClasses.shrinkTextField}
                                        onChange={changeHandler}
                                        value={departmentDetailsState.phone || ''}
                                        required
                                        fullWidth
                                        InputProps={{ classes: { root: classes.inputLabel } }}
                                        InputLabelProps={{ shrink: true }}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item sm={4}>
                                    <TextField
                                        type="text"
                                        label="Extension Number"
                                        placeholder="Enter extension number"
                                        name="extension"
                                        className={brandClasses.shrinkTextField}
                                        onChange={changeHandler}
                                        value={departmentDetailsState.extension || ''}
                                        required
                                        fullWidth
                                        InputProps={{ classes: { root: classes.inputLabel } }}
                                        InputLabelProps={{ shrink: true }}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item sm={4}></Grid>

                                <Grid item sm={4}>
                                    <TextField
                                        type="text"
                                        label="Email Address"
                                        placeholder="Enter email address"
                                        name="email"
                                        className={brandClasses.shrinkTextField}
                                        onChange={changeHandler}
                                        value={departmentDetailsState.email || ''}
                                        required
                                        fullWidth
                                        InputProps={{ classes: { root: classes.inputLabel } }}
                                        InputLabelProps={{ shrink: true }}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item sm={8}></Grid>
                            </Grid>
                            <div className={classes.footer}>
                                <Button
                                    className={clsx(classes.submitButton, brandClasses.button)}
                                    type="submit">
                                    ADD
                        </Button>
                            </div>
                        </ValidatorForm>
                    )
                }
            </div>
        </div>
    );
};

AddDepartment.propTypes = {
    showFailedDialog: PropTypes.func.isRequired,
    showErrorDialog: PropTypes.func.isRequired
};
export default connect(null, { showFailedDialog, showErrorDialog })(
    AddDepartment
);