import React from 'react';
import Relay from 'react-relay';
import createLogger from '../logger';

const log = createLogger('user.Profile');


class Profile extends React.Component {
  render() {
    log.debug(this.props.viewer);
    return (
      <div>
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
