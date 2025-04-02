/*
このファイルの用途・使用方法
https://github.com/q-jutaku/coding_rule/blob/main/js.md#pagecommonjs
*/
import inView from "modules/inView";

export const initiative = () => {
  const { window: w, document: d } = window;
  /*-------- 
  inView
  ---------*/
  w.addEventListener("load", () => {
    /*-------- 
    inViewの遅延
    ---------*/
    const inViewElements = document.querySelectorAll(".js-inView");

    const applyTransitionDelay = () => {
      inViewElements.forEach((element, index) => {
        if (isElementPartiallyInViewport(element)) {
          element.style.transitionDelay = `${index * 0.1}s`;
          element.classList.add("is-visible"); // 任意のアニメーションクラス
        }
      });
    };

    const isElementPartiallyInViewport = (el) => {
      const rect = el.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    };

    // 初期チェック
    applyTransitionDelay();
    /*-------- 
    inview
    ---------*/
    new inView({
      visibleType: 600 < innerWidth ? 120 : 80,
    });

    /*-------- 
    スクロール許可
    ---------*/

    const enableVerticalPageScrollOnElement = (elementSelector) => {
      const scrollElement = document.querySelector(elementSelector);

      if (scrollElement) {
        // PC用のスクロール制御 (ホイールイベント)
        scrollElement.addEventListener("wheel", (event) => {
          handleWheelScroll(event, scrollElement);
        });

        // モバイル用のタッチスクロール制御
        let startY = 0;

        scrollElement.addEventListener("touchstart", (event) => {
          startY = event.touches[0].clientY; // タッチ開始位置を記録
        });

        scrollElement.addEventListener("touchmove", (event) => {
          handleTouchScroll(event, scrollElement, startY);
        });
      }
    };

    const handleWheelScroll = (event, scrollElement) => {
      const deltaY = event.deltaY;

      const canScrollHorizontally =
        scrollElement.scrollLeft > 0 ||
        scrollElement.scrollLeft <
          scrollElement.scrollWidth - scrollElement.clientWidth;

      if (!canScrollHorizontally) {
        // 横スクロールができない場合、イベントをページに伝える
        event.stopPropagation();
        event.preventDefault();
        window.scrollBy(0, deltaY);
      }
    };

    const handleTouchScroll = (event, scrollElement, startY) => {
      const currentY = event.touches[0].clientY;
      const deltaY = startY - currentY; // 縦方向のスクロール量を計算

      const canScrollHorizontally =
        scrollElement.scrollLeft > 0 ||
        scrollElement.scrollLeft <
          scrollElement.scrollWidth - scrollElement.clientWidth;

      if (!canScrollHorizontally) {
        // 横スクロールができない場合、イベントをページに伝える
        event.stopPropagation();
        event.preventDefault();
        window.scrollBy(0, deltaY);
      }
    };

    // 使用例
    enableVerticalPageScrollOnElement(".js-scrollOn");
  });
};
