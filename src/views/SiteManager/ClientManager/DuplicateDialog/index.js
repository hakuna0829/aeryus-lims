import React, { useState, useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
// import clsx from 'clsx';
import brandStyles from 'theme/brand';
import { Grid, Typography, FormControl, InputLabel, Select, TextField,
  // Button,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';
import TextButton from 'components/Button/TextButton';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const useStyles = makeStyles(theme => ({
  container: {
    padding: `0px ${theme.spacing(2)}px`,
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
  headerTitle: {
    color: theme.palette.brandText
  },
  title: {
    color: '#0F84A9',
    lineHeight: '27px'
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
  population: {
    margin: '50px 0'
  },
  activateButton: {
    margin: '10px auto 5px',
    color: theme.palette.brandGreen,
    borderColor: theme.palette.brandGreen,
    borderRadius: 10,
    lineHeight: '18px',
    textTransform: 'none',
  },
  deactivateButton: {
    margin: '10px auto 5px',
    color: theme.palette.brandRed,
    borderColor: theme.palette.brandRed,
    borderRadius: 10,
    lineHeight: '18px',
    textTransform: 'none',
  },
  viewLink: {
    color: theme.palette.brandDark,
    fontSize: 14,
    textDecoration: 'underline',
    textTransform: 'capitalize',
    lineHeight: 'unset',
    '&:hover': {
      textDecoration: 'underline',
    }
  },
  colorGray: {
    color: '#9B9B9B !important' // remove important
  },
  parentGrid: {
    padding: theme.spacing(2),
  },
  iconButton: {
    position: 'absolute',
    top: 10,
    right: 10
  },
  dlgTitle: {
    fontWeight: 600,
    fontSize: '24px',
    textAlign: 'center',
    // color: '#0F84A9'
  },
  dlgSubTitle: {
    fontWeight: 500,
    fontSize: '20px',
    color: theme.palette.blueDark
  }
}));


const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  const classes2 = useStyles();
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6" className={classes2.dlgTitle}>{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DuplicateDialog = ({ selectedId, populationSettings, openDuplicated, handleDuplicatedClose }) => {
  
  const [formState, setFormState] = useState({ new_name: '', dupPopulation: '' });
  const [formButtonDisable, setFormButtonDisable] = useState(true);
  const classes = useStyles();
  const brandClasses = brandStyles();

  useEffect(() => {
    if (formState.new_name !== '' && formState.dupPopulation !== '') {
      setFormButtonDisable(false);
    } else {
      setFormButtonDisable(true)
    }
  }, [formState])

  // const handleDuplicatedClickOpen = () => {
  //   setOpenDuplicated(true);
  // };

  const handleClose = () => {
    handleDuplicatedClose(false);
  };

  const handleChange = e => {
    e.persist();
    setFormState(formState => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleDuplicatedClose(true, formState);
    setFormState({ new_name: '', dupPopulation: '' });
  }

  var currentPopulation;
  if (selectedId) {
    currentPopulation = populationSettings.filter((population) => population._id === selectedId)[0];
  }
  
  return (
    <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={openDuplicated} maxWidth={'sm'} fullWidth={true}>
      <DialogTitle id="customized-dialog-title" onClose={handleClose} >
        Duplicate {selectedId && currentPopulation.name}
      </DialogTitle>
      <DialogContent >
        <form onSubmit={(e) => handleSubmit(e)}>
          <Grid container spacing={2}>
            <Grid item md={2}></Grid>
            <Grid item >
              <Typography gutterBottom className={classes.dlgSubTitle}>
                ASSIGN THE FOLLOWING:
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item md={2}></Grid>
            <Grid item md={7}>
              <FormControl
                className={brandClasses.shrinkTextField}
                required
                fullWidth
                variant="outlined"
              >
                <InputLabel shrink className={brandClasses.selectShrinkLabel}>Location Name</InputLabel>
                <TextField
                  type="text"
                  label=""
                  placeholder="Enter new location name"
                  name="new_name"
                  className={brandClasses.shrinkTextField}
                  onChange={handleChange}
                  value={formState.new_name || ''}
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </FormControl>
            </Grid>
            <Grid item md={3}></Grid>
            <Grid item md={2}></Grid>
            <Grid item md={7}>
              <FormControl
                className={brandClasses.shrinkTextField}
                required
                fullWidth
                variant="outlined"
              >
                <InputLabel shrink className={brandClasses.selectShrinkLabel}>Population Name</InputLabel>
                <Select
                  onChange={handleChange}
                  label="Assign Location"
                  name="dupPopulation"
                  displayEmpty
                  value={formState.dupPopulation || ''}
                >
                  <MenuItem value=''>
                    <Typography className={brandClasses.selectPlaceholder}>Select a population</Typography>
                  </MenuItem>
                  <MenuItem value="Employees" className={brandClasses.selectPlaceholder}>Employees</MenuItem>
                  <MenuItem value="Vistors" className={brandClasses.selectPlaceholder}>Vistors</MenuItem>
                  <MenuItem value="Patients" className={brandClasses.selectPlaceholder}>Patients</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={3}></Grid>
          </Grid>
          {/* <Button autoFocus onClick={handleDuplicatedClose} color="primary">
          Save changes
        </Button> */}
          <div className={brandClasses.footerButton} style={{marginBottom:0}}>
            {/* <Button
              className={clsx(brandClasses.button, brandClasses.whiteButton)}
              onClick={handleClose}
              style={{ width: 150 }}
            >
              CANCEL
          </Button>
          &ensp;
          <Button
              className={brandClasses.blueBtn}
              classes={{ disabled: brandClasses.buttonDisabled }}
              disabled={formButtonDisable}
              type="submit"
            >
              DUPLICATE
          </Button> */}
          <TextButton category="Outlined" onClick={handleClose}>
            back
          </TextButton>
          &ensp;
          <TextButton disabled={formButtonDisable}
              type="submit">
          DUPLICATE
          </TextButton>
          
          
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default DuplicateDialog;