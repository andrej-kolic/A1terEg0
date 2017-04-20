import Relay from 'react-relay';
import createLogger from '../logger';

const log = createLogger('message.CreateMessageMutation');

export default class CreateMessageMutation extends Relay.Mutation {

  static fragments = {
    viewer: () => Relay.QL` fragment on User { id } `,
  };

  getMutation() {
    return Relay.QL`mutation { createMessage }`;
  }

  getVariables() {
    log.debug(this.props);
    return { messageContent: this.props.messageContent };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on CreateMessagePayload {
        viewer {
          messages(last: 1) {
            edges {
              node {
                content
              }
            }
          }
        },
        newMessageEdge
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'viewer',
      parentID: this.props.viewer.id,
      connectionName: 'messages',
      edgeName: 'newMessageEdge',
      rangeBehaviors: {
        // append
        '': 'append',
        // Prepend, wherever the connection is sorted by age
        'orderby(newest)': 'prepend',
      },
    }];
  }

}