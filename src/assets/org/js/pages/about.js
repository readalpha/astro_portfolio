/*
このファイルの用途・使用方法
https://github.com/q-jutaku/coding_rule/blob/main/js.md#pagecommonjs
*/
import inView from "modules/inView";

export const about = () => {
  const { window: w, document: d } = window;
  gsap.registerPlugin(ScrollTrigger);
  const addNoSlideAnime = "add-noSlideAnime";
  /*-------- 
  inView
  ---------*/
  w.addEventListener("load", () => {
    // 一度だけ発火するフラグ
    let hasScrolled = false;
    const onScroll = () => {
      if (!hasScrolled) {
        hasScrolled = true; // フラグを立てる
        new inView({
          visibleType: w.innerWidth > 600 ? 120 : 80, // innerWidthで条件分岐
        });
        // イベントリスナーを解除
        w.removeEventListener("scroll", onScroll);
      }
    };

    // スクロールイベントリスナーを追加
    w.addEventListener("scroll", onScroll);
  });

  /**
   * スクロール連動アニメーション
   */
  w.addEventListener("load", () => {
    const scrollTarget = d.querySelectorAll(".js-scrollTarget");
    const scrollSlides = d.querySelectorAll(".js-scrollSlide");
    const sampleSlideInner = d.querySelector(".js-sampleSlideInner");
    //高さが最も高いスライドの値計算
    const calcSlidePosY = () => {
      const offset = innerHeight - sampleSlideInner.offsetHeight;
      return offset > 80 ? offset / 2 : null;
    };
    //各スライドの高さを、最初about-trans_wrapのスライドの高さに合わせる
    // const equalizeSlideHeights = (reset) => {
    //   scrollTarget.forEach((target) => {
    //     const slides = target.querySelectorAll(".js-scrollSlide");
    //     slides.forEach((slide, i) => {
    //       const baseHeight = slides[0].offsetHeight;
    //       if (reset === true) {
    //         slide.style.height = "";
    //       } else {
    //         if (i > 0) slide.style.height = `${baseHeight}px`;
    //       }
    //     });
    //   });
    // };
    //各スライドの高さを、一番高いスライドに合わせる
    const getHighestHeight = () => {
      let maxHeight = 0;
      scrollSlides.forEach((slide) => {
        const slideHeight = slide.offsetHeight; // 要素の高さを取得
        if (slideHeight > maxHeight) {
          maxHeight = slideHeight; // 最大値を更新
        }
      });
      return maxHeight;
    };
    const equalizeSlideHeights = (reset) => {
      // 高さの最大値を取得
      const maxHeight = getHighestHeight();

      // すべてのスライドの高さを最大値に統一
      if (reset) {
      } else {
        scrollSlides.forEach((slide) => {
          slide.style.height = `${maxHeight}px`;
        });
      }
    };

    /**
     * 最後ではない && 最も高さが高いスライドの高さ取得し、それが画面幅の高さよりも高いかどうかを判定
     */
    const canSlideAnimation = () => {
      const sampleSlideInner = d.querySelector(".js-sampleSlideInner");
      return innerHeight - sampleSlideInner.offsetHeight > 80;
    };

    //GSAP作成
    const initializeScrollAnimations = () => {
      scrollTarget.forEach((target) => {
        const slides = target.querySelectorAll(".js-scrollSlide");
        slides.forEach((slide, i) => {
          const nextSlide = slides[i + 1];
          const slideInner = slide.querySelector(".about-trans_item_inner");
          slide.style.position = "sticky";

          if (nextSlide) {
            gsap.to(slideInner, {
              opacity: 0,
              scale: 0.9,
              scrollTrigger: {
                trigger: nextSlide,
                start: "top bottom",
                end: () => {
                  // 現在のスクロール位置から計算
                  const endPos = slide
                    .querySelector(".about-trans_ttl")
                    .getBoundingClientRect().bottom;
                  return `top${endPos + w.scrollY}px`; // ドキュメント全体のスクロール位置
                },
                scrub: true,
              },
            });
          }
        });
      });

      //スライドのポジション（top）の値計算・適用
      scrollSlides.forEach((slide) => {
        if (calcSlidePosY() === null) {
          slide.style.top = "";
        } else {
          slide.style.top = `${calcSlidePosY()}px`;
        }
      });
    };
    const destroyScrollTrigger = () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill()); // 既存のトリガーを削除
      scrollSlides.forEach((slide) => {
        slide.style.top = "";
        slide.style.position = "relative";
        slide.style.height = "";
        d.body.classList.add(addNoSlideAnime);
      });
    };

    // 初期化
    if (innerWidth > 767 && canSlideAnimation()) {
      d.body.classList.remove(addNoSlideAnime);
      equalizeSlideHeights();
      initializeScrollAnimations();
    } else {
      d.body.classList.add(addNoSlideAnime);
    }

    // リサイズ時のリフレッシュ
    w.addEventListener("resize", () => {
      destroyScrollTrigger();
      if (innerWidth > 767 && canSlideAnimation()) {
        d.body.classList.remove(addNoSlideAnime);
        equalizeSlideHeights();
        initializeScrollAnimations(); // 再計算してアニメーション再登録
      } else {
        d.body.classList.add(addNoSlideAnime);
      }
    });
  });
};
