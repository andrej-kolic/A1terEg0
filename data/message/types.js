import {
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import { globalIdField } from 'graphql-relay';
import { nodeInterface } from '../shared/definitions'


export const messageType = new GraphQLObjectType({
  name: 'Message',
  description: 'User message',
  fields: () => ({
    id: globalIdField('Message'),
    content: {
      type: GraphQLString,
      description: 'Content of message',
    },
    createdAt: {
      type: GraphQLInt,
      description: 'Creation timestamp',
    },
  }),
  interfaces: [nodeInterface],
});
