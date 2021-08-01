import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { withRouter } from 'react-router-dom';
import {
  FormControl,
  FormControlLabel,
  // Checkbox,
  Popover,
  Typography,
  // Button
} from '@material-ui/core';
// import CheckBoxOutlineBlank from '@material-ui/icons/CheckBoxOutlineBlank';
import { showFailedDialog, showErrorDialog } from 'actions/dialogAlert';
import * as cloneDeep from 'lodash/cloneDeep';
// import brandStyles from 'theme/brand';
import CheckButton from 'components/CheckButton';
import TextButton from 'components/Button/TextButton';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(2)
  },
  header: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(2)
    // marginBottom: theme.spacing(2),
  },
  subHeader: {
    display: 'flex',
    alignItems: 'center'
  },
  headerTitle: {
    color: theme.palette.brandText
  },
  headerSubTitle: {
    color: theme.palette.brandText,
    marginLeft: 8
  },

  applyButton: {
    color: theme.palette.white,
    backgroundColor: theme.palette.brandDark,
    border: `0.75px solid ${theme.palette.brandDark}`,
    borderRadius: '10px',
    textTransform: 'none',
    marginTop: '10px',
    padding: '6px 24px',
    '&:hover': {
      backgroundColor: theme.palette.brandGreen
    }
  },
  // Filter layout
  paperRoot: {
    marginTop: '10px',
    marginLeft: '-6px',
    border: 'solid 1px',
    padding: '8px',
    maxHeight: '300px'
  },
  filterTitle: {
    fontFamily: 'Montserrat',
    fontSize: '20px',
    fontWeight: 600,
    color: theme.palette.brandDark,
    paddingBottom: '8px'
  },
  filterGroupLabel: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: theme.palette.brandDark
  },
  filterSubLabel: {
    fontSize: '16px',
    fontWeight: 500,
    color: theme.palette.brandDark
  },
  checkboxRoot: {
    padding: '4px 9px',
    color: theme.palette.blueDark
  },
  checkboxChecked: {
    color: `${theme.palette.blueDark} !important`
  },
  subGroupContainer: {
    paddingLeft: '16px'
  }
}));

const FilterSettingPopup = props => {
  const { anchorEl, groupInfo } = props;
  const classes = useStyles();
  // const brandClasses = brandStyles();
  const filterPopOpen = Boolean(props.anchorEl);

  const [localGroupData, setLocalGroupData] = useState([]);
  const [groupChecked, setGroupChecked] = useState([]);
  const [groupIndeterminateState, setGroupIndeterminateState] = useState([]);

  useEffect(() => {
    var tempGroupChecked = [];
    var tempGroupIndeterminateState = [];
    setLocalGroupData(cloneDeep(groupInfo));

    // console.log('groupData changing', groupInfo)
    if (groupInfo.length) {
      groupInfo.map((group, index) => {
        const allChecked = group.children.every(isAllTrue);
        const someChecked = group.children.some(isAllTrue);
        tempGroupChecked[group.groupKey] = someChecked;
        tempGroupIndeterminateState[group.groupKey] = !allChecked;
        return tempGroupChecked;
      });
      // console.log('tempArr' , tempArr);
      setGroupChecked(tempGroupChecked);
      setGroupIndeterminateState(tempGroupIndeterminateState);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupInfo]);

  useEffect(() => {
    updateGroupStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updateGroupStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localGroupData]);

  const handleChangeGroup = name => event => {
    setGroupChecked({ ...groupChecked, [name]: event.target.checked });
    setGroupIndeterminateState({
      ...groupIndeterminateState,
      [name]: !event.target.checked
    });
    var currentGroup = localGroupData.filter(
      group => group.groupKey === name
    )[0];

    const stateArr = currentGroup.children.map(sloc => {
      return {
        ...sloc,
        value: event.target.checked
      };
    });

    currentGroup.children = stateArr;

    const updatedGroup = localGroupData.map(group => {
      if (group.groupKey === name) {
        group = currentGroup;
      }
      return group;
    });
    setLocalGroupData(updatedGroup);
  };

  const handleCheckChild = (groupKey, id, value) => {
    var currentGroup = localGroupData.filter(
      group => group.groupKey === groupKey
    )[0];

    currentGroup.children.map(sloc => {
      if (sloc.id === id) {
        sloc.value = value;
      }
      return sloc;
    });

    // currentGroup.children = stateArr;

    // const updatedGroup = localGroupData.map((group => {
    //   if(group.groupKey === groupKey){
    //     group = currentGroup;
    //   }
    //   return group
    // }))
    // setLocalGroupData(updatedGroup);

    const allChecked = currentGroup.children.every(isAllTrue);
    const someChecked = currentGroup.children.some(isAllTrue);

    setGroupChecked({ ...groupChecked, [groupKey]: someChecked });
    setGroupIndeterminateState({
      ...groupIndeterminateState,
      [groupKey]: !allChecked
    });
  };

  const updateGroupStatus = () => {
    var tempGroupChecked = [];
    var tempGroupIndeterminateState = [];
    if (localGroupData.length) {
      localGroupData.map((group, index) => {
        const allChecked = group.children.every(isAllTrue);
        const someChecked = group.children.some(isAllTrue);
        tempGroupChecked[group.groupKey] = someChecked;
        tempGroupIndeterminateState[group.groupKey] = !allChecked;

        return tempGroupChecked;
      });
      // console.log('tempArr' , tempArr);
      setGroupChecked(tempGroupChecked);
      setGroupIndeterminateState(tempGroupIndeterminateState);
    }
  };

  const isAllTrue = elem => {
    return elem.value === true;
  };

  const handleClosePopover = () => {
    // console.log('groupInfo before close pop', props.groupInfo)
    props.onClose();
    setLocalGroupData(cloneDeep(groupInfo));
  };

  const handleApplyFilterOption = () => {
    // console.log('close popover')
    props.setAnchorEl(null);
    props.updateGroupData(localGroupData);
    props.onApply(localGroupData);
  };

  return (
    <Popover
      // id={id}
      anchorEl={anchorEl}
      // anchorOrigin={props.anchorOrigin}
      classes={{ paper: classes.paperRoot }}
      onClose={handleClosePopover}
      open={filterPopOpen}
      // transformOrigin={props.transformOrigin}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <Typography className={classes.filterTitle}>FILTER BY </Typography>
      <FormControl>
        {localGroupData.map((group, index) => (
          <React.Fragment key={index}>
            <FormControlLabel
              classes={{ label: classes.filterGroupLabel }}
              control={
                <CheckButton
                  checked={groupChecked[group.groupKey] ? true :false}
                  // classes={{
                  //   root: classes.checkboxRoot,
                  //   checked: classes.checkboxChecked
                  // }}
                  indeterminate={groupIndeterminateState[group.groupKey]}
                  // indeterminateIcon={
                  //   groupChecked[group.groupKey] ? (
                  //     undefined
                  //   ) : (
                  //     <CheckBoxOutlineBlank />
                  //   )
                  // }
                  inputProps={{
                    'aria-label': 'indeterminate checkbox'
                  }}
                  onChange={handleChangeGroup(group.groupKey)}
                  value={group.groupKey}
                />
              }
              label={group.groupKey}
            />

            <FormControl className={classes.subGroupContainer}>
              {group.children.map((child, index) => (
                <FormControlLabel
                  classes={{ label: classes.filterSubLabel }}
                  control={
                    <CheckButton
                      checked={child.value}
                      classes={{
                        root: classes.checkboxRoot,
                        checked: classes.checkboxChecked
                      }}
                      onChange={() =>
                        handleCheckChild(group.groupKey, child.id, !child.value)
                      }
                      value={child.value}
                    />
                  }
                  key={index}
                  label={child.label}
                />
              ))}
            </FormControl>
          </React.Fragment>
        ))}
      </FormControl>
      <div>
        {/* <Button
          className={classes.applyButton}
          onClick={handleApplyFilterOption}
          variant="contained"
        >
          APPLY
        </Button> */}
        <TextButton 
          onClick={handleApplyFilterOption}
          size="small"
        >
          Apply
        </TextButton>
      </div>
    </Popover>
  );
};

FilterSettingPopup.propTypes = {
  match: PropTypes.object
};

export default connect(null, { showFailedDialog, showErrorDialog })(
  withRouter(FilterSettingPopup)
);
