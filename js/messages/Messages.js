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
    flex: 'auto',
  },

  footer: {
    padding: 10,
    display: 'flex',
    backgroundColor: 'white',
  },
  textInput: {
    flexGrow: 1,
    borderWidth: 0,
    fontSize: 18,
    marginRight: 10,
  },
  sendButton: {
    border: 0,
    background: 'none',
    paddingRight: 20,
  }
};


class Messages extends React.Component {

  posts = [];

  constructor(props) {
    super(props);
    this.state = { currentMessage: null, loadMore: false }
  }

  componentDidMount() {
    this.messageInput.focus();
  }

  componentDidUpdate() {
    log.debug('componentDidUpdate');
    this.messageInput.focus();
  }

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <MessageList viewer={this.props.viewer}
                       onStartEditing={this._startEditingMessage}
                       onDelete={this._deleteMessage}
                       onLoadMore={this._loadMore}
                       loadMore={this.state.loadMore}
                       currentMessage={this.state.currentMessage}
          />
        </div>

        <div style={styles.footer}>
          {/*<input type="text" ref={(input) => this.messageInput = input} />*/}
          <textarea ref={(input) => this.messageInput = input}
                    rows="3"
                    style={styles.textInput}
                    placeholder="Send a message"
                    onKeyDown={(e) => {
                      if (e.keyCode === 13) {
                        e.preventDefault();
                        this._postMessage();
                        return false;
                      }
                    }}
          >
          </textarea>
          <button onClick={this._postMessage} className="fa fa-send fa-2x"
                  style={styles.sendButton} />
        </div>

      </div>
    );
  }

  _deleteMessage = (message) => {
    const messageId = message.id;

    if (this.state.currentMessage && this.state.currentMessage.id === messageId) {
      this.setState({ currentMessage: null });
      this.messageInput.value = '';
    }

    log.debug('_deleteMessage', messageId);
    this.props.relay.commitUpdate(
      new RemoveMessageMutation({ viewer: this.props.viewer, messageId })
    )
  };

  _createMessage = () => {
    log.debug('_createMessage:', this.messageInput.value);
    this.setState({ loadMore: false });
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
    this.messageInput.value = '';
  };

  _loadMore = () => {
    this.setState({ loadMore: true });
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
