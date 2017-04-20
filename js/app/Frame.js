import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import createLogger from '../logger';

const log = createLogger('app.Frame');


class Frame extends React.Component {
  render() {
    return (
      <div style={{height: '100%'}}>
        <div style={{position: 'absolute', right: 0}}>
          <Link to="/profile"><span style={{padding: 5}}>Profile</span></Link>
          <Link to="/messages"><span style={{padding: 5}}>Messages</span></Link>
        </div>

        {this.props.children}
      </div>
    );
  }
}

export default Relay.createContainer(Frame, {
  initialVariables: { count: 10 },
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        name
      }
    `,
  },
});
