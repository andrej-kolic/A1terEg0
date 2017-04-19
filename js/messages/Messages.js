import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import createLogger from '../logger';

const log = createLogger('components.Messages');


class Messages extends React.Component {
  render() {
    return (
      <div>
        <ul>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/messages">Messages</Link></li>
        </ul>

        <hr/>

        <h1>Messages</h1>
        <ul>
          {this.props.viewer.messages.edges.map(edge =>
            <li key={edge.node.id}>{edge.node.content} (ID: {edge.node.id})</li>
          )}
        </ul>
        <button
          disabled={!this.props.viewer.messages.pageInfo.hasNextPage}
          onClick={ () => this._loadMore() }>
          more...
        </button>
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

export default Relay.createContainer(Messages, {
  initialVariables: { count: 10 },
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        messages(first: $count) {
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
