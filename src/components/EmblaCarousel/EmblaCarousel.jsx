import React, { useCallback, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "./EmblaCarouselArrowButtons";
import { DotButton, useDotButton } from "./EmblaCarosuelDotButton";
import Image from "next/image";

const TWEEN_FACTOR_BASE = 0.2;

const EmblaCarousel = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const tweenFactor = useRef(0);
  const tweenNodes = useRef([]);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

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
    <>
      <div className="embla">
        {/* 🌟 修改 1：將控制區塊 (controls) 移到輪播圖 viewport 的上方 */}
        <div className="embla__controls">
          <div className="embla__buttons">
            <PrevButton
              onClick={onPrevButtonClick}
              disabled={prevBtnDisabled}
            />
          </div>

          <div className="embla__dots">
            {scrollSnaps.map((_, index) => (
              <DotButton
                key={index}
                onClick={() => onDotButtonClick(index)}
                className={"embla__dot".concat(
                  index === selectedIndex ? " embla__dot--selected" : "",
                )}
              />
            ))}
          </div>

          <div className="embla__buttons">
            <NextButton
              onClick={onNextButtonClick}
              disabled={nextBtnDisabled}
            />
          </div>
        </div>

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

      <div className="flex justify-center w-full mt-[-250px] relative z-50">
        <Image
          src="/images/傳奇灰.png"
          width={1000}
          height={1000}
          className="w-[550px]"
          placeholder="empty"
          alt="傳奇灰"
        />
      </div>

      {/* 🌟 修改 2：將按鈕改為高級感黑色毛玻璃，並居中對齊 */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .embla {
          max-width: 2400px;
          margin: 4rem auto;
          --slide-height: 31rem;
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
          border-radius: .5rem;
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

        /* 🌟 按鈕區塊：改為黑色毛玻璃、水平置中、圓角膠囊狀 */
        .embla__controls {
          display: flex;
          justify-content: center;
          align-items: center;
          width: fit-content;
          margin: 0 auto 2.5rem auto; /* 水平置中，並與下方圖片拉開距離 */
          padding: 0.5rem 1.25rem;
          gap: 1.5rem;
          background-color: rgba(0, 0, 0, 0.65); /* 黑色半透明底 */
          backdrop-filter: blur(12px); /* 毛玻璃模糊效果 */
          -webkit-backdrop-filter: blur(12px); /* 支援 Safari */
          border-radius: 9999px; /* 完美膠囊圓角 */
          border: 1px solid rgba(255, 255, 255, 0.1); /* 微弱的白色反光邊框 */
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          z-index: 10;
        }

        .embla__buttons {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .embla__button {
          -webkit-appearance: none;
          appearance: none;
          background-color: transparent;
          touch-action: manipulation;
          display: inline-flex;
          text-decoration: none;
          cursor: pointer;
          border: none;
          padding: 0;
          margin: 0;
          width: 2.2rem;
          height: 2.2rem;
          border-radius: 50%;
          color: white; /* 箭頭改為白色 */
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .embla__button:hover {
          background-color: rgba(255, 255, 255, 0.15); /* Hover 時微亮 */
        }

        .embla__button:disabled {
          color: rgba(255, 255, 255, 0.3);
          cursor: not-allowed;
          background-color: transparent;
        }

        .embla__button__svg {
          width: 45%;
          height: 45%;
        }

        .embla__dots {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
          align-items: center;
        }

        .embla__dot {
          -webkit-appearance: none;
          appearance: none;
          background-color: transparent;
          cursor: pointer;
          position: relative;
          padding: 0;
          margin: 0;
          width: 1.2rem;
          height: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 0;
        }

        .embla__dot:after {
          content: "";
          width: 0.4rem;
          height: 0.4rem;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.35); /* 未選中的點點 (半透明白) */
          transition: all 0.3s ease;
        }

        .embla__dot--selected:after {
          background-color: white; /* 選中的點點 (純白) */
          width: 0.5rem;
          height: 0.5rem;
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.5); /* 選中時加一點微光 */
        }
      `,
        }}
      />
    </>
  );
};

export default EmblaCarousel;
