import React, { useState, useEffect } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { PublicRouteWithLayout, PrivateRouteWithLayout } from './components/RouteWithLayout';
import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';

import {
  Dashboard as DashboardView,
  Logon as LogonView,
  AddCredentials as AddCredentialsView,
  NotFound as NotFoundView,
  UnderDevelopment as UnderDevelopmentView,
  User,
  Site
} from './views';
import UserSchedule from './views/UserManager/Schedule';
import LocationDetails from './views/SiteManager/LocationDetails';
import AddLocation from './views/SiteManager/AddLocation';
import ControlCenter from 'views/ControlCenter';
import AddAccount from 'views/ControlCenter/AccountManager/AddAccount';
import AccountDetails from 'views/ControlCenter/AccountManager/AccountDetails';
import TestManager from './views/TestManager';
import UserList from './views/UserManager/UserList';
import UserDetails from 'views/UserManager/UserDetails';
import Welcome from 'views/Welcome';
import TestSchedule from './views/TestManager/TestSchedule';
import LabManager from './views/LabManager';

const ProdRoutes = (props) => {
  const { modules } = props;

  const [authModules, setAuthModules] = useState([]);

  useEffect(() => {
    setAuthModules(modules);
  }, [modules]);

  return (
    <Switch>
      <Redirect
        exact
        from="/"
        to="/logon"
      />
      <PublicRouteWithLayout
        component={LogonView}
        exact
        layout={MinimalLayout}
        path="/logon"
      />
      <PublicRouteWithLayout
        component={AddCredentialsView}
        exact
        layout={MinimalLayout}
        path="/add-credentials"
      />
      <PublicRouteWithLayout
        component={NotFoundView}
        exact
        layout={MinimalLayout}
        path="/not-found"
      />
      {/* Private ProdRoutes should be working after login */}
      <PrivateRouteWithLayout
        component={Welcome}
        exact
        layout={MinimalLayout}
        path="/welcome"
      />
      <PrivateRouteWithLayout
        component={DashboardView}
        exact
        layout={MainLayout}
        path="/dashboard"
      />
      <PrivateRouteWithLayout
        component={Site}
        exact
        layout={MainLayout}
        path="/site-manager/location-manager"
      />
      <PrivateRouteWithLayout
        component={LocationDetails}
        exact
        layout={MainLayout}
        path="/site-manager/location-details"
      />
      <PrivateRouteWithLayout
        component={AddLocation}
        exact
        layout={MainLayout}
        path="/site-manager/add-location"
      />
      <PrivateRouteWithLayout
        component={UserList}
        exact
        layout={MainLayout}
        path="/user-list"
      />
      <PrivateRouteWithLayout
        component={UserDetails}
        exact
        layout={MainLayout}
        path="/user-details/:id"
      />
      <PrivateRouteWithLayout
        component={User}
        exact
        layout={MainLayout}
        path="/user-testing-completed"
      />
      <PrivateRouteWithLayout
        component={UserSchedule}
        exact
        layout={MainLayout}
        path="/user-testing-scheduled"
      />

      {/* Appointment Manager Module */}
      {authModules.some(m => m.name === 'Appointment Manager') &&
        <PrivateRouteWithLayout
          component={TestManager}
          exact
          layout={MainLayout}
          path="/test-manager"
        />
      }
      {authModules.some(m => m.name === 'Appointment Manager') &&
        <PrivateRouteWithLayout
          component={TestSchedule}
          exact
          layout={MainLayout}
          path="/test-schedule"
        />
      }

      <PrivateRouteWithLayout
        component={LabManager}
        exact
        layout={MainLayout}
        path="/lab-pcr-completed"
      />

      {/* Control Center Module */}
      {authModules.some(m => m.name === 'Control Center') &&
        <PrivateRouteWithLayout
          component={ControlCenter}
          exact
          layout={MainLayout}
          path="/control-center"
        />
      }
      {authModules.some(m => m.name === 'Control Center') &&
        <PrivateRouteWithLayout
          component={AddAccount}
          exact
          layout={MainLayout}
          path="/control-add-account"
        />
      }
      {authModules.some(m => m.name === 'Control Center') &&
        <PrivateRouteWithLayout
          component={AccountDetails}
          exact
          layout={MainLayout}
          path="/control-account-details/:id"
        />
      }

      <PrivateRouteWithLayout
        component={UnderDevelopmentView}
        exact
        layout={MainLayout}
        path="/under-development"
      />

      <Redirect to="/under-development" />
    </Switch>
  );
};

const mapStateToProps = state => ({
  modules: state.auth.modules
});

ProdRoutes.propTypes = {
  modules: PropTypes.array.isRequired,
};

export default connect(mapStateToProps)(ProdRoutes);
