import index from './index.interface';

export default function navigateBack(backPageNum = -1) {

  if (typeof backPageNum !== "number") {
    index.navigateBack(-1);
  } else if (backPageNum < 0) {
    index.navigateBack(backPageNum);
  }
}
