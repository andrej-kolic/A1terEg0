import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import createLogger from '../logger';

const log = createLogger('user.Profile');


class Profile extends React.Component {
  render() {
    log.debug(this.props.viewer);
    return (
      <div>
        <ul>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/messages">Messages</Link></li>
        </ul>

        <hr/>

        <h1>Profile</h1>
        <h2>{this.props.viewer.name}</h2>
        <h3>messages: {this.props.viewer.messages.count}</h3>
      </div>
    );
  }
}

export default Relay.createContainer(Profile, {
  initialVariables: { count: 10 },
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        name,
        messages(first: $count) {
          count
          pageInfo {
            hasNextPage,
          }
          edges {
            node {
              id,
              content,
            },
          },
        },
      }
    `,
  },
});
