import ipc from 'node-ipc';
import { debounce } from 'lodash-es';

ipc.config.id = 'esbuildProcess';
ipc.config.retry = 1500;
ipc.config.silent = true;

export const reloadResource = debounce(() => {
  ipc.connectTo('altvServer', () => {
    ipc.of.altvServer.on('connect', () => {
      ipc.of.altvServer.emit('restart');
    });
  });
}, 3000);
