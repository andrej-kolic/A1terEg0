import React from 'react';
import Relay from 'react-relay';
import createLogger from '../logger';
import UpdateUserMutation from './UpdateUserMutation';

const log = createLogger('user.Profile');


class Profile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userName: this.props.viewer.name,
      userAvatar: this.props.viewer.avatar,
    }
  }

  render() {
    return (
      <div style={ styles.container }>
        <img src={this.props.viewer.avatar} style={styles.avatar} />
        <h1 style={{color: 'white'}}>&nbsp;{this.props.viewer.name}&nbsp;</h1>

        <div style={{ marginTop: 50 }} />
          <input
            type="text"
            value={this.state.userName}
            placeholder="New username"
            onChange={(e) => this.setState({ userName: e.target.value })}
            style={styles.inputField}
          />
          <input
            type="text"
            value={this.state.userAvatar}
            placeholder="Url to new profile image"
            onChange={(e) => this.setState({ userAvatar: e.target.value })}
            style={styles.inputField}
          />
          <button
            onClick={this._updateUser}
            style={styles.updateButton}
            disabled={!this.state.userName || !this.state.userAvatar}
          >
            Update
          </button>
      </div>
    );
  }

  _updateUser = () => {
    log.debug('updateViewer:', this.state);
    this.props.relay.commitUpdate(
      new UpdateUserMutation({
        viewer: this.props.viewer,
        userName: this.state.userName,
        userAvatar: this.state.userAvatar,
      })
    );
    // this.setState({ userName: '', avatar: '' });
  }
}


export default Relay.createContainer(Profile, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        ${UpdateUserMutation.getFragment('viewer')}
        name,
        avatar,
        messages(last: 1) {
          count
        },
      }
    `,
  },
});


const styles = {
  container: {
    display: 'flex',
    paddingTop: 100,
    alignItems: 'center',
    flexDirection: 'column',
  },
  avatar: {
    width: 160,
    height: 160,
    // border: '3px solid white',
    borderRadius: 80,
  },
  inputField: {
    fontSize: 16,
    width: 300,
    padding: 10,
    borderRadius: 6,
    borderWidth: 0,
    marginBottom: 10,
  },
  updateButton: {
    fontSize: 16,
    border: 0,
    height: 40,
    borderRadius: 20,
    padding: '0 40px',
    backgroundColor: '#BBB',
    cursor: 'pointer',
    marginTop: 20,
  }
};
