import 'babel-polyfill';

import Messages from '../messages/Messages';
import Profile from '../user/Profile';
import AppHomeRoute from './AppHomeRoute';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

ReactDOM.render(
  <Relay.Renderer
    environment={Relay.Store}
    Container={Profile}
    queryConfig={new AppHomeRoute()}
  />,
  document.getElementById('root')
);
