import React, { useState, useRef } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Typography,
  Popover,
  TextField,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles(theme => ({
  root: {
    padding: '8px',
  },
  fieldSet: {
    borderRadius: '8px',
    border: '1px solid #0F84A9',
    padding: '0px 0px 7px',
    marginTop: '-8px',
    boxShadow: '4px 4px 8px 2px rgb(15 132 169 / 15%)'
  },
  legend: {
    fontFamily: 'Montserrat',
    fontWeight: 400,
    fontSize: '11px',
    lineHeight: '16px',
    color: theme.palette.brandDark,
    padding: '0 6px',
    marginLeft: '8px'
  },
  placeholder: {
    color: '#9B9B9B',
    fontSize: 14,
    padding: '0px 8px',
    lineHeight: '25px'
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  addIcon: {
    color: '#043B5D',
    backgroundColor: '#DBECF2',
    width: '1rem',
    height: '1rem',
    cursor: 'pointer'
  },
  popover: {
    border: '1.37362px solid #0F84A9',
    boxShadow: '6.35934px 2.54374px 11.4468px 2.54374px rgba(4, 59, 93, 0.15)',
    borderRadius: '5px',
    padding: '12px 16px 10px',
  },
  item: {
    color: '#043B5D',
    textAlign: 'center',
    fontFamily: 'Montserrat',
    fontWeight: 500,
    fontSize: '14px',
    borderRadius: '5px',
    marginBottom: '12px',
    boxShadow: '3px 4px 8px rgba(4, 59, 93, 0.1)',
    padding: '1px 12px',
    cursor: 'pointer',
    '&:last-child': {
      marginBottom: '0px'
    }
  },
  searchInput: {
    marginBottom: '8px',
    '& .MuiInputBase-input': {
      color: '#043B5D',

    },
    '& .MuiInputBase-root': {
      // border:'solid red 1px',
      '&:before': {
        borderBottom: 0
      },
      '&:after': {
        borderBottom: 0
      },
    }
  },
  newOption: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#DBECF2',
    borderRadius: '5px',
    justifyContent: 'center',
    padding: '5px 12px',
    margin: '10px 0px 10px 0px',
    cursor: 'pointer',
    '& svg': {
      color: '#043B5D',
      width: '0.8em',
      height: '0.8em'
    },
    '& p': {
      color: '#043B5D',
      fontWeight: 500
    }
  }

}))

const NewItem = (props) => {
  const { label, itemValue, setItemValue, placeholder, inventoryOptions, customOptions, emptyItemError } = props;

  const classes = useStyles();

  const inputRef = useRef();

  const [filteredOptions, setFilteredOptions] = useState(inventoryOptions);
  const [searchOption, setSearchOption] = useState();
  const [newMode, setNewMode] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  // useEffect(() => {
  //   setTempItems(items)
  // }, [items]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onChangeSearch = (e) => {
    setSearchOption(e.target.value);
    if (e.target.value !== '') {
      let results = inventoryOptions.filter(item => new RegExp(e.target.value, "i").test(item.name))
      setFilteredOptions(results);
    } else {
      setFilteredOptions(inventoryOptions);
    }
  };

  const onClickItem = (item) => {
    let newItem = {
      name: (!filteredOptions.length && searchOption !== '') ? searchOption : item.name,
      type: item.type
    };
    setItemValue(newItem);
    setSearchOption(null);
    setFilteredOptions(inventoryOptions);
    setNewMode(false);
    handleClose();
  };

  const StyledItem = (props) => {
    const { item, onClickItem } = props;
    if (item.type === 'Vaccine')
      return <Typography className={classes.item} style={{ border: '1px solid #DE50A4' }} onClick={() => onClickItem(item)} >{item.name}</Typography>
    else if (item.type === 'Rapid')
      return <Typography className={classes.item} style={{ border: '1px solid #FBC23C' }} onClick={() => onClickItem(item)}>{item.name}</Typography>
    else
      return <Typography className={classes.item} style={{ border: '1px solid #25DD83' }} onClick={() => onClickItem(item)}>{item.name}</Typography>
  }

  return (
    <div>
      <fieldset className={classes.fieldSet}>
        <legend className={classes.legend}>
          {label}
          <span style={{ color: '#DD2525' }}> *</span>
        </legend>
        <div className={classes.nameContainer}>
          <Typography component={'span'} className={classes.placeholder}>
            {!itemValue ? placeholder : <StyledItem item={itemValue} onClickItem={() => { }} />}
          </Typography>
          <AddIcon className={classes.addIcon} onClick={handleClick}></AddIcon>
        </div>
      </fieldset>
      {emptyItemError && <Typography style={{ color: '#DD2525' }}>Please enter Item name.</Typography>}

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        classes={{ paper: classes.popover }}
      >
        <TextField
          ref={inputRef}
          label="Choose an option"
          type="text"
          value={searchOption || ''}
          onChange={onChangeSearch}
          classes={{ root: classes.searchInput }}
          InputLabelProps={{
            style: { color: '#9B9B9B' },
          }}
        />

        {newMode
          ?
          <>
            <Typography>Add a new option</Typography>
            <Typography>Select where it belongs</Typography>
            <br />
            {customOptions.map((option, index) =>
              <StyledItem item={option} key={index} onClickItem={onClickItem} />
            )}
          </>
          :
          (!filteredOptions.length && searchOption !== '')
            ?
            <div className={classes.newOption} onClick={() => setNewMode(true)}>
              <AddIcon />
              <Typography>Add as a new option</Typography>
            </div>
            :
            filteredOptions.map((item, index) => (
              <StyledItem item={item} key={index} onClickItem={onClickItem} />
            ))
        }
      </Popover>
    </div>
  )
}

export default NewItem;