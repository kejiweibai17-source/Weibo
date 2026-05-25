import React, { useCallback, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay"; // 🌟 引入自動輪播套件
import Image from "next/image";
import Copy from "@/components/Copy";
const TWEEN_FACTOR_BASE = 0.2;

const EmblaCarousel = (props) => {
  const { slides, options } = props;

  // 🌟 加入 Autoplay 插件，設定每 3 秒自動切換，且互動後不停止
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Autoplay({ delay: 3000, stopOnInteraction: false }),
  ]);

  const tweenFactor = useRef(0);
  const tweenNodes = useRef([]);

  const setTweenNodes = useCallback((emblaApi) => {
    tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
      return slideNode.querySelector(".embla__parallax__layer");
    });
  }, []);

  const setTweenFactor = useCallback((emblaApi) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }, []);

  const tweenParallax = useCallback((emblaApi, event) => {
    const engine = emblaApi.internalEngine();
    const scrollProgress = emblaApi.scrollProgress();
    const slidesInView = emblaApi.slidesInView();
    const isScrollEvent = event?.type === "scroll";

    emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      let diffToTarget = scrollSnap - scrollProgress;
      const slidesInSnap = engine.slideRegistry[snapIndex];

      if (slidesInSnap) {
        slidesInSnap.forEach((slideIndex) => {
          if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem) => {
              const target = loopItem.target();

              if (slideIndex === loopItem.index && target !== 0) {
                const sign = Math.sign(target);

                if (sign === -1) {
                  diffToTarget = scrollSnap - (1 + scrollProgress);
                }
                if (sign === 1) {
                  diffToTarget = scrollSnap + (1 - scrollProgress);
                }
              }
            });
          }

          const translate = diffToTarget * (-1 * tweenFactor.current) * 100;
          const tweenNode = tweenNodes.current[slideIndex];

          if (tweenNode) {
            tweenNode.style.transform = `translateX(${translate}%)`;
          }
        });
      }
    });
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    setTweenNodes(emblaApi);
    setTweenFactor(emblaApi);
    tweenParallax(emblaApi);

    emblaApi
      .on("reinit", setTweenNodes)
      .on("reinit", setTweenFactor)
      .on("reinit", tweenParallax)
      .on("scroll", tweenParallax)
      .on("slidefocus", tweenParallax);
  }, [emblaApi, tweenParallax, setTweenNodes, setTweenFactor]);

  if (!slides || slides.length === 0) return null;

  return (
    <section className="w-full pt-20 pb-10">
      {/* =========================================================
          🌟 新增：完美復刻圖片的左右文字排版 (黑底白字版)
          ========================================================= */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 mb-12 lg:mb-20 flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-16">
        {/* 左側：標籤與大標題 */}
        <div className="w-full lg:w-1/2">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-6 h-6 rounded-full bg-white text-black text-xs flex items-center justify-center font-bold">
              4
            </div>
            <Copy>
              <span className="text-sm font-semibold tracking-wider text-stone-700 uppercase">
                品味展現
              </span>
            </Copy>
          </div>
          <Copy>
            <h2 className="text-4xl md:text-5xl text-stone-800 lg:text-[2.5rem] font-light !leading-[1.2] tracking-wide">
              讓您的專屬空間，
              <br className="hidden md:block" />
              化為展現品味的私人藝廊。
            </h2>
          </Copy>
        </div>

        {/* 右側：兩段式描述內文 */}
        <div className="w-full lg:w-[45%] flex flex-col gap-6 text-stone-600 text-[15px] md:text-[16px] leading-relaxed lg:pt-14 font-light">
          <Copy>
            {" "}
            <p>
              昔馬 SMASMALL
              將日常的理容過程，轉化為一場純粹的自我對話。無論是晨間的快速整理、出差旅途中的隨身攜帶，或是重要時刻前的精心準備，它都能以最優雅的姿態，完美融入您的生活場景。
            </p>
          </Copy>
          <Copy>
            {" "}
            <p>
              從獨具匠心的全合金壓鑄，到極致貼合的剃鬚體驗，這不僅僅是一把刮鬍刀，更是展現個人風格的質感配件。每一次的俐落刮除，都在詮釋著成熟男士對細節的極致追求。
            </p>
          </Copy>
        </div>
      </div>

      {/* =========================================================
          🌟 輪播區塊 (已移除箭頭與點點，純淨自動輪播)
          ========================================================= */}
      <div className="embla">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {slides.map((slide, idx) => (
              <div className="embla__slide" key={idx}>
                <div className="embla__parallax">
                  <div className="embla__parallax__layer">
                    <img
                      className="embla__slide__img embla__parallax__img"
                      src={slide.image}
                      alt={slide.title}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🌟 底部置中的 GIF */}
      <div className="flex justify-center w-full mt-[-100px] md:mt-[-250px] relative z-50 px-4 pointer-events-none">
        <Image
          src="/images/ezgif.com-animated-gif-maker.gif"
          width={1000}
          height={1000}
          className="w-full max-w-[300px] md:max-w-[550px]"
          placeholder="empty"
          alt="傳奇灰"
        />
      </div>

      {/* 🌟 乾淨的樣式表 (已移除所有按鈕樣式) */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .embla {
          max-width: 2400px;
          margin: 0 auto;
          --slide-height: 35rem;
          --slide-spacing: 2rem;
          --slide-size: 60%;
        }

        .embla__viewport {
          overflow: hidden;
        }

        .embla__container {
          display: flex;
          touch-action: pan-y pinch-zoom;
          margin-left: calc(var(--slide-spacing) * -1);
        }

        .embla__slide {
          transform: translate3d(0, 0, 0);
          flex: 0 0 var(--slide-size);
          margin-right: 50px;
          margin-left: 50px;
          min-width: 0;
          padding-left: var(--slide-spacing);
        }

        .embla__parallax {
          height: var(--slide-height);
          overflow: hidden;
          background-color: #111;
       
        }

        .embla__parallax__layer {
          position: relative;
          height: 100%;
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .embla__parallax__img {
          max-width: none;
          flex: 0 0 calc(92% + (var(--slide-spacing) * 2));
          object-fit: cover;
        }

        /* 🌟 RWD 手機與平板尺寸最佳化 */
        @media (max-width: 1024px) {
          .embla {
            --slide-height: 28rem;
            --slide-size: 75%;
          }
          .embla__slide {
            margin-right: 20px;
            margin-left: 20px;
          }
        }

        @media (max-width: 768px) {
          .embla {
            --slide-height: 22rem; 
            --slide-spacing: 1rem; 
            --slide-size: 82%; 
          }
          .embla__slide {
            margin-right: 0px;
            margin-left: 0px;
          }
        }
        `,
        }}
      />
    </section>
  );
};

export default EmblaCarousel;
