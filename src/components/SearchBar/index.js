import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import SearchIcon from '@material-ui/icons/Search';
import PropTypes from 'prop-types';
import brandStyles from 'theme/brand';
import { IconButton, InputAdornment, TextField } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    width: '250px',
    margin: '0'
  },
}));

const SearchBar = props => {
  const { className, handleSearchSubmit } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [searchString, setSearchString] = useState('');

  const handleSearchChange = e => {
    e.persist();
    setSearchString(e.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    handleSearchSubmit(searchString);
  };

  const handleClear = event => {
    event.preventDefault();
    if (!searchString.length)
      handleSearchSubmit('');
  }

  return (
    <div className={clsx(classes.root, className)}>
      <form
        onSubmit={handleSubmit}
      >
        <TextField
          type="search"
          placeholder="Search..."
          ref={element => (element || {}).onsearch = handleClear}
          className={brandClasses.searchTextField}
          onChange={handleSearchChange}
          value={searchString}
          fullWidth
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton
                  type="submit"
                >
                  <SearchIcon color="primary"/>
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </form>
    </div>
  );
};

SearchBar.propTypes = {
  className: PropTypes.string,
  handleSearchSubmit: PropTypes.func.isRequired,
};

export default SearchBar;
