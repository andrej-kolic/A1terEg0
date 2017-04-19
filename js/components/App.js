import React from 'react';
import Relay from 'react-relay';
import createLogger from '../logger';

const log = createLogger('components.App');


class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Messages</h1>
        <ul>
          {this.props.viewer.messages.edges.map(edge =>
            <li key={edge.node.id}>{edge.node.content} (ID: {edge.node.id})</li>
          )}
        </ul>
        <button disabled={!this.props.viewer.messages.pageInfo.hasNextPage} onClick={ () => this._loadMore() }>more...</button>
      </div>
    );
  }

  _loadMore() {
    log.debug('_loadMore', this.props.viewer);
    // Increments the number of stories being rendered by 10.
    this.props.relay.setVariables({
      count: this.props.relay.variables.count + 10
    });
  }
}

export default Relay.createContainer(App, {
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
