import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const PrivateRouteWithLayout = props => {
  const { layout: Layout, component: Component, isAuthenticated, ...rest } = props;

  return (
    <Route
      {...rest}
      render={matchProps => (
        isAuthenticated ?
          <Layout>
            <Component {...matchProps} />
          </Layout>
          : <Redirect to="/logon" />
      )}
    />
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

PrivateRouteWithLayout.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string,
  isAuthenticated: PropTypes.bool.isRequired
};

export default connect(mapStateToProps)(PrivateRouteWithLayout);