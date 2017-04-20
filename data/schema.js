import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
  cursorForObjectInConnection,
} from 'graphql-relay';

import {
  UserEntity,
  MessageEntity,
  getUser,
  getViewer,
  updateViewer,
  getMessage,
  getMessages,
  createMessage,
  updateMessage,
  removeMessage,
} from './database';


import createLogger from './server-logger';

const log = createLogger('server.schema');


/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    log.debug('globalId:', globalId, fromGlobalId(globalId));
    const { type, id } = fromGlobalId(globalId);
    if (type === 'User') {
      return getUser(id);
    } else if (type === 'Message') {
      return getMessage(id);
    } else {
      return null;
    }
  },
  (obj) => {
    log.debug('obj:', obj);
    if (obj instanceof UserEntity) {
      return userType;
    } else if (obj instanceof MessageEntity) {
      return messageType;
    } else {
      return null;
    }
  }
);


//
// custom types
//

const userType = new GraphQLObjectType({
  name: 'User',
  description: 'A person who uses our app',
  fields: () => ({
    id: globalIdField('User'),
    name: {
      type: GraphQLString,
      description: 'user name',
    },
    avatar: {
      type: GraphQLString,
      description: 'profile image',
    },
    messages: {
      type: messageConnection,
      description: 'A person\'s messages',
      args: connectionArgs,
      resolve: (_, args) => {
        const messages = getMessages();   // TODO: for logged user only
        return { ...connectionFromArray(getMessages(), args), count: getMessages().length };
      },
    },
  }),
  interfaces: [nodeInterface],
});

const messageType = new GraphQLObjectType({
  name: 'Message',
  description: 'User message',
  fields: () => ({
    id: globalIdField('Message'),
    content: {
      type: GraphQLString,
      description: 'Content of message',
    },
  }),
  interfaces: [nodeInterface],
});


//
// connections
//

const {
  connectionType: messageConnection,
  edgeType: MessageEdge
} =
  connectionDefinitions({
    connectionFields: {
      count: {
        type: GraphQLInt,
        description: 'Total number of messages',
        resolve: connection => connection.count,
      },
    },
    name: 'Message',
    nodeType: messageType
  });


//
// root query
//

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    // Add your own root fields here
    viewer: {
      type: userType,
      resolve: () => getViewer(),
    },
  }),
});


//
// Mutations
//

const updateViewerMutation = mutationWithClientMutationId({
  name: 'UpdateViewer',
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  outputFields: {
    viewer: {
      type: userType,
      resolve: payload => getViewer()
    }
  },
  mutateAndGetPayload: (input) => {
    const viewer = updateViewer(input);
    log.debug('updated viewer:', viewer);
    return {
      viewer,
    };
  }
});


const createMessageMutation = mutationWithClientMutationId({
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


const updateMessageMutation = mutationWithClientMutationId({
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
  mutateAndGetPayload: ({id, messageContent}) => {
    const localMessageId = fromGlobalId(id).id;
    updateMessage(localMessageId, messageContent);
    return {localMessageId};
  }
});


const removeMessageMutation = mutationWithClientMutationId({
  name: 'RemoveMessage',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    deletedMessageId: {
      type: GraphQLID,
      resolve: ({id}) => id,
    },
    viewer: {
      type: userType,
      resolve: () => getViewer(),
    },
  },
  mutateAndGetPayload: ({id}) => {
    const localMessageId = fromGlobalId(id).id;
    removeMessage(localMessageId);
    return {id};
  },
});


/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createMessage: createMessageMutation,
    removeMessage: removeMessageMutation,
    updateMessage: updateMessageMutation,
    updateViewer: updateViewerMutation,
  })
});


/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export const Schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});
