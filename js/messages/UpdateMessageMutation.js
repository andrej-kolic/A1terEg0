import Relay from 'react-relay';
import createLogger from '../logger';

const log = createLogger('message.UpdateMessageMutation');


export default class UpdateMessageMutation extends Relay.Mutation {

  static fragments = {
    message: () => Relay.QL` fragment on Message { id }`,
  };

  getMutation() {
    return Relay.QL`mutation {updateMessage}`;
  }

  getVariables() {
    log.debug(this.props);
    return {
      id: this.props.message.id,
      messageContent: this.props.messageContent
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdateMessagePayload {
        message {
          content
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        message: this.props.message.id,
      },
    }];
  }
}