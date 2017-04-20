import React from 'react';

export default class Post extends React.Component {
  render() {
    return (
      <div style={styles.container}>
        <img src={this.props.viewer.avatar} style={styles.avatar} />
        <div style={styles.messageContainer}>
          <span style={styles.message}>{this.props.message.content}</span>
        </div>

        <button
          onClick={() => this.props.onStartEditing(this.props.message)}
          className="fa fa-pencil"
          style={{ ...styles.messageButton, ...styles.messageButtonEdit }}
        >
        </button>

        <button
          onClick={() => this.props.onDelete(this.props.message.id)}
          className="fa fa-times fa-2x"
          style={styles.messageButton}
        >
        </button>
      </div>
    );
  }
}


const styles = {
  container: {
    display: 'flex',
    marginBottom: 20,
  },
  avatar: {
    width: 44,
    height: 44,
    marginRight: 10,
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
  messageButton: {
    border: 0,
    background: 'none',
    marginLeft: 10,
    opacity: 0.5,
    fontSize: 25,

  },
  messageButtonEdit: {
    fontSize: 21,
  }
};
