import React from 'react';
import Relay from 'react-relay';
import createLogger from '../logger';
import CreateMessageMutation from './CreateMessageMutation';
import UpdateMessageMutation from './UpdateMessageMutation';
import RemoveMessageMutation from './RemoveMessageMutation';

const log = createLogger('components.Messages');


class Messages extends React.Component {

  constructor(props) {
    super(props);
    this.state = { currentMessage: null }
  }

  render() {
    return (
      <div>
        <h1>Messages</h1>

        <input type="text" ref={(input) => this.messageInput = input} />
        <button onClick={this._postMessage}>Post</button>

        <ul>
          {this.props.viewer.messages.edges.map(edge =>
            <li key={edge.node.id}>
              {edge.node.content} (ID: {edge.node.id})
              <button onClick={() => this._startEditingMessage(edge.node)}>edit</button>
              <button onClick={() => this._deleteMessage(edge.node.id)}>del</button>
            </li>
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

  _deleteMessage = (messageId) => {
    log.debug('_deleteMessage', messageId);
    this.props.relay.commitUpdate(
      new RemoveMessageMutation({ viewer: this.props.viewer, messageId })
    )
  };

  _createMessage = () => {
    log.debug('_createMessage:', this.messageInput.value);
    this.props.relay.commitUpdate(
      new CreateMessageMutation({
        viewer: this.props.viewer,
        messageContent: this.messageInput.value
      })
    )
  };

  _startEditingMessage = (message) => {
    log.debug('_startEditingMessage:', message);
    this.setState({ currentMessage: message });
    this.messageInput.value = message.content;
  };

  _updateMessage = () => {
    log.debug('_updateMessage:', this.messageInput.value);
    this.props.relay.commitUpdate(
      new UpdateMessageMutation({
        message: this.state.currentMessage,
        messageContent: this.messageInput.value
      })
    );
    this.setState({ currentMessage: null });
     this.messageInput.value = '';
  };

  _postMessage = () => {
    log.debug('_postMessage:');
    if (this.state.currentMessage) {
      this._updateMessage();
    } else {
      this._createMessage();
    }
  };

  _loadMore = () => {
    log.debug('_loadMore', this.props.viewer);
    if (!this.props.viewer.messages.pageInfo.hasPreviousPage) return;
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
        ${CreateMessageMutation.getFragment('viewer')},
        ${RemoveMessageMutation.getFragment('viewer')},
        messages(last: $count) {
          pageInfo {
            hasPreviousPage,
          }
          edges {
            node {
              ${UpdateMessageMutation.getFragment('message')},
              id,
              content,
            },
          },
        },
      }
    `,
  },
});
