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
    console.log(this);
  }
}

// Model types
class UserEntity extends Entity {}
class WidgetEntity extends Entity {}

// Mock data
const viewer = new UserEntity({id: '1', name: 'Guest'});

const widgets = ['W 1', 'W 2', 'W 3'].map((name, i) => (
  new WidgetEntity({ id: `${i}`, name })
));

let widgetId = 4;

module.exports = {
  // Export methods that your schema can use to interact with your database
  getUser: (id) => id === viewer.id ? viewer : null,
  getViewer: () => viewer,
  getWidget: (id) => widgets.find(w => w.id === id),
  getWidgets: () => widgets,
  createMessage: (content, userId) => {
    const message = new WidgetEntity({ id: widgetId++, name: content });
    widgets.push(message);
    // log.debug('***', message);
    return message;
  },
  UserEntity,
  WidgetEntity,
};
