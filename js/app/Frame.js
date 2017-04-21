import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import createLogger from '../logger';

const log = createLogger('app.Frame');


class Frame extends React.Component {
  render() {
    return (
      <div style={{height: '100%'}}>
        <div style={styles.header}>
          <div style={{ flex: 'auto', fontSize: 26}}>
            {this.props.viewer.name} · {this.props.viewer.messages.count}
          </div>

          <Link to="/messages"><button style={{ ...styles.button, fontSize: 18 }} className="fa fa-envelope"/></Link>

          <Link to="/profile"><button style={styles.button} className="fa fa-user"/></Link>
        </div>

        {this.props.children}
      </div>
    );
  }
}

export default Relay.createContainer(Frame, {
  initialVariables: { count: 10 },
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        name,
        messages {
          count
        }
      }
    `,
  },
});


const styles = {
  header: {
    backgroundColor: '#4285f4',
    // opacity: 0.95,
    display: 'flex',
    position: 'fixed',
    color: 'white',
    padding: '10px 20px',
    left: 0,
    right: 0,
    top: 0,
    boxShadow: '0 0 4px rgba(0,0,0,.14), 0 4px 8px rgba(0,0,0,.28)',
    zIndex: 100,
    alignItems: 'center',
  },
  button: {
    color: 'white',
    fontSize: 20,
    width: 40,
    height: 40,
    border: '1px solid',
    borderRadius: 20,
    background: 'none',
    cursor: 'pointer',
    marginLeft: 10,
  }
};
