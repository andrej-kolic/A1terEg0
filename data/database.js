/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import createLogger from './server-logger';

const log = createLogger('server.schema');


class Entity {
  constructor(payload){
    Object.assign(this, payload);
  }
}

// Model types
class UserEntity extends Entity {}
class MessageEntity extends Entity {}

// Mock data
const viewer = new UserEntity({id: '1', name: 'Guest'});

const messages = Array(25).fill(1).map((_, i) => (
  new MessageEntity({ id: `${i}`, content: `msg${i}` })
));

let widgetId = 4;

module.exports = {
  // Export methods that your schema can use to interact with your database
  getUser: (id) => id === viewer.id ? viewer : null,
  getViewer: () => viewer,
  updateViewer: (payload) => {
    Object.assign(viewer, payload);
    return viewer;
  },

  getMessage: (id) => messages.find(w => w.id === id),
  getMessages: () => messages,
  createMessage: (content, userId) => {
    const message = new MessageEntity({ id: widgetId++, content });
    messages.push(message);
    log.debug('created message:', message);
    return message;
  },
  updateMessage: (id, content) => {
    log.debug('updateMessage:', id, content);
    const message = module.exports.getMessage(id);
    Object.assign(message, { content });
    log.debug('updated message:', message);
    return message;
  },
  removeMessage: (messageId) => {
    const index = messages.findIndex(m => m.id === messageId);
    log.debug('messageIndex', messageId);
    messages.splice(index, 1);
  },
  UserEntity,
  MessageEntity,
};
