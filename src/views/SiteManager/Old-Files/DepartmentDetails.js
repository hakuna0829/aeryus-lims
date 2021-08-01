import React, { useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
    Grid,
    Button,
    Paper,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    CircularProgress
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import {
    ValidatorForm,
    TextValidator,
} from 'react-material-ui-form-validator';
import brandStyles from 'theme/brand';
import { Edit } from 'icons';
import {
    IconButton,
    // CircularProgress 
} from '@material-ui/core';
import { getLocations } from 'actions/api';
import { showFailedDialog, showErrorDialog } from 'actions/dialogAlert';
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
}));

const ActiveButton = withStyles(theme => ({
    root: {
        color: '#25DD83',
        borderColor: '#25DD83',
        borderRadius: 20,
        textTransform: 'Capitalize',
        fontSize: '26px',
        fontWeight: 500,
        letterSpacing: 0,
        lineHeight: '35px',
        '&:hover': {},
        [theme.breakpoints.up('lg')]: {
            fontSize: '26px'
        },
        [theme.breakpoints.between('sm', 'lg')]: {
            fontSize: '20px'
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: '18px'
        }
    }
}))(Button);

const DepartmentDetails = props => {
    // const { history } = props;
    const classes = useStyles();
    const brandClasses = brandStyles();
    const [departmentDetailsState, setDepartmentDetailsState] = useState({
        location_id: '',
        location_name: '',
        name: '',
        head: '',
        phone: '',
        extension: '',
        email: '',
        active: false
    });
    const [setFormError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [locations, setLocations] = useState([]);
    const [editSection, setEditSection] = useState({});

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

    const ActionButton = data => {
        const isActive = data.row && data.row.active;
        console.log('data', data)
        return (
            <div className={classes.actionButtonRow}>
                <ActiveButton
                    variant="outlined"
                    disabled={isActive}
                    style={{ marginRight: 15 }}
                    onClick={() => toggleDepartmentStatus({ ...data.row, active: true })}>
                    Activate
                </ActiveButton>
                <ActiveButton
                    variant="outlined"
                    disabled={!isActive}
                    className={isActive ? classes.buttonRed : ''}
                    style={{ marginLeft: 15 }}
                    onClick={() => toggleDepartmentStatus({ ...data.row, active: false })}>
                    Deactivate
          </ActiveButton>
            </div>
        );
    };

    const handleEdit = (field, isEditing) => {
        let fieldEdit = { ...editSection };
        fieldEdit[field] = isEditing;
        setEditSection(fieldEdit);
    };

    const changeHandler = e => {
        e.persist();
        console.log(' eee ', e.target.name, e.target.value, departmentDetailsState)
        const selectedLocationId = e.target.value;
        if (e.target.name === 'location_id') {
            const matched = locations.find((location) => {
                return location._id === selectedLocationId
            });
            console.log('matched ', matched, locations);
            setDepartmentDetailsState(departmentDetailsState => ({
                ...departmentDetailsState,
                [e.target.name]: e.target.value,
                location_name: matched.name
            }));
        } else {
            setDepartmentDetailsState(departmentDetailsState => ({
                ...departmentDetailsState,
                [e.target.name]: e.target.value
            }));
        }

    };

    React.useEffect(() => {
        console.log('departmentDetailsState', departmentDetailsState)
    }, [departmentDetailsState]);

    const toggleDepartmentStatus = async department => {
        setDepartmentDetailsState(departmentDetailsState => ({
            ...departmentDetailsState,
            active: department.active
        }));
    };

    const updateDepartmentDetails = async e => {

    };

    const handleFormErrors = () => {
        setFormError(true);
        window.scrollTo(0, 0);
    };

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <div>
                    <Typography variant="h2" className={brandClasses.headerTitle2}>
                        <img src="/images/svg/department_header_icon.svg" alt="" style={{ width: 35 }} />
                        {'DEPARTMENT MANAGER'} |
                    </Typography>
                    <Typography variant="h4" className={classes.headerSubTitle}>EDIT DEPARTMENT</Typography>
                </div>

                <Button
                    variant="contained"
                    className={classes.greenBtn}
                    startIcon={<AddIcon />}
                    component={Link}
                    to="/site-manager/add-department">
                    Add Department
                </Button>
            </div>
            <div className={classes.content}>

                {isLoading ? (
                    <div className={classes.loader}>
                        {' '}
                        <CircularProgress />{' '}
                    </div>
                ) : (
                        <Grid container spacing={3}>
                            <Grid item md={3}>
                                <Paper variant="outlined" className={classes.itemPaper}>
                                    <ValidatorForm
                                        onSubmit={() => {
                                            handleEdit('location_id', false);
                                            updateDepartmentDetails();
                                        }}
                                        onError={() => handleFormErrors()}>
                                        <div>
                                            <Grid
                                                container
                                                alignItems="baseline"
                                                justify="space-between">
                                                <Grid
                                                    item
                                                    className={clsx(
                                                        classes.propertyLabel,
                                                        classes.firstPropertyLabel
                                                    )}>
                                                    {' '}
                                                    Location{' '}
                                                </Grid>
                                                <Grid item>
                                                    {editSection.location_id ? (
                                                        <IconButton onClick={() => handleEdit('location_id', false)}>
                                                            <CancelOutlinedIcon />
                                                        </IconButton>
                                                    ) : (
                                                            <IconButton onClick={() => handleEdit('location_id', true)}>
                                                                <Edit className={classes.editIcon} />
                                                            </IconButton>
                                                        )}
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <Grid container alignItems="flex-start">
                                            {editSection.location_id ? (
                                                <Grid item xs>
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
                                                    <div style={{ float: 'right' }}>
                                                        <Button
                                                            type="submit"
                                                            className={clsx(
                                                                classes.submitBtn,
                                                                brandClasses.button
                                                            )}>
                                                            <Typography variant="h4">{'Save'}</Typography>
                                                        </Button>
                                                    </div>
                                                </Grid>
                                            ) : (
                                                    <Grid
                                                        item
                                                        container
                                                        justify="flex-start"
                                                        alignItems="center">
                                                        {' '}
                                                        <Typography
                                                            variant="h5"
                                                            className={classes.propertyValue}>
                                                            {departmentDetailsState.location_name || `Location`}
                                                        </Typography>
                                                    </Grid>
                                                )}
                                        </Grid>
                                    </ValidatorForm>
                                </Paper>
                            </Grid>
                            <Grid item md={9}>
                            </Grid>

                            <Grid item md={4}>
                                <Paper variant="outlined" className={classes.itemPaper}>
                                    <ValidatorForm
                                        onSubmit={() => {
                                            handleEdit('name', false);
                                            updateDepartmentDetails();
                                        }}
                                        onError={() => handleFormErrors()}>
                                        <div>
                                            <Grid
                                                container
                                                alignItems="baseline"
                                                justify="space-between">
                                                <Grid
                                                    item
                                                    className={clsx(
                                                        classes.propertyLabel,
                                                        classes.firstPropertyLabel
                                                    )}>
                                                    {' '}
                                                    Department Name{' '}
                                                </Grid>
                                                <Grid item>
                                                    {editSection.name ? (
                                                        <IconButton onClick={() => handleEdit('name', false)}>
                                                            <CancelOutlinedIcon />
                                                        </IconButton>
                                                    ) : (
                                                            <IconButton onClick={() => handleEdit('name', true)}>
                                                                <Edit className={classes.editIcon} />
                                                            </IconButton>
                                                        )}
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <Grid container alignItems="flex-start">
                                            {editSection.name ? (
                                                <Grid item xs>
                                                    <TextValidator
                                                        className={clsx(
                                                            brandClasses.shrinkTextField,
                                                            classes.inputField
                                                        )}
                                                        placeholder="Department name"
                                                        validators={['required']}
                                                        variant="outlined"
                                                        value={departmentDetailsState.name}
                                                        classes={{ root: classes.labelRoot }}
                                                        name="name"
                                                        onChange={changeHandler}
                                                        errorMessages={['']}
                                                        InputProps={{ classes: { root: classes.inputLabel } }}
                                                        InputLabelProps={{ shrink: true }}
                                                        required
                                                    />
                                                    <div style={{ float: 'right' }}>
                                                        <Button
                                                            type="submit"
                                                            className={clsx(
                                                                classes.submitBtn,
                                                                brandClasses.button
                                                            )}>
                                                            <Typography variant="h4">{'Save'}</Typography>
                                                        </Button>
                                                    </div>
                                                </Grid>
                                            ) : (
                                                    <Grid
                                                        item
                                                        container
                                                        justify="flex-start"
                                                        alignItems="center">
                                                        {' '}
                                                        <Typography
                                                            variant="h5"
                                                            className={classes.propertyValue}>
                                                            {departmentDetailsState.name || `Department name`}
                                                        </Typography>
                                                    </Grid>
                                                )}
                                        </Grid>
                                    </ValidatorForm>
                                </Paper>
                            </Grid>
                            <Grid item md={4}>
                                <Paper variant="outlined" className={classes.itemPaper}>
                                    <ValidatorForm
                                        onSubmit={() => {
                                            handleEdit('head', false);
                                            updateDepartmentDetails();
                                        }}
                                        onError={() => handleFormErrors()}>
                                        <div>
                                            <Grid
                                                container
                                                alignItems="baseline"
                                                justify="space-between">
                                                <Grid
                                                    item
                                                    className={clsx(
                                                        classes.propertyLabel,
                                                        classes.firstPropertyLabel
                                                    )}>
                                                    {' '}
                                            Department Head{' '}
                                                </Grid>
                                                <Grid item>
                                                    {editSection.head ? (
                                                        <IconButton onClick={() => handleEdit('head', false)}>
                                                            <CancelOutlinedIcon />
                                                        </IconButton>
                                                    ) : (
                                                            <IconButton onClick={() => handleEdit('head', true)}>
                                                                <Edit className={classes.editIcon} />
                                                            </IconButton>
                                                        )}
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <Grid container alignItems="flex-start">
                                            {editSection.head ? (
                                                <Grid item xs>
                                                    <TextValidator
                                                        className={clsx(
                                                            brandClasses.shrinkTextField,
                                                            classes.inputField
                                                        )}
                                                        placeholder="Department Head Name"
                                                        validators={['required']}
                                                        variant="outlined"
                                                        value={departmentDetailsState.head}
                                                        classes={{ root: classes.labelRoot }}
                                                        name="head"
                                                        onChange={changeHandler}
                                                        errorMessages={['']}
                                                        InputProps={{ classes: { root: classes.inputLabel } }}
                                                        InputLabelProps={{ shrink: true }}
                                                        required
                                                    />
                                                    <div style={{ float: 'right' }}>
                                                        <Button
                                                            type="submit"
                                                            className={clsx(
                                                                classes.submitBtn,
                                                                brandClasses.button
                                                            )}>
                                                            <Typography variant="h4">{'Save'}</Typography>
                                                        </Button>
                                                    </div>
                                                </Grid>
                                            ) : (
                                                    <Grid
                                                        item
                                                        container
                                                        justify="flex-start"
                                                        alignItems="center">
                                                        {' '}
                                                        <Typography
                                                            variant="h5"
                                                            className={classes.propertyValue}>
                                                            {departmentDetailsState.head || `Department Head Name`}
                                                        </Typography>
                                                    </Grid>
                                                )}
                                        </Grid>
                                    </ValidatorForm>
                                </Paper>
                            </Grid>
                            <Grid item md={4}>
                            </Grid>

                            <Grid item md={4}>
                                <Paper variant="outlined" className={classes.itemPaper}>
                                    <ValidatorForm
                                        onSubmit={() => {
                                            handleEdit('phone', false);
                                            updateDepartmentDetails();
                                        }}
                                        onError={() => handleFormErrors()}>
                                        <div>
                                            <Grid
                                                container
                                                alignItems="baseline"
                                                justify="space-between">
                                                <Grid
                                                    item
                                                    className={clsx(
                                                        classes.propertyLabel,
                                                        classes.firstPropertyLabel
                                                    )}>
                                                    {' '}
                                            Phone Number{' '}
                                                </Grid>
                                                <Grid item>
                                                    {editSection.phone ? (
                                                        <IconButton onClick={() => handleEdit('phone', false)}>
                                                            <CancelOutlinedIcon />
                                                        </IconButton>
                                                    ) : (
                                                            <IconButton onClick={() => handleEdit('phone', true)}>
                                                                <Edit className={classes.editIcon} />
                                                            </IconButton>
                                                        )}
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <Grid container alignItems="flex-start">
                                            {editSection.phone ? (
                                                <Grid item xs>
                                                    <TextValidator
                                                        className={clsx(
                                                            brandClasses.shrinkTextField,
                                                            classes.inputField
                                                        )}
                                                        placeholder="Department phone"
                                                        validators={['required']}
                                                        variant="outlined"
                                                        value={departmentDetailsState.phone}
                                                        classes={{ root: classes.labelRoot }}
                                                        name="phone"
                                                        onChange={changeHandler}
                                                        errorMessages={['']}
                                                        InputProps={{ classes: { root: classes.inputLabel } }}
                                                        InputLabelProps={{ shrink: true }}
                                                        required
                                                    />
                                                    <div style={{ float: 'right' }}>
                                                        <Button
                                                            type="submit"
                                                            className={clsx(
                                                                classes.submitBtn,
                                                                brandClasses.button
                                                            )}>
                                                            <Typography variant="h4">{'Save'}</Typography>
                                                        </Button>
                                                    </div>
                                                </Grid>
                                            ) : (
                                                    <Grid
                                                        item
                                                        container
                                                        justify="flex-start"
                                                        alignItems="center">
                                                        {' '}
                                                        <Typography
                                                            variant="h5"
                                                            className={classes.propertyValue}>
                                                            {departmentDetailsState.phone || `Department phone`}
                                                        </Typography>
                                                    </Grid>
                                                )}
                                        </Grid>
                                    </ValidatorForm>
                                </Paper>
                            </Grid>

                            <Grid item md={4}>
                                <Paper variant="outlined" className={classes.itemPaper}>
                                    <ValidatorForm
                                        onSubmit={() => {
                                            handleEdit('extension', false);
                                            updateDepartmentDetails();
                                        }}
                                        onError={() => handleFormErrors()}>
                                        <div>
                                            <Grid
                                                container
                                                alignItems="baseline"
                                                justify="space-between">
                                                <Grid
                                                    item
                                                    className={clsx(
                                                        classes.propertyLabel,
                                                        classes.firstPropertyLabel
                                                    )}>
                                                    {' '}
                                            Extension Number{' '}
                                                </Grid>
                                                <Grid item>
                                                    {editSection.extension ? (
                                                        <IconButton onClick={() => handleEdit('extension', false)}>
                                                            <CancelOutlinedIcon />
                                                        </IconButton>
                                                    ) : (
                                                            <IconButton onClick={() => handleEdit('extension', true)}>
                                                                <Edit className={classes.editIcon} />
                                                            </IconButton>
                                                        )}
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <Grid container alignItems="flex-start">
                                            {editSection.extension ? (
                                                <Grid item xs>
                                                    <TextValidator
                                                        className={clsx(
                                                            brandClasses.shrinkTextField,
                                                            classes.inputField
                                                        )}
                                                        placeholder="Extension Number"
                                                        validators={['required']}
                                                        variant="outlined"
                                                        value={departmentDetailsState.extension}
                                                        classes={{ root: classes.labelRoot }}
                                                        name="extension"
                                                        onChange={changeHandler}
                                                        errorMessages={['']}
                                                        InputProps={{ classes: { root: classes.inputLabel } }}
                                                        InputLabelProps={{ shrink: true }}
                                                        required
                                                    />
                                                    <div style={{ float: 'right' }}>
                                                        <Button
                                                            type="submit"
                                                            className={clsx(
                                                                classes.submitBtn,
                                                                brandClasses.button
                                                            )}>
                                                            <Typography variant="h4">{'Save'}</Typography>
                                                        </Button>
                                                    </div>
                                                </Grid>
                                            ) : (
                                                    <Grid
                                                        item
                                                        container
                                                        justify="flex-start"
                                                        alignItems="center">
                                                        {' '}
                                                        <Typography
                                                            variant="h5"
                                                            className={classes.propertyValue}>
                                                            {departmentDetailsState.extension || `Extension Number`}
                                                        </Typography>
                                                    </Grid>
                                                )}
                                        </Grid>
                                    </ValidatorForm>
                                </Paper>
                            </Grid>
                            <Grid item sm={4}>
                            </Grid>

                            <Grid item md={4}>
                                <Paper variant="outlined" className={classes.itemPaper}>
                                    <ValidatorForm
                                        onSubmit={() => {
                                            handleEdit('email', false);
                                            updateDepartmentDetails();
                                        }}
                                        onError={() => handleFormErrors()}>
                                        <div>
                                            <Grid
                                                container
                                                alignItems="baseline"
                                                justify="space-between">
                                                <Grid
                                                    item
                                                    className={clsx(
                                                        classes.propertyLabel,
                                                        classes.firstPropertyLabel
                                                    )}>
                                                    {' '}
                                            Email Address{' '}
                                                </Grid>
                                                <Grid item>
                                                    {editSection.email ? (
                                                        <IconButton onClick={() => handleEdit('email', false)}>
                                                            <CancelOutlinedIcon />
                                                        </IconButton>
                                                    ) : (
                                                            <IconButton onClick={() => handleEdit('email', true)}>
                                                                <Edit className={classes.editIcon} />
                                                            </IconButton>
                                                        )}
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <Grid container alignItems="flex-start">
                                            {editSection.email ? (
                                                <Grid item xs>
                                                    <TextValidator
                                                        className={clsx(
                                                            brandClasses.shrinkTextField,
                                                            classes.inputField
                                                        )}
                                                        placeholder="Email Address"
                                                        validators={['required']}
                                                        variant="outlined"
                                                        value={departmentDetailsState.email}
                                                        classes={{ root: classes.labelRoot }}
                                                        name="email"
                                                        onChange={changeHandler}
                                                        errorMessages={['']}
                                                        InputProps={{ classes: { root: classes.inputLabel } }}
                                                        InputLabelProps={{ shrink: true }}
                                                        required
                                                    />
                                                    <div style={{ float: 'right' }}>
                                                        <Button
                                                            type="submit"
                                                            className={clsx(
                                                                classes.submitBtn,
                                                                brandClasses.button
                                                            )}>
                                                            <Typography variant="h4">{'Save'}</Typography>
                                                        </Button>
                                                    </div>
                                                </Grid>
                                            ) : (
                                                    <Grid
                                                        item
                                                        container
                                                        justify="flex-start"
                                                        alignItems="center">
                                                        {' '}
                                                        <Typography
                                                            variant="h5"
                                                            className={classes.propertyValue}>
                                                            {departmentDetailsState.email || `Email Address`}
                                                        </Typography>
                                                    </Grid>
                                                )}
                                        </Grid>
                                    </ValidatorForm>
                                </Paper>
                            </Grid>

                            <Grid item sm={8}></Grid>

                            <Grid item xs={12} sm={12}>
                                <ActionButton row={departmentDetailsState} />
                            </Grid>
                        </Grid>

                    )
                }
            </div>
        </div>
    );
};

DepartmentDetails.propTypes = {
    showFailedDialog: PropTypes.func.isRequired,
    showErrorDialog: PropTypes.func.isRequired
};
export default connect(null, { showFailedDialog, showErrorDialog })(
    DepartmentDetails
);
