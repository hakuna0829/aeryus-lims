/* eslint-disable react/no-multi-comp */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
// import clsx from 'clsx';
import ResultsPage from './components/ResultsPage';
import { getTestingsCount } from 'actions/api';
import { numberWithCommas } from 'helpers/utility';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0),
    marginTop: 0
  },
  content: {
    padding: 0,
    width: 'calc(100% - 290px)',
    [theme.breakpoints.up('sm')]: {
      width: 'calc(100% - 290px)'
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  container: {
    margin: 0,
    width: '100%',
    padding: 0
  },
  sidebar: {
    padding: '0 !important',
    width: 290,
    [theme.breakpoints.up('lg')]: {
      width: 290
    },
    [theme.breakpoints.between('md', 'lg')]: {
      width: 290
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  tabTitle: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat',
    // fontSize: 18,
    fontWeight: 500,
    letterSpacing: 0,
    lineHeight: '24px'
  },
  tabPanel: {
    padding: '0 !important',
    '& > div': {
      padding: '0 !important'
    }
  },
  tabsIndicator: {
    // backgroundColor: '#3ECCCD'
  },
  tabsDivider: {
    borderRight: 'solid 1px #043B5D'
  },
  wrapper: {
    minWidth: 80,
    backgroundColor: '#9B9B9B',
    opacity: 1,
    '& .MuiTouchRipple-root': {
      borderRight: 'solid #fff 1px'
      // height: '60%',
      // marginTop: 10
    },
    '&:last-child .MuiTouchRipple-root': {
      borderRight: 'solid #043B5D 0px'
      // height: '60%',
      // marginTop: 10
    },
    '&.Mui-selected': {
      // backgroundColor: '#3ECCCD'
    },
    '&.Mui-selected .MuiTab-wrapper': {
      // borderBottom: 'solid white 2px'
      '&.tabAll': {
        backgroundColor: theme.palette.brand
      }
    }
  },

  selectedAll: {
    backgroundColor: theme.palette.brand
  },
  selectedPending: {
    backgroundColor: theme.palette.brandOrange
  },
  selectedVaccine: {
    backgroundColor: theme.palette.brandPink
  },
  selectedNegative: {
    backgroundColor: theme.palette.brandGreen
  },
  selectedPositive: {
    backgroundColor: theme.palette.brandRed
  },
  selectedInconclusive: {
    backgroundColor: theme.palette.brandText
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  const classes = useStyles();
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      className={classes.tabPanel}
      aria-labelledby={`nav-tab-${index}`}
      {...other}>
      {value === index && (
        <Box p={3}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

const ResultsManager = props => {
  const { match, history, getTestingsCount } = props;

  const classes = useStyles();

  const [value, setValue] = useState(6);
  const [counts, setCounts] = useState([]);
  const [refetch, setRefetch] = useState(0);

  useEffect(() => {
    (async () => {
      let res = await getTestingsCount();
      if (res.success)
        setCounts(res.data);
    })();
    // eslint-disable-next-line
  }, [refetch]);

  useEffect(() => {
    const tab = match.params.tab;
    console.log('Selected tab: ' + tab);
    if (tab) {
      switch (tab) {
        case 'All':
          setValue(0);
          break;
        case 'Pending':
          setValue(1);
          break;
        case 'Negative':
          setValue(2);
          break;
        case 'Positive':
          setValue(3);
          break;
        case 'Inconclusive':
          setValue(4);
          break;
        case 'Vaccine':
          setValue(5);
          break;
        default:
          break;
      }
    }
  }, [match.params.tab]);

  const handleChange = (event, newValue) => {
    // setValue(newValue);
    switch (newValue) {
      case 0:
        history.push('/results-manager/All');
        break;
      case 1:
        history.push('/results-manager/Pending');
        break;
      case 2:
        history.push('/results-manager/Negative');
        break;
      case 3:
        history.push('/results-manager/Positive');
        break;
      case 4:
        history.push('/results-manager/Inconclusive');
        break;
      case 5:
        history.push('/results-manager/Vaccine');
        break;
      default:
        break;
    }
  };

  const getResultFromTab = tab => {
    switch (tab) {
      case 0:
        return 'All';
      case 1:
        return 'Pending';
      case 2:
        return 'Negative';
      case 3:
        return 'Positive';
      case 4:
        return 'Inconclusive';
      case 5:
        return 'Vaccine';

      default:
        return 'All';
    }
  };

  const getCount = (result) => {
    let res = counts.find(c => c.result === result);
    return res ? `- ${numberWithCommas(res.count)}` : '';
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          classes={{ indicator: classes.tabsIndicator }}>
          <Tab
            label={`ALL ${getCount('All')}`}
            classes={{
              root: classes.wrapper,
              selected: classes.selectedAll
            }}
          />
          <Tab
            label={`PENDING ${getCount('Pending')}`}
            classes={{
              root: classes.wrapper,
              selected: classes.selectedPending
            }}
          />
          <Tab
            label={`NEGATIVE ${getCount('Negative')}`}
            classes={{
              root: classes.wrapper,
              selected: classes.selectedNegative
            }}
          />
          <Tab
            label={`POSITIVE ${getCount('Positive')}`}
            classes={{
              root: classes.wrapper,
              selected: classes.selectedPositive
            }}
          />
          <Tab
            label={`INCONCLUSIVE ${getCount('Inconclusive')}`}
            classes={{
              root: classes.wrapper,
              selected: classes.selectedInconclusive
            }}
          />
          <Tab
            label={`VACCINE ${getCount('Vaccine')}`}
            classes={{
              root: classes.wrapper,
              selected: classes.selectedVaccine
            }}
          />
          <Tab label="" style={{ display: 'none' }} />
        </Tabs>
      </AppBar>

      {[...Array(6)].map((_, index) => (
        <TabPanel key={index} value={value} index={index}>
          <ResultsPage
            tab={index}
            result={getResultFromTab(index)}
            refetch={refetch}
            setRefetch={setRefetch}
          />
        </TabPanel>
      ))}
    </div>
  );
};

ResultsManager.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  getTestingsCount: PropTypes.func.isRequired,
};

export default connect(null, { getTestingsCount, })(withRouter(ResultsManager));
