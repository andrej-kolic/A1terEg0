import React from 'react';
import Relay from 'react-relay';
import createLogger from '../logger';
import CreateMessageMutation from './CreateMessageMutation';

const log = createLogger('components.Messages');


class Messages extends React.Component {
  render() {
    return (
      <div>
        <h1>Messages</h1>

        <input type="text" ref={(input) => this.messageInput = input} />
        <button onClick={this._postMessage}>Post</button>

        <ul>
          {this.props.viewer.messages.edges.map(edge =>
            <li key={edge.node.id}>{edge.node.content} (ID: {edge.node.id})</li>
          )}
        </ul>
        <button
          disabled={!this.props.viewer.messages.pageInfo.hasPreviousPage}
          onClick={this._loadMore}>
          more...
        </button>
      </div>
    );
  }

  _postMessage = () => {
    log.debug('_postMessage:', this.messageInput.value);
    this.props.relay.commitUpdate(
      new CreateMessageMutation({viewer: this.props.viewer, messageContent: this.messageInput.value })
    )
  };

  _loadMore = () => {
    log.debug('_loadMore', this.props.viewer);
    if(!this.props.viewer.messages.pageInfo.hasPreviousPage) return;
    // Increments the number of messages being rendered by 10.
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
        messages(last: $count) {
          pageInfo {
            hasPreviousPage,
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
