import Relay from 'react-relay';
import createLogger from '../logger';

const log = createLogger('message.RemoveMessageMutation');

export default class RemoveMessageMutation extends Relay.Mutation {

  static fragments = {
    viewer: () => Relay.QL` fragment on User { id } `,
  };

  getMutation() {
    return Relay.QL`mutation { removeMessage }`;
  }

  getVariables() {
    log.debug(this.props);
    return { id: this.props.messageId };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on RemoveMessagePayload {
        viewer {
          messages(last: 1) {
            count
            edges {
              node {
                content
              }
            }
          }
        },
        deletedMessageId
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'RANGE_DELETE',
      parentName: 'viewer',
      parentID: this.props.viewer.id,
      connectionName: 'messages',
      deletedIDFieldName: 'deletedMessageId',
      pathToConnection: ['viewer', 'messages'],
    }];
  }

}