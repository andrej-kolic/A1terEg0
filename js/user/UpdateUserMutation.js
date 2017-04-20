import Relay from 'react-relay';
import createLogger from '../logger';

const log = createLogger('user.UpdateUserMutation');

export default class UpdateUserMutation extends Relay.Mutation {

  static fragments = {
    viewer: () => Relay.QL` fragment on User { id }`,
  };

  getMutation() {
    return Relay.QL`mutation {updateViewer}`;
  }

  getVariables() {
    log.debug(this.props);
    return {name: this.props.userName};
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdateViewerPayload {
        viewer {
          name
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        viewer: this.props.viewer.id,
      },
    }];
  }
}