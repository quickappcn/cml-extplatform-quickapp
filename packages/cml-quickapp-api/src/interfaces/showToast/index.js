import ui from './index.interface';
const SHORT_TIME = 0
const LONG_TIME = 1
const DEFAULT_DURATION = 2000
const BOUNDARY_LINE = 1000

export default function showToast(opt) {
  let { message = '', duration = DEFAULT_DURATION } = opt;
  ui.showToast({
    message,
    duration: duration > BOUNDARY_LINE ? LONG_TIME : SHORT_TIME
  });
}