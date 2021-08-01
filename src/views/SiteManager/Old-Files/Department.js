import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import brandStyles from 'theme/brand';
import { Grid, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DepartmentCard from './DepartmentCard';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
// import { getLocations } from '../../actions/api';
// import { CircularProgress } from '@material-ui/core';
import { showFailedDialog, showErrorDialog } from 'actions/dialogAlert';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(0),
    },
    content: {
        // paddingTop: 50,
        textAlign: 'center'
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
        alignItems: 'center',
        '& img': {
            width: 30
        }
    },
    headerSubTitle: {
        color: theme.palette.brandText,
        marginLeft: 8,
        display: 'flex',
        alignItems: 'center'
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
    }
}));

// function clickNewButton() {
//     console.log('click new button');
//     // setIsShowAddUserDlg(true);
// }

const DepartmentOverview = props => {
    const classes = useStyles();
    const brandClasses = brandStyles();
    const [departments, setDepartments] = useState([]);
    // const [isLoading, setIsLoading] = useState(true);
    const cardContainerRef = React.useRef();
    const [containerWidth, setContainerWidth] = useState(0);
    const [cardItemWidth, setCardItemWidth] = useState(0);
    const [cardCountRow, setCardCountRow] = useState(0);
    const [cardPadding, setCardPadding] = useState(0);
    const offset = 48;

    useEffect(() => {
        fetchDepartments();
        // eslint-disable-next-line react-hooks/exhaustive-deps

    }, []);
    useEffect(() => {

        // eslint-disable-next-line react-hooks/exhaustive-deps
        function handleResize() {
            // Set window width/height to state
            const tempContainerWidth = cardContainerRef.current.offsetWidth;

            // const itemWidth = cardItemRef.current;
            setContainerWidth(tempContainerWidth);
            setCardCountRow(Math.floor(tempContainerWidth / cardItemWidth));
            setCardPadding(Math.floor(tempContainerWidth % cardItemWidth / (cardCountRow - 1)) - 1);
            console.log('---cardPadding-- ', cardPadding)
            // if(cardPadding < 48){

            //   setCardPadding(Math.floor (tempContainerWidth%cardItemWidth / (cardCountRow - 2)) - 1);
            //   setCardCountRow(cardCountRow - 1);
            // }

            console.log('containerWidth', tempContainerWidth)
            console.log('cardItemWidth', cardItemWidth)
            console.log('cardCountRow', cardCountRow)
            console.log('cardPadding', cardPadding)
            // console.log('itemWidth', itemWidth)
            // setCellSize({
            //   width: tempWidth,
            //   height: tempWidth,
            // });
        }

        // Add event listener
        window.addEventListener("resize", handleResize);

        // Call handler right away so state gets updated with initial window size
        handleResize();

        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, [cardItemWidth, cardPadding, cardCountRow, containerWidth]);
    const fetchDepartments = () => {
        setDepartments([]);
        // setIsLoading(true);
        // getDepartments()
        //     .then(res => {
        //         // setIsLoading(false);
        //         if (res.data.success) {
        //             setDepartments(res.data.data);
        //         } else {
        //             showFailedDialog(res);
        //         }
        //     })
        //     .catch(error => {
        //         // setIsLoading(false);
        //         showErrorDialog(error);
        //         console.error(error);
        //     });
    };

    return (
        <div className={classes.root}>
            <div className={classes.header} >
                <div className={classes.subHeader}>
                    <img src="/images/svg/department_header_icon.svg" alt="" />&ensp;
                    <Typography variant="h2" className={brandClasses.headerTitle}>
                        Site Manager |
                    </Typography>
                    <Typography variant="h4" className={classes.headerSubTitle}>
                        {'DEPARTMENT MANAGER'}
                    </Typography>
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
            
            <div className={classes.root}>
            <Grid
                container
                alignItems="center"
                className={classes.locationContainer}
                justify="flex-start"
                ref={cardContainerRef}
            >
                {departments.length > 0 ? (
                    departments.map((location, indx) => (
                        <DepartmentCard
                            item={location}
                            className={classes.location}
                            key={indx}
                            offset={offset}
                            handleCardItemWidth={setCardItemWidth}
                            cardPadding={(indx + 1) % cardCountRow === 0 ? 0 : cardPadding + offset}
                            firstPadding={(indx + 1) % cardCountRow !== 1 ? 0 : offset / 2}
                        />
                    ))
                ) : (
                        <Grid
                            container
                            spacing={3}
                            direction="row"
                            justify="center"
                            alignItems="center"
                            className={classes.noLocations}>
                            No departments found
                        </Grid>
                    )}
            </Grid>
            </div>
        </div>
    );
}

DepartmentOverview.propTypes = {
    showFailedDialog: PropTypes.func.isRequired,
    showErrorDialog: PropTypes.func.isRequired
};
export default connect(null, { showFailedDialog, showErrorDialog })(
    DepartmentOverview
);