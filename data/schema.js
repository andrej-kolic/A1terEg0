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


import { nodeField } from './shared/definitions'
import { userType } from './user/types';
import { updateViewerMutation } from './user/mutations';

import {
  updateMessageMutation,
  createMessageMutation,
  removeMessageMutation
} from './message/mutations';

const log = createLogger('server.schema');


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