import { GraphQLInt } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';
import { messageType } from './types';


export const {
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


