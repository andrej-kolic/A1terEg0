import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import Messages from './messages/Messages';
import Profile from './user/Profile';
import Frame from './app/Frame';

import { applyRouterMiddleware, Route, browserHistory } from 'react-router';
import useRelay from 'react-router-relay';
import Router from 'react-router/lib/Router';

import createHashHistory from 'history/lib/createHashHistory'
import useRouterHistory from 'react-router/lib/useRouterHistory';


// root query, can also extend Relay.Route
const ViewerQueries = {
  viewer: () => Relay.QL`query { viewer }`
};

const history = useRouterHistory(createHashHistory)({ queryKey: false });

ReactDOM.render(
  <Router
    history={history}
    render={applyRouterMiddleware(useRelay)}
    environment={Relay.Store}
  >
    <Route
      path="/"
      queries={ViewerQueries}
      component={Frame}
    >
      <Route
        path="profile"
        component={Profile}
        queries={ViewerQueries}
      />
      <Route
        path="messages"
        component={Messages}
        queries={ViewerQueries}
      />
    </Route>
  </Router>,
  document.getElementById('root')
);

browserHistory.push('#/messages');