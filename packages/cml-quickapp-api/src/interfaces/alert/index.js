import ui from './index.interface';

export default function alert(opt) {
  let { message = '', confirmTitle = '确定' } = opt; 
  return new Promise((resolve, reject) => {
    ui.alert({ message, confirmTitle }, () => {
      resolve(confirmTitle);
    }, () => {
      reject(confirmTitle);
    });
  }); 
}