import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography } from '@material-ui/core';
// import {
//   ThemeProvider,
//   createMuiTheme,
// } from '@material-ui/core/styles';
import SearchBar from '../../../../layouts/Main/components/SearchBar';
import CustomSelectBox from '../../../../components/SelectBox';
import Card from './Card';
import { showFailedDialog, showErrorDialog } from 'actions/dialogAlert';
import { getTestings } from 'actions/api';
import moment from 'moment';
import brandStyles from 'theme/brand';

// const theme = createMuiTheme({
//   breakpoints: {
//     values: {
//       xs: 0,
//       sm: 600,
//       md: 960,
//       lg: 1480,
//       xl: 1920,
//     },
//   },
// })
const useStyles = makeStyles(theme => ({
  root: {
    padding: 0,
    // paddingLeft: theme.spacing(2)
    width: '100%',
    fontFamily: 'Montserrat'
  },
  header: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center'
  },
  headerRight: {
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  pageTitle: {
    color: '#043B5D',
    fontSize: 24,
    fontFamily: 'Montserrat',
    fontWeight: 500
  },
  pageTitleIcon: {
    paddingRight: 10
  },
  calendar: {
    margin: '0 auto'
  },
  tableRow1: {
    backgroundColor: 'rgba(15,132,169,0.15)',
    '&:hover': {
      backgroundColor: 'rgba(15,132,169,0.15) !important'
    }
  },
  tableRow2: {
    backgroundColor: 'white'
  },
  tablehead: {
    color: '#0F84A9',
    fontSize: 16,
    fontFamily: 'Montserrat',
    fontWeight: 500
  },
  tableCell: {
    color: '#0F84A9',
    fontSize: 14,
    fontWeight: 500,
    fontFamily: 'Montserrat',
    alignItems: 'center'
  },
  tableCellRed: {
    color: '#f00',
    fontSize: 14,
    fontWeight: 500,
    fontFamily: 'Montserrat',
    alignItems: 'center'
  },
  statusCell: {
    color: '#0F84A9',
    fontSize: 14,
    fontWeight: 500,
    fontFamily: 'Montserrat',
    display: 'flex',
    alignItems: 'center'
  },
  statusCellLabel: {
    paddingLeft: 10
  },

  tableActionBar: {
    padding: theme.spacing(1),
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    margin: '0px auto'
  },
  searchBar: {
    paddingRight: 20
  },
  settingIconBox: {
    width: '50px',
    height: '50px',
    display: 'block',

    fontFamily: 'verdana',
    fontSize: '22px',
    padding: 0,
    margin: 0,
    border: 'solid 1px rgba(155,155,155,0.5)',
    outline: 0,
    lineHeight: '50px',
    textAlign: 'center',
    cursor: 'pointer',
    color: '#FFFFFF',
    background: '#fff'
  },
  selectOption: {
    margin: '20px'
  },
  cardContainer: {
    paddingLeft: 15
    // border:'solid blue 1px'
  },
  card: {
    // border:'solid green 1px',
    margin: '0 auto'
  }
}));

const Content = props => {
  const { showFailedDialog, showErrorDialog } = props;
  const brandClasses = brandStyles();
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [refetch, setRefetch] = useState(0);

  const [cardData, setCardData] = useState({ type: 'pending', data: [] });
  const [cardData2, setCardData2] = useState({ type: 'negative', data: [] });
  const [cardData3, setCardData3] = useState({ type: 'positive', data: [] });

  useEffect(() => {
    console.log('Content useEffect');
    getTestings()
      .then(async res => {
        if (res.data.success) {
          const { cardData, cardData2, cardData3 } = await sortTesting(
            res.data.data
          );
          setCardData(cardData);
          setCardData2(cardData2);
          setCardData3(cardData3);
        } else {
          showFailedDialog(res);
        }
      })
      .catch(error => {
        showErrorDialog(error);
      });

    const sortTesting = async testing => {
      let cardData = {};
      cardData.type = 'pending';
      cardData.data = await filterTesting(testing, 'All');
      cardData.total = cardData.data.length;
      let cardData2 = {};
      cardData2.type = 'negative';
      cardData2.data = await filterTesting(testing, 'Negative');
      cardData2.total = cardData2.data.length;
      let cardData3 = {};
      cardData3.type = 'positive';
      cardData3.data = await filterTesting(testing, 'Positive');
      cardData3.total = cardData3.data.length;
      return {
        cardData,
        cardData2,
        cardData3
      };
    };
  }, [showFailedDialog, showErrorDialog, refetch]);

  const filterTesting = async (testing, type) => {
    let data = [];
    testing.forEach(t => {
      if (t.result === type) {
        data.push({
          firstName: t.dependent_id
            ? t.dependent_id.first_name
            : t.user_id.first_name,
          lastName: t.dependent_id
            ? t.dependent_id.last_name
            : t.user_id.last_name,
          locaiton: t.location_id.name,
          collected_timestamp: t.collected_timestamp ? moment.utc(t.collected_timestamp).format('MM/DD/YYYY') : '',
          type_type: t.test_type,
          id: t.user_id.verification_id,
          data: t
        });
      }
    });
    return data;
  };

  const onClickSearchInput = event => {
    console.log('isOpen', isOpen, event);
  };

  const statusData = [
    { value: 0, label: 'Status: All' },
    { value: 1, label: 'Case 1' },
    { value: 2, label: 'Case 2' },
    { value: 3, label: 'Case 3' }
  ];

  const dateData = [
    { value: 0, label: 'Date: Today' },
    { value: 1, label: 'Date: Yesterday' }
  ];

  return (
    <div className={classes.root}>
      {/* <ThemeProvider theme={theme}> */}
      <Grid container className={classes.container} spacing={0}>
        <Grid item xs={12} sm={4} className={classes.header}>
          <img
            src="/images/svg/results_icon.svg"
            alt=""
            style={{ width: 30 }}
          />
          &ensp;
          <Typography variant="h3" className={brandClasses.headerTitle}>
            RESULTS MANAGER
          </Typography>
        </Grid>
        <Grid item xs={12} sm={8} className={classes.tableActionBar}>
          <CustomSelectBox className={classes.selectOption} data={statusData} />
          <CustomSelectBox className={classes.selectOption} data={dateData} />
          <SearchBar
            className={classes.searchBar}
            onClick={onClickSearchInput}
            toggleOpen={setIsOpen}
            isOpen={isOpen}
          />
        </Grid>
      </Grid>

      <Grid container className={classes.cardContainer} spacing={0}>
        <Grid item xs={12} sm={12} md={4} lg={4} className={classes.card}>
          <Card data={cardData} setRefetch={setRefetch} />
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4} className={classes.card}>
          <Card data={cardData2} />
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4} className={classes.card}>
          <Card data={cardData3} />
        </Grid>
      </Grid>
      {/* </ThemeProvider> */}
    </div>
  );
};

Content.propTypes = {
  showFailedDialog: PropTypes.func.isRequired,
  showErrorDialog: PropTypes.func.isRequired
};

export default connect(null, { showFailedDialog, showErrorDialog })(Content);
