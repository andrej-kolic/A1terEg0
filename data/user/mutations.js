import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import { getViewer, updateViewer } from '../database';
import { userType } from './types';

import createLogger from '../server-logger';

const log = createLogger('server.user.mutations');


export const updateViewerMutation = mutationWithClientMutationId({
  name: 'UpdateViewer',
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    avatar: {
      type: GraphQLString
    },
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

