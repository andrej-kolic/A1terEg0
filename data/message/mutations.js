import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';

import {
  fromGlobalId,
  mutationWithClientMutationId,
  cursorForObjectInConnection,
} from 'graphql-relay';

import {
  getViewer,
  getMessage,
  getMessages,
  createMessage,
  updateMessage,
  removeMessage,
} from '../database';

import { userType } from '../user/types';
import { messageType } from './types';
import { MessageEdge } from './connections';


export const createMessageMutation = mutationWithClientMutationId({
  name: 'CreateMessage',
  inputFields: {
    messageContent: {
      type: new GraphQLNonNull(GraphQLString)
    },
  },
  outputFields: {
    newMessageEdge: {
      type: MessageEdge,
      resolve: (payload) => {
        const message = getMessage(payload.messageId);
        return {
          cursor: cursorForObjectInConnection(
            getMessages(),
            message
          ),
          node: message,
        };
      },
    },
    viewer: {
      type: userType,
      resolve: payload => getViewer()
    }
  },
  mutateAndGetPayload: ({ messageContent }) => {
    const newMessage = createMessage(messageContent, getViewer().id);
    return {
      messageId: newMessage.id,
    };
  }
});


export const updateMessageMutation = mutationWithClientMutationId({
  name: 'UpdateMessage',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    messageContent: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    viewer: {
      type: userType,
      resolve: payload => getViewer()
    },
    message: {
      type: messageType,
      resolve: ({ localMessageId }) => getMessage(localMessageId),
    }
  },
  mutateAndGetPayload: ({ id, messageContent }) => {
    const localMessageId = fromGlobalId(id).id;
    updateMessage(localMessageId, messageContent);
    return { localMessageId };
  }
});


export const removeMessageMutation = mutationWithClientMutationId({
  name: 'RemoveMessage',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    deletedMessageId: {
      type: GraphQLID,
      resolve: ({ id }) => id,
    },
    viewer: {
      type: userType,
      resolve: () => getViewer(),
    },
  },
  mutateAndGetPayload: ({ id }) => {
    const localMessageId = fromGlobalId(id).id;
    removeMessage(localMessageId);
    return { id };
  },
});

