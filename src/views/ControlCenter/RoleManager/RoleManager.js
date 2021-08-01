import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/styles';
import { Typography, Button, Grid, ListItemIcon, IconButton, CircularProgress, useMediaQuery } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { getRoles, deleteRole } from 'actions/api';
import { showFailedDialog, showErrorDialog } from 'actions/dialogAlert';
import { Delete, Edit } from 'icons';
import pages from 'NavItems';
import * as appConstants from 'constants/appConstants';
import AddRole from './AddRole';
import DialogAlert from 'components/DialogAlert';
import brandStyles from 'theme/brand';

const useStyles = makeStyles(theme => ({
  root: {
    // padding: theme.spacing(2),
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
    alignItems: 'center'
  },
  headerSubTitle: {
    color: theme.palette.brandText,
    marginLeft: 8
  },
  greenBtn: {
    backgroundColor: theme.palette.brandGreen,
    color: theme.palette.white,
    borderRadius: '10px',
    '&:hover': {
      backgroundColor: theme.palette.brandDark,
    },
  },
  roleDiv: {
    marginBottom: theme.spacing(6)
  },
  roleTitle: {
    padding: theme.spacing(1),
    paddingRight: theme.spacing(4),
    backgroundColor: 'rgba(15,132,169,0.5)',
    color: theme.palette.white
  },
  roleModules: {
    padding: theme.spacing(2),
    backgroundColor: '#b9dbe6'
  },
  roleModuleItem: {
    width: 140,
    height: 110,
    margin: 4,
    padding: theme.spacing(1),
    boxSizing: 'border-box',
    border: '1px solid #0F84A9',
    borderRadius: 10.75,
    backgroundColor: '#FFFFFF',
    boxShadow: '4px 4px 8px 1px rgba(15,132,169,0.15)'
  },
  moduleIcon: {
    color: theme.palette.brandDark,
    justifyContent: 'center',
    '&.MuiListItemIcon-root': {
      '& .MuiSvgIcon-root': {
        fontSize: theme.spacing(4)
      }
    }
  },
  moduleTitle: {
    color: theme.palette.brandDark,
    textAlign: 'center'
  },
  actionIconsGrid: {
    width: 140,
    height: 110,
  },
  actionIcons: {
    color: theme.palette.white
  }
}));

const RoleManager = (props) => {
  const { showFailedDialog, showErrorDialog, history } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();
  const [loading, setLoading] = useState(true);
  const [rolesList, setRolesList] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState({});
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'), {
    defaultMatches: true
  });

  useEffect(() => {
    console.log('RoleManager useEffect');
    fetchRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRoles = () => {
    getRoles().then(res => {
      setLoading(false);
      if (res.data.success) {
        setRolesList(res.data.data);
      } else {
        showFailedDialog(res);
      }
    }).catch(error => {
      setLoading(false);
      showErrorDialog(error);
    });
  }

  const onDialogClose = (roleName) => {
    console.log('RoleManager onDialogClose');
    if (roleName) {
      history.push(`/control-center/add-role?roleName=${roleName}`);
    }
    setDialogOpen(false);
  };

  const onAddRole = () => {
    setDialogOpen(true);
  };

  const handleDeleteRole = (role) => {
    setSelectedRole(role);
    setConfirmDialogOpen(true);
  }

  const handleDialogAction = () => {
    setConfirmDialogOpen(false);
    setLoading(true);
    deleteRole(selectedRole._id).then(res => {
      setLoading(false);
      if (res.data.success) {
        fetchRoles();
      } else {
        showFailedDialog(res);
      }
    }).catch(error => {
      setLoading(false);
      showErrorDialog(error);
    });
  }

  const handleDialogClose = () => {
    setConfirmDialogOpen(false);
  }

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <div className={classes.subHeader}>
          <img src="/images/svg/settings_icon-1.svg" alt="" />&ensp;
          <Typography variant="h2" className={brandClasses.headerTitle}>
            Control Center |
          </Typography>
          <Typography variant="h4" className={classes.headerSubTitle}>ROLE MANAGER</Typography>
        </div>
        <Button variant="contained" onClick={onAddRole} className={classes.greenBtn}>
          <AddIcon />  Add Role
        </Button>
      </div>

      {loading
        ? <CircularProgress />
        :
        rolesList.map((role, index) => (
          <div
            key={index}
            className={classes.roleDiv}
          >
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="flex-start"
            >
              <Typography variant="h4" className={classes.roleTitle}>
                {role.name}
                {role.client_id.name && `  –  (${role.client_id.name})`}
              </Typography>
            </Grid>

            <Grid
              container
              direction="row"
              justify={isDesktop ? "flex-start" : "center"}
              alignItems="center"
              className={classes.roleModules}
            >
              {role.modules.map((roleModule, index) => {
                const pageRoleModule = pages.find(item => item.module_name === roleModule.name);
                if (pageRoleModule)
                  return (
                    <Grid
                      key={index}
                      item
                    >
                      <Grid
                        container
                        direction="column"
                        justify="center"
                        alignItems="center"
                        className={classes.roleModuleItem}
                      >
                        <Grid item>
                          <ListItemIcon className={classes.moduleIcon}>
                            {pageRoleModule.icon}
                          </ListItemIcon>
                        </Grid>
                        <Grid item>
                          <Typography
                            className={classes.moduleTitle}
                            variant="h5"
                          >
                            {pageRoleModule.title}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  )
                else
                  return null
              })}
              <Grid item>
                <Grid
                  container
                  direction="row"
                  justify="space-evenly"
                  alignItems="center"
                  className={classes.actionIconsGrid}
                  style={{ marginLeft: 10 }}
                >
                  <Grid item>
                    <IconButton
                      onClick={() => handleDeleteRole(role)}
                    >
                      <Delete className={classes.actionIcons} />
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <IconButton
                      component={Link}
                      to={`/control-center/edit-role?id=${role._id}`}
                    >
                      <Edit className={classes.actionIcons} />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
        ))}

      <AddRole
        dialogOpen={dialogOpen}
        onDialogClose={onDialogClose}
      />

      <DialogAlert
        open={confirmDialogOpen}
        type={appConstants.DIALOG_TYPE_CONFIRMATION}
        title={'Are you sure ?'}
        message={`Do you want to Delete role "${selectedRole.name}"?`}
        onClose={handleDialogClose}
        onAction={handleDialogAction}
      />
    </div>
  );
};

RoleManager.propTypes = {
  showFailedDialog: PropTypes.func.isRequired,
  showErrorDialog: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default connect(null, { showFailedDialog, showErrorDialog })(withRouter(RoleManager));