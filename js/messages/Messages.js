import React from 'react';
import Relay from 'react-relay';
import createLogger from '../logger';
import CreateMessageMutation from './CreateMessageMutation';
import UpdateMessageMutation from './UpdateMessageMutation';
import RemoveMessageMutation from './RemoveMessageMutation';
import MessageList from './MessageList';


const log = createLogger('components.Messages');
const MESSAGES_PAGE_SIZE = 40;


const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  header: {},
  content: {
    overflowX: 'auto',
  },

  footer: {
    padding: 10
  }
};


class Messages extends React.Component {

  posts = [];

  constructor(props) {
    super(props);
    this.state = { currentMessage: null }
  }

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1>Messages</h1>
        </div>

        <div style={styles.content}>
        <MessageList viewer={this.props.viewer}
                     onStartEditing={this._startEditingMessage}
                     onDelete={this._deleteMessage}
                     onLoadMore={this._loadMore}
        />
        </div>

        <div style={styles.footer}>
          <input type="text" ref={(input) => this.messageInput = input} />
          <button onClick={this._postMessage}>Post</button>
        </div>

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
    );
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
    this.props.relay.setVariables({
      count: this.props.relay.variables.count + MESSAGES_PAGE_SIZE
    });
  }
}


export default Relay.createContainer(Messages, {
  initialVariables: { count: MESSAGES_PAGE_SIZE },
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        avatar,
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
