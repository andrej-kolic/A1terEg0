import React from 'react';
import moment from 'moment'
import createLogger from '../logger';

const log = createLogger('components.Post');

export default class Post extends React.Component {

  constructor(props) {
    super(props);
    this.state = { dateDescription: this.getDateDescription() };
  }

  getDateDescription = () => moment(this.props.message.createdAt * 1000).fromNow();

  componentDidMount() {
    log.debug('componentDidMount');
    this.timerId = setInterval(
      () => this.setState({ dateDescription: this.getDateDescription() }),
      30000
    );
  }

  componentWillUnmount() {
    log.debug('componentWillUnmount');
    clearInterval(this.timerId);
  }

  render() {
    const highlightStyle = this.props.highlight ? styles.highlight : {};
    return (
      <div>
        <div style={styles.container}>
          <img src={this.props.viewer.avatar} style={styles.avatar} />
          <div style={styles.messageContainer}>
            <span
              style={{ ...styles.message, ...highlightStyle }}>{this.props.message.content}</span>
          </div>

          <button
            onClick={() => this.props.onStartEditing(this.props.message)}
            className="fa fa-pencil"
            style={{ ...styles.messageButton, ...styles.messageButtonEdit }}
          >
          </button>

          <button
            onClick={() => this.props.onDelete(this.props.message)}
            className="fa fa-times fa-2x"
            style={styles.messageButton}
          >
          </button>
        </div>

        <div style={styles.timestamp}>{this.state.dateDescription}</div>
      </div>
    );
  }
}


const styles = {
  container: {
    display: 'flex',
    marginTop: 20,
  },
  avatar: {
    width: 44,
    height: 44,
    marginRight: 10,
    borderRadius: 22,
  },
  messageContainer: {
    flex: 'auto',
  },
  message: {
    display: 'inline-block',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 6,
    alignSelf: 'center',
    fontSize: 18,
    color: '#555',
    wordWrap: 'break-word',
    overflow: 'hidden',
  },
  timestamp: {
    paddingLeft: 52,
    fontSize: 14,
    color: '#999',
  },
  highlight: {
    backgroundColor: '#ffff91',
  },
  messageButton: {
    border: 0,
    background: 'none',
    marginLeft: 10,
    opacity: 0.4,
    fontSize: 16,
    borderWidth: 1,
    borderStyle: 'dotted',
    width: 26,
    height: 26,
    borderRadius: 13,
  },
  messageButtonEdit: {}
};
