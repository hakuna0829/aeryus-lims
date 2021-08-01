import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/styles';
import { Typography, Button, Grid, ListItemIcon, IconButton, useMediaQuery, FormControl, Select, MenuItem, CircularProgress } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import * as qs from 'qs';
import brandStyles from 'theme/brand';
import { updateRole, getRole } from 'actions/api';
import { showFailedDialog, showErrorDialog } from 'actions/dialogAlert';
import { Delete, Edit } from 'icons';
import pages from 'NavItems';
import moment from "moment";
import Alert from '@material-ui/lab/Alert';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DialogAlert from 'components/DialogAlert';
import * as appConstants from 'constants/appConstants';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(4),
  },
  roleTitle: {
    padding: theme.spacing(1),
    paddingRight: theme.spacing(4),
    marginBottom: theme.spacing(2),
    backgroundColor: 'rgba(15,132,169,0.5)',
    color: theme.palette.white
  },
  activateButton: {
    marginLeft: theme.spacing(4),
    marginTop: theme.spacing(1),
    color: theme.palette.brandGreen,
    backgroundColor: theme.palette.white,
    border: `0.75px solid ${theme.palette.brandGreen}`,
    borderRadius: '8px',
    textTransform: 'none',
  },
  deactivateButton: {
    marginLeft: theme.spacing(4),
    marginTop: theme.spacing(1),
    color: theme.palette.brandGray,
    backgroundColor: theme.palette.white,
    border: `0.75px solid ${theme.palette.brandGray}`,
    borderRadius: '8px',
    textTransform: 'none',
  },
  roleLastUpdated: {
    marginLeft: theme.spacing(4),
    marginTop: 14,
    color: theme.palette.brandDark,
  },
  availableModules: {
    padding: theme.spacing(2),
    backgroundColor: '#b9dbe6'
  },
  availableModulesTitle: {
    color: theme.palette.brandText,
    fontWeight: 600,
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
  dndTextBelow: {
    color: theme.palette.brandText,
    fontWeight: 600,
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
  selectedModules: {
    margin: theme.spacing(8),
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.brandDark}`,
    borderRadius: 10,
    backgroundColor: theme.palette.white,
    boxShadow: '4px 4px 8px 2px rgba(15,132,169,0.15)'
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
  actionIcons: {
    color: 'rgba(4,59,93,0.5)'
  },
  addModulesText: {
    color: theme.palette.brandDark,
    fontWeight: 600,
    paddingBottom: theme.spacing(2),
  },
  emptyAvailables: {
    width: 140,
    height: 110,
  },
  dndHereTextBox: {
    width: 140,
    height: 110,
    margin: 4,
    marginBottom: 50,
    padding: 16,
    boxSizing: 'border-box',
    border: `1.01px dashed ${theme.palette.brandGray}`,
    borderRadius: 10.75,
    backgroundColor: '#FFFFFF',
  },
  dndHereText: {
    color: theme.palette.brandGray,
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    paddingTop: 10
  },
  editSelect: {
    width: 0,
    '& .MuiSelect-icon': {
      display: 'none'
    },
    '& .MuiSelect-root': {
      fontSize: 0
    }
  },
  selectIcons: {
    color: 'rgba(4,59,93,0.5)',
    marginRight: theme.spacing(2),
  },
}));

const editSelectIcons = (isOpen) => ({
  fontSize: isOpen ? '1.5rem' : 0
});

const getModuleStyle = (isDragging, draggableStyle) => ({
  width: 140,
  height: 110,
  margin: 4,
  padding: 8,
  boxSizing: 'border-box',
  border: '1px solid #0F84A9',
  borderRadius: 10.75,
  backgroundColor: '#FFFFFF',
  // change background colour if dragging
  boxShadow: isDragging ? '0px 0px 16px 8px rgba(15,132,169,1)' : '4px 4px 8px 1px rgba(15,132,169,0.15)',
  // styles we need to apply on draggables
  ...draggableStyle
});

const getModuleActionStyle = (isDragging, draggableStyle) => ({
  display: isDragging ? 'none' : '',
  ...draggableStyle
});

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const compare = (a, b) => {
  const idA = parseInt(a.id);
  const idB = parseInt(b.id);

  let comparison = 0;
  if (idA > idB) {
    comparison = 1;
  } else if (idA < idB) {
    comparison = -1;
  }
  return comparison;
}

const EditRoleModules = (props) => {
  const { showFailedDialog, showErrorDialog, location, history } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [fetchLading, setFetchLading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [role, setRole] = useState(null);
  const [displaySuccess, setDisplaySuccess] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editSelectOpen, setEditSelectOpen] = useState({});

  const roleId = qs.parse(location.search, { ignoreQueryPrefix: true }).id;

  const getPages = () =>
    pages.map((page, index) => ({
      id: index.toString(),
      title: page.title,
      name: page.module_name,
      icon: page.icon,
      access: 'Write'
    }));

  const [modules, setModules] = useState({
    available: getPages(),
    selected: []
  });

  let id2Module = {
    available: 'available',
    selected: 'selected'
  };

  useEffect(() => {
    console.log('EditRoleModules useEffect id:', roleId);
    if (roleId) {
      fetchRole(roleId);
    } else {
      history.push('/control-center/role-manager');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleId, history]);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'), {
    defaultMatches: true
  });

  const fetchRole = (roleId) => {
    getRole(roleId).then(res => {
      setFetchLading(false);
      if (res.data.success) {
        setRole(res.data.data);
        let available = getPages(), selected = [];
        res.data.data.modules.forEach(roleModule => {
          let m = available.find(m => m.name === roleModule.name);
          if (m) {
            available.splice(available.findIndex(x => x.name === m.name), 1);
            m.access = roleModule.access.includes('Write') ? 'Write' : 'Read';
            selected.push(m);
          }
        });
        setModules({
          available: available,
          selected: selected
        });
      } else {
        showFailedDialog(res);
      }
    }).catch(error => {
      setFetchLading(false);
      showErrorDialog(error);
    });
  }

  const handleDeactivate = () => {
    setFetchLading(true);
    updateRole(role._id, { active: false }).then(res => {
      if (res.data.success) {
        fetchRole(role._id);
      } else {
        showFailedDialog(res);
      }
    }).catch(error => {
      showErrorDialog(error);
    });
  };

  const handleActivate = () => {
    setFetchLading(true);
    updateRole(role._id, { active: true }).then(res => {
      if (res.data.success) {
        fetchRole(role._id);
      } else {
        showFailedDialog(res);
      }
    }).catch(error => {
      showErrorDialog(error);
    });
  };

  const handleEditSelectChange = (roleModule, event) => {
    let selectedIndex = modules.selected.findIndex(x => x.id === roleModule.id);
    let selected = [...modules.selected];
    selected[selectedIndex].access = event.target.value;
    setModules(modules => ({
      ...modules,
      selected: selected
    }));
  };

  const handleClose = (roleModule) => {
    setEditSelectOpen(editSelectOpen => ({
      ...editSelectOpen,
      [roleModule.id]: false
    }));
  };

  const handleOpen = (roleModule) => {
    setEditSelectOpen(editSelectOpen => ({
      ...editSelectOpen,
      [roleModule.id]: true
    }));
  };

  const getModule = id => modules[id2Module[id]];

  const onDragEnd = result => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId !== destination.droppableId) {
      const result = move(
        getModule(source.droppableId),
        getModule(destination.droppableId),
        source,
        destination
      );

      result.available.sort(compare);
      result.selected.sort(compare);

      setModules({
        available: result.available,
        selected: result.selected
      });
    }
  };

  const handleDeleteSelected = (index) => {
    let result = {
      source: {
        droppableId: 'selected',
        index: index
      },
      destination: {
        droppableId: 'available',
        index: 0
      }
    }
    onDragEnd(result);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  }

  const handleSave = () => {
    if (!modules.selected.length) {
      setDialogOpen(true);
      return;
    }

    setSaveLoading(true);

    let selectedModules = [];
    modules.selected.forEach(ms => {
      selectedModules.push({ name: ms.name, access: ms.access === 'Read' ? ['Read'] : ['Read', 'Write'] });
    })

    let reqPayload = {
      name: role.name,
      modules: selectedModules
    };

    updateRole(role._id, reqPayload).then(res => {
      setSaveLoading(false);
      if (res.data.success) {
        setDisplaySuccess(res.data.message);
        setTimeout(() => {
          history.push('/control-center/role-manager');
        }, 1000);
      } else {
        showFailedDialog(res);
      }
    }).catch(error => {
      setSaveLoading(false);
      showErrorDialog(error);
    });
  };

  return (
    <div className={classes.root}>
      {fetchLading
        ? <CircularProgress />
        :
        <>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
          >
            <Typography variant="h4" className={classes.roleTitle}>
              {role && role.name}
            </Typography>
            {role && role.active
              ? <Button size="small" className={classes.deactivateButton} onClick={handleDeactivate}>Deactivate</Button>
              : <Button size="small" className={classes.activateButton} onClick={handleActivate}>Activate</Button>
            }
            <Typography variant="h5" className={classes.roleLastUpdated}>
              LAST UPDATED: {' '}
              {role && role.last_updated &&
                moment(role.last_updated).format('DD/MM/YYYY')
              }
            </Typography>
          </Grid>

          <DragDropContext onDragEnd={onDragEnd}>
            {/* Available Modules */}
            <div
              className={classes.availableModules}
            >
              <Typography variant="h5" className={classes.availableModulesTitle}>
                {'Available Modules'}
              </Typography>
              <Droppable droppableId="available" direction={isDesktop ? "horizontal" : "vertical"}>
                {(provided, snapshot) => (
                  <Grid
                    ref={provided.innerRef}
                    container
                    direction="row"
                    justify={isDesktop ? "flex-start" : "center"}
                    alignItems="center"
                  >
                    {modules.available.map((roleModule, index) => (
                      <Draggable
                        key={roleModule.id}
                        draggableId={roleModule.id}
                        index={index}>
                        {(provided, snapshot) => (
                          <Grid item>
                            <Grid
                              container
                              direction="column"
                              justify="center"
                              alignItems="center"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getModuleStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}>
                              <Grid item>
                                <ListItemIcon className={classes.moduleIcon}>
                                  {roleModule.icon}
                                </ListItemIcon>
                              </Grid>
                              <Grid item>
                                <Typography className={classes.moduleTitle} variant="h5">
                                  {roleModule.title}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {modules.selected.length === pages.length && (
                      <Grid item className={classes.emptyAvailables}></Grid>
                    )}
                  </Grid>
                )}
              </Droppable>
              <Typography variant="h5" className={classes.dndTextBelow}>
                {'Drag desired module to the add roles box below'}
              </Typography>
            </div>

            {/* Selected Modules */}
            <div
              className={classes.selectedModules}
            >
              <Typography variant="h5" className={classes.addModulesText}>
                {'Add Modules'}
              </Typography>
              <Droppable droppableId="selected" direction={isDesktop ? "horizontal" : "vertical"}>
                {(provided, snapshot) => (
                  <Grid
                    ref={provided.innerRef}
                    container
                    direction="row"
                    justify={isDesktop ? "flex-start" : "center"}
                    alignItems="center"
                  >
                    {modules.selected.map((roleModule, index) => (
                      <Draggable
                        key={roleModule.id}
                        draggableId={roleModule.id}
                        index={index}>
                        {(provided, snapshot) => (
                          <Grid item>
                            <Grid
                              container
                              direction="column"
                              justify="center"
                              alignItems="center"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getModuleStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}>
                              <Grid item>
                                <ListItemIcon className={classes.moduleIcon}>
                                  {roleModule.icon}
                                </ListItemIcon>
                              </Grid>
                              <Grid item>
                                <Typography className={classes.moduleTitle} variant="h5">
                                  {roleModule.title}
                                </Typography>
                              </Grid>
                            </Grid>
                            <Grid item>
                              <Grid
                                container
                                direction="row"
                                justify="space-evenly"
                                alignItems="center"
                                style={getModuleActionStyle(
                                  snapshot.isDragging,
                                  provided.draggableProps.style
                                )}
                              >
                                <Grid item>
                                  <IconButton
                                    onClick={() => handleDeleteSelected(index)}
                                  >
                                    <Delete className={classes.actionIcons} />
                                  </IconButton>
                                </Grid>
                                <Grid item>
                                  <IconButton
                                    onClick={() => handleOpen(roleModule)}
                                  >
                                    <Edit className={classes.actionIcons} />
                                  </IconButton>
                                  <FormControl className={classes.editSelect}>
                                    <Select
                                      open={editSelectOpen[roleModule.id] || false}
                                      onClose={() => handleClose(roleModule)}
                                      onOpen={() => handleOpen(roleModule)}
                                      value={roleModule.access}
                                      onChange={(event) => handleEditSelectChange(roleModule, event)}
                                    >
                                      <MenuItem value="Write">
                                        <Edit
                                          className={classes.selectIcons}
                                          style={editSelectIcons(editSelectOpen[roleModule.id])}
                                        />
                                        Can Edit
                                    </MenuItem>
                                      <MenuItem value="Read">
                                        <Visibility
                                          className={classes.selectIcons}
                                          style={editSelectIcons(editSelectOpen[roleModule.id])}
                                        />
                                        Can View
                                    </MenuItem>
                                    </Select>
                                  </FormControl>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {modules.selected.length !== pages.length && (
                      <Grid
                        item
                        className={classes.dndHereTextBox}
                      >
                        <Typography className={classes.dndHereText} variant="h6">
                          Drag and Drop <br /> Module <br /> Here
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                )}
              </Droppable>
            </div>
          </DragDropContext>

          <div className={brandClasses.footerMessage}>
            {displaySuccess ? <Alert severity="success">{displaySuccess}</Alert> : null}
          </div>

          <div className={brandClasses.footerButton}>
            <Button
              className={brandClasses.button}
              classes={{ disabled: brandClasses.buttonDisabled }}
              disabled={saveLoading}
              onClick={handleSave}
            >
              {'SAVE'} {saveLoading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
            </Button>
          </div>

          <DialogAlert open={dialogOpen} type={appConstants.DIALOG_TYPE_ALERT} title={'Alert'} message={'Please select atleast one module'} onClose={handleDialogClose} />
        </>
      }
    </div>
  );
};

EditRoleModules.propTypes = {
  showFailedDialog: PropTypes.func.isRequired,
  showErrorDialog: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
};

export default connect(null, { showFailedDialog, showErrorDialog })(withRouter(EditRoleModules));