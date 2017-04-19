import Logger from 'js-logger';
Logger.useDefaults({defaultLevel: Logger.DEBUG});

export default function createLogger(name){
  return Logger.get(name);
}
