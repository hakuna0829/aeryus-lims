import React from 'react';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import SearchIcon from '@material-ui/icons/Search';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  root: {
    width: '250px',
    margin: '0'
  },
  searchbox: {
    position: 'relative',
    minWidth: '40px',
    width: '0%',
    height: '40px',
    float: 'right',
    overflow: 'hidden',
    transition: 'width 0.3s'
  },
  searchboxInput: {
    position: 'relative',
    top: 0,
    left: 40,
    border: 0,
    outline: 0,
    backgroundColor: theme.palette.white,
    width: '100%',
    height: '40px',
    margin: 0,
    padding: '0px 45px 0px 0px',
    fontSize: '18px',
    color: 'theme.palette.blueDark',
    '&::placeholder': {
      color: '#D8D8D8'
    }
  },
  searchboxSubmit: {
    width: '40px',
    height: '40px',
    display: 'block',
    position: 'absolute',
    top: 0,
    fontFamily: 'Montserrat',
    fontSize: '22px',
    left: 0,
    padding: 0,
    margin: 0,
    border: 0,
    outline: 0,
    lineHeight: '50px',
    textAlign: 'center',
    cursor: 'pointer',
    color: '#FFFFFF',
    background: '#fff',
    zIndex: -1
  },
  searchboxIcon: {
    width: '40px',
    height: '40px',
    display: 'block',
    position: 'absolute',
    top: 0,
    fontFamily: 'Montserrat',
    left: 0,
    padding: 0,
    margin: 0,
    // border: 'solid 1px rgba(155,155,155,0.5)',
    outline: 0,
    lineHeight: '50px',
    textAlign: 'center',
    cursor: 'pointer',
    color: '#FFFFFF',
    background: '#fff'
  },
  searchboxOpen: {
    width: '100%',
    border: '0.8px solid',
    borderColor: theme.palette.brandDark,
    borderRadius: '3px'
  },
  userinfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: theme.palette.white,
    paddingLeft: theme.spacing(1)
  },
  avatar: {
    backgroundColor: '#D8D8D8',
    width: 61,
    height: 61
  },
  typography: {
    color: theme.palette.white
  },
  searchIcon: {
    fontSize: '1.5rem',
    marginTop: 8,
    marginLeft: 2,
    color: theme.palette.blueDark
  }
}));

const SearchBar = props => {
  const { className, toggleOpen, isOpen } = props;
  const classes = useStyles();

  const toggleSearchBoxIcon = () => {
    console.log('isOpen---', isOpen);
    toggleOpen(!isOpen);
  };

  return (
    <div className={clsx(classes.root, className)}>
      <form className={clsx(classes.searchboxOpen, classes.searchbox)}>
        <input
          type="search"
          placeholder="Search"
          name="search"
          className={classes.searchboxInput}
          required
          onChange={props.onChange}
        />
        <span
          className={classes.searchboxIcon}
          onClick={() => toggleSearchBoxIcon()}>
          <SearchIcon className={classes.searchIcon} />
        </span>
        <input type="submit" className={classes.searchboxSubmit} />
      </form>
    </div>
  );
};

SearchBar.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  toggleOpen: PropTypes.func,
  isOpen: PropTypes.bool.isRequired
};
export default SearchBar;
