import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import createLogger from '../logger';

const log = createLogger('app.Frame');


class Frame extends React.Component {
  render() {
    return (
      <div>
        <ul>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/messages">Messages</Link></li>
        </ul>

        <hr/>
        <div>{this.props.children}</div>
      </div>
    );
  }

  _loadMore() {
    log.debug('_loadMore', this.props.viewer);
    if(!this.props.viewer.messages.pageInfo.hasNextPage) return;
    // Increments the number of stories being rendered by 10.
    this.props.relay.setVariables({
      count: this.props.relay.variables.count + 10
    });
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
