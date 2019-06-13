import index from './index.interface';

export default function chooseImage(
  params = {
    type: 'album'
  }
) {
  return new Promise((resolve, reject) => {
    index.chooseImage(
      params,
      (res) => {
        resolve(res);
      },
      (err) => {
        reject(err);
      }
    );
  });
}
