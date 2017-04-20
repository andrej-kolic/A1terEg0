import React from 'react';


export default class Post extends React.Component {
  render() {
    return (
      <div style={styles.container}>
        <img src={this.props.viewer.avatar} style={styles.avatar} />
        <div style={styles.message}>{this.props.message.content}</div>
        <button onClick={() => this.props.onStartEditing(this.props.message)}>edit</button>
        <button onClick={() => this.props.onDelete(this.props.message.id)}>del</button>
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
  message: {
    flex: 'auto',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 6,
    alignSelf: 'center',
    fontSize: 18,
    color: '#555',
  }
};
