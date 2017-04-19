/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

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
} from 'graphql-relay';

import {
  // Import methods that your schema can use to interact with your database
  UserEntity,
  MessageEntity,
  getUser,
  getViewer,
  getMessage,
  getMessages,
  createMessage,
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

const { connectionType: messageConnection } =
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

const messageMutation = mutationWithClientMutationId({
  name: 'CreateMessage',
  inputFields: {
    messageContent: {
      type: new GraphQLNonNull(GraphQLString)
    },
    userId: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  outputFields: {
    message: {
      type: messageType,
      resolve: payload => getMessage(payload.messageId)
    },
    user: {
      type: userType,
      resolve: payload => getUser(payload.userId)
    }
  },
  mutateAndGetPayload: ({ messageContent, userId }) => {
    const newMessage = createMessage(messageContent, userId);
    return {
      messageId: newMessage.id,
      userId,
    };
  }
});


/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createMessage: messageMutation
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
