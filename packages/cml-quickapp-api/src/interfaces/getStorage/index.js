import index from './index.interface';
import { tryJsonParse } from 'chameleon-api/src/lib/utils';

export default function getStorage(key) {
  return new Promise((resolve, reject) => {
    index.getStorage(key, res => {
      if (res.errno === 0) {
        res.data = tryJsonParse(res.data);
        resolve(res.data);
      } else {
        reject(res.errMsg);
      }
    });
  });
}
