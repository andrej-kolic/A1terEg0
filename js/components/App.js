import React from 'react';
import Relay from 'react-relay';

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Widget list</h1>
        <ul>
          {this.props.viewer.messages.edges.map(edge =>
            <li key={edge.node.id}>{edge.node.message} (ID: {edge.node.id})</li>
          )}
        </ul>
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        messages(first: 10) {
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
