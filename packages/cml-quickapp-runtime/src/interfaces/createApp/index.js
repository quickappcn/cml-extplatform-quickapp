import createAppInterface from './index.interface';

export function createApp(options) {
  console.log('-------------- createApp options = ', options);
  return createAppInterface.createApp(options)
}
