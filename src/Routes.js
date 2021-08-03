import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { PublicRouteWithLayout, PrivateRouteWithLayout } from './components/RouteWithLayout';
import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';

import {
  Dashboard as DashboardView,
  Logon as LogonView,
  AddCredentials as AddCredentialsView,
  NotFound as NotFoundView,
  UnderDevelopment as UnderDevelopmentView,
  ForgotPassword as ForgotView

} from './views';
// import LocationDetails from './views/Site/LocationDetails';
// import AddLocation from './views/Site/AddLocation';
import AddPassword from 'views/AddPassword';
import Welcome from 'views/Welcome';
import SiteManager from 'views/SiteManager';
import UserList from './views/UserManager/UserList';
import UserDetails from 'views/UserManager/UserDetails';
import ControlCenter from 'views/ControlCenter';
import LabManager from './views/LabManager';
import InventoryManager from './views/InventoryManager';
import AppointmentManager from './views/AppointmentManager';
import Reporting from './views/Reporting';
import ResultsManager from 'views/LabManager/ResultsManager';
// import ScheduleAppointment from 'views/ScheduleAppointment';
import ResultsPdf from 'views/ResultsPdf';
import OrdersTracker from 'views/LabManager/OrdersTracker';
import Notifications from 'views/Notifications';
import ResetPassword from 'views/ForgotPassword/ResetPassword';
// import TestdAppointmentCalendar from 'views/TestdAppointmentCalendar';
// import RapidPass from 'views/RapidPass';
import Alerts from 'views/Alerts';
import AddSignature from 'views/SiteManager/ClientManager/AddSignature';
import OrderManager from 'views/OrderManager';

const Routes = () => {
  return (
    <Switch>
      <Redirect
        exact
        from="/"
        to="/logon"
      />
      <Redirect
        exact
        from="/control-center"
        to="/control-center/account-manager"
      />
      <Redirect
        exact
        from="/reporting"
        to="/reporting/user"
      />
      <Redirect
        exact
        from="/welcome"
        to="/welcome/welcome"
      />
      <Redirect
        exact
        from="/testd-appointment-calendar"
        to="/testd-appointment-calendar/authenticate"
      />
      <Redirect
        exact
        from="/user-list"
        to="/user-list/All"
      />
      <Redirect
        exact
        from="/results-manager"
        to="/results-manager/All"
      />

      <PublicRouteWithLayout
        component={LogonView}
        exact
        layout={MinimalLayout}
        path="/logon"
      />
      <PublicRouteWithLayout
        component={ResetPassword}
        exact
        layout={MinimalLayout}
        path="/forgot-password/:token"
      />
      <PublicRouteWithLayout
        component={ForgotView}
        exact
        layout={MinimalLayout}
        path="/forgot-password"
      />
      <PublicRouteWithLayout
        component={AddCredentialsView}
        exact
        layout={MinimalLayout}
        path="/add-credentials"
      />
      <PublicRouteWithLayout
        component={AddPassword}
        exact
        layout={MinimalLayout}
        path="/add-password/:id"
      />
      <PublicRouteWithLayout
        component={ResultsPdf}
        exact
        layout={MinimalLayout}
        path="/results-pdf/:fileName"
      />
      <PublicRouteWithLayout
        component={AddSignature}
        exact
        layout={MinimalLayout}
        path="/add-signature/:location_id/:token"
      />
      {/* <PublicRouteWithLayout
        component={TestdAppointmentCalendar}
        exact
        layout={MinimalLayout}
        path="/go/:endpoint"
      /> */}
      {/* <PublicRouteWithLayout
        component={ScheduleAppointment}
        exact
        layout={MinimalLayout}
        path="/schedule-appointment/:phone"
      /> */}
      {/* <PublicRouteWithLayout
        component={TestdAppointmentCalendar}
        exact
        layout={MinimalLayout}
        path="/testd-appointment-calendar/:step"
      /> */}
      {/* <PublicRouteWithLayout
        component={RapidPass}
        exact
        layout={MinimalLayout}
        path="/rapid-pass/:id"
      /> */}
      <PrivateRouteWithLayout
        component={NotFoundView}
        exact
        layout={MainLayout}
        path="/not-found"
      />
      {/* Private Routes should be working after login */}
      <PrivateRouteWithLayout
        component={Welcome}
        exact
        layout={MinimalLayout}
        path="/welcome/:step"
      />
      <PrivateRouteWithLayout
        component={DashboardView}
        exact
        layout={MainLayout}
        path="/dashboard"
      />

      <PrivateRouteWithLayout
        component={SiteManager}
        exact
        layout={MainLayout}
        path="/site-manager/:tab"
      />

      {/*      <PrivateRouteWithLayout
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
      />*/}

      <PrivateRouteWithLayout
        component={UserList}
        exact
        layout={MainLayout}
        path="/user-list/:population_type"
      />
      <PrivateRouteWithLayout
        component={UserDetails}
        exact
        layout={MainLayout}
        path="/user-details/:id"
      />
      <PrivateRouteWithLayout
        component={OrdersTracker}
        exact
        layout={MainLayout}
        path="/order-tracker"
      />
      <PrivateRouteWithLayout
        component={LabManager}
        exact
        layout={MainLayout}
        path="/test-tracker"
      />
      <PrivateRouteWithLayout
        component={InventoryManager}
        exact
        layout={MainLayout}
        path="/inventory-manager"
      />
      <PrivateRouteWithLayout
        component={ResultsManager}
        exact
        layout={MainLayout}
        path="/results-manager/:tab"
      />
      <PrivateRouteWithLayout
        component={OrderManager}
        exact
        layout={MainLayout}
        path="/order-manager/:tab"
      />
      <PrivateRouteWithLayout
        component={AppointmentManager}
        exact
        layout={MainLayout}
        path="/appointment-manager/:tab"
      />
      <PrivateRouteWithLayout
        component={ControlCenter}
        exact
        layout={MainLayout}
        path="/control-center/:tab"
      />
      <PrivateRouteWithLayout
        component={Reporting}
        exact
        layout={MainLayout}
        path="/reporting/:tab"
      />
      <PrivateRouteWithLayout
        component={Notifications}
        exact
        layout={MainLayout}
        path="/all-notifications"
      />
      <PrivateRouteWithLayout
        component={Alerts}
        exact
        layout={MainLayout}
        path="/alerts/:tab"
      />
      {/* <PrivateRouteWithLayout
        component={AddAccount}
        exact
        layout={MainLayout}
        path="/control-add-account"
      />
      <PrivateRouteWithLayout
        component={AccountDetails}
        exact
        layout={MainLayout}
        path="/control-account-details/:id"
      />
      <PrivateRouteWithLayout
        component={EditRoleModules}
        exact
        layout={MainLayout}
        path="/control-center/role-edit/:id"
      /> */}
      <PrivateRouteWithLayout
        component={UnderDevelopmentView}
        exact
        layout={MainLayout}
        path="/under-development"
      />

      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;