
//スクロール禁止
//参考：https://spyweb.media/2017/09/21/modal-window-fixed-background-also-support-ios/
let overlayHeight;
let currentY;
let isTop = false;
let isBottom = false;
let touchStartY;
let handler;
window.addEventListener('touchstart', function (e) {
  touchStartY = e.changedTouches[0].clientY;
});
const lockScroll = function (e) {
  currentY = e.changedTouches[0].clientY;
  overlayHeight = this.clientHeight;
  isTop = touchStartY <= currentY && this.scrollTop <= 0;
  isBottom = touchStartY >= currentY && this.scrollHeight - this.scrollTop <= overlayHeight;
  if (isTop || isBottom) {
    if (e.cancelable) {
      e.preventDefault();
    }

  }
};

const lockModal = (overlay) => {
  handler = lockScroll.bind(overlay);
  window.addEventListener('touchmove', handler, { passive: false });
}
const releaseModal = () => {
  window.removeEventListener('touchmove', handler, { passive: false });
}

export { lockModal, releaseModal };