import React from 'react';
import Relay from 'react-relay';
import createLogger from '../logger';
import UpdateUserMutation from './UpdateUserMutation';

const log = createLogger('user.Profile');


class Profile extends React.Component {
  render() {
    log.debug(this.props.viewer);
    return (
      <div>
        <h1>Profile</h1>
        <h2>{this.props.viewer.name}</h2>
        <h3>messages: {this.props.viewer.messages.count}</h3>

        <hr/>

        <input type="text" ref={(input) => this.userName = input} />
        <button onClick={this.updateUser}>Update</button>
      </div>
    );
  }

  updateUser = () => {
    log.debug('updateViewer:', this.userName.value);
    this.props.relay.commitUpdate(
      new UpdateUserMutation({viewer: this.props.viewer, userName: this.userName.value })
    )
  }
}


export default Relay.createContainer(Profile, {
  initialVariables: { count: 10 },
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        name,
        messages(last: 1) {
          count
        },
      }
    `,
  },
});
