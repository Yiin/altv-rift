import ipc from 'node-ipc';
import { debounce } from 'lodash-es';

ipc.config.id = 'esbuildProcess';
ipc.config.retry = 1500;
ipc.config.silent = true;

export const reloadResource = debounce(async (side) => {
  ipc.connectTo('watcher', () => {
    ipc.of.watcher.on('connect', () => {
      ipc.of.watcher?.emit('restart-server', side);
      ipc.disconnect('watcher');
    });
  });
});
