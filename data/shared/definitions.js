import { fromGlobalId, nodeDefinitions } from 'graphql-relay';

import {
  UserEntity,
  MessageEntity,
  getUser,
  getMessage,
} from '../database';


/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
export const { nodeInterface, nodeField } = nodeDefinitions(
  // TODO: use type <==> entity mapping

  (globalId) => {
    const localId = fromGlobalId(globalId);
    const { type, id } = localId;
    if (type === 'User') {
      return getUser(id);
    } else if (type === 'Message') {
      return getMessage(id);
    } else {
      return null;
    }
  },
  (obj) => {
    if (obj instanceof UserEntity) {
      return userType;
    } else if (obj instanceof MessageEntity) {
      return messageType;
    } else {
      return null;
    }
  }
);


