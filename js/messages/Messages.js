import React from 'react';
import Relay from 'react-relay';
import createLogger from '../logger';
import CreateMessageMutation from './CreateMessageMutation';
import UpdateMessageMutation from './UpdateMessageMutation';
import RemoveMessageMutation from './RemoveMessageMutation';
import MessageList from './MessageList';
import TextareaAutosize from 'react-autosize-textarea'


const log = createLogger('components.Messages');
const MESSAGES_PAGE_SIZE = 40;


class Messages extends React.Component {

  constructor(props) {
    super(props);
    this.state = { currentMessage: null, preventScroll: false, inputText: '' }
  }

  componentDidMount() {
    this.messageInput.focus();
  }

  componentDidUpdate() {
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
                       preventScroll={this.state.preventScroll}
                       currentMessage={this.state.currentMessage}
          />
        </div>

        <div style={styles.footer}>
          <TextareaAutosize innerRef={(input) => this.messageInput = input}
                    maxRows={5}
                    style={styles.textInput}
                    placeholder="Send a message"
                    onKeyDown={(e) => {
                      if (e.keyCode === 13) {
                        e.preventDefault();
                        this._postMessage();
                        return false;
                      } else if (e.keyCode === 27) {
                        e.preventDefault();
                        this._clearInput();
                        return false;
                      }
                    }}
                    onChange={(e) => this.setState({ inputText: e.target.value, preventScroll: true })}
                    value={this.state.inputText}
          >
          </TextareaAutosize>
          <button onClick={this._clearInput}
                  className="fa fa-remove"
                  style={{ ...styles.sendButton, visibility: this.state.inputText ? 'visible' : 'hidden'}}
          />
          <button onClick={this._postMessage}
                  className="fa fa-send"
                  style={styles.sendButton}
                  disabled={!this.state.inputText || !this.state.inputText.trim().length}
          />
        </div>

      </div>
    );
  }

  _deleteMessage = (message) => {
    const messageId = message.id;
    if (this.state.currentMessage && this.state.currentMessage.id === messageId) {
      this.setState({ currentMessage: null, inputText: '', preventScroll: true });
    } else {
      this.setState({ preventScroll: true });
    }
    log.debug('_deleteMessage', messageId);
    this.props.relay.commitUpdate(
      new RemoveMessageMutation({ viewer: this.props.viewer, messageId })
    )
  };

  _createMessage = () => {
    log.debug('_createMessage:', this.state.inputText);
    this.setState({ preventScroll: false });
    this.props.relay.commitUpdate(
      new CreateMessageMutation({
        viewer: this.props.viewer,
        messageContent: this.state.inputText
      })
    );
  };

  _startEditingMessage = (message) => {
    log.debug('_startEditingMessage:', message);
    this.setState({ currentMessage: message, preventScroll: true, inputText: message.content });
  };

  _updateMessage = () => {
    log.debug('_updateMessage:', this.state.inputText);
    this.props.relay.commitUpdate(
      new UpdateMessageMutation({
        message: this.state.currentMessage,
        messageContent: this.state.inputText
      })
    );
    this.setState({ currentMessage: null, preventScroll: true, inputText: '' });
  };

  _postMessage = () => {
    log.debug('_postMessage:');
    if(!this.state.inputText || !this.state.inputText.trim().length) return;

    if (this.state.currentMessage) {
      this._updateMessage();
    } else {
      this._createMessage();
    }
    this.setState({ inputText: '' });
  };

  _clearInput = () => {
    log.debug('_clearInput');
    this.setState({ currentMessage: null, inputText: '' });
  };

  _loadMore = () => {
    this.setState({ preventScroll: true });
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
              createdAt
            },
          },
        },
      }
    `,
  },
});


const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    maxWidth: 500,
    margin: 'auto',
    backgroundColor: '#DDD',
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
    flexShrink: 0,
  },
  textInput: {
    flexGrow: 1,
    borderWidth: 0,
    fontSize: 16,
    marginRight: 10,
  },
  sendButton: {
    border: 0,
    background: 'none',
    paddingRight: 10,
    fontSize: 22,
    opacity: 0.75,
  }
};
