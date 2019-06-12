// import instance from './getWidth.interface';

// function getWidth() {
//   return new Promise((resolve, reject) => {
//     quickapp.device.getInfo({
//       success: res => resolve(res.screenWidth),
//       fail: err => reject(err)
//     })
//   })
// }
// export default async function px2cpx(px) {

//   if (typeof px !== 'number') {
//     console.error('Parameter must be a number');
//     return;
//   }

//   const viewportWidth = await getWidth();
//   const cpx = +(750 / viewportWidth * px).toFixed(3);
//   return cpx;
// }
