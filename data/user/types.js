import { GraphQLObjectType, GraphQLString } from 'graphql';
import {
  connectionArgs,
  connectionFromArray,
  globalIdField,
} from 'graphql-relay';

import { getMessages } from '../database';
import { nodeInterface } from '../shared/definitions';
import { messageConnection } from '../message/connections';


export const userType = new GraphQLObjectType({
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
        return { ...connectionFromArray(messages, args), count: messages.length };
      },
    },
  }),
  interfaces: [nodeInterface],
});
