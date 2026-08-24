"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";

export default function SeriesProductVideo({
  sectionTitle = "CALIBRE AMB+",
  sectionSubtitle = "",
  productImage,
  cableImage,
  markerLabel = "A",
  youtubeId,
  coverImage,
}) {
  const sectionRef = useRef(null);
  const [markerReady, setMarkerReady] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.32], [0.88, 1], {
    clamp: true,
  });
  const opacity = useTransform(scrollYProgress, [0, 0.28], [0, 1], {
    clamp: true,
  });
  const y = useTransform(scrollYProgress, [0, 0.32], ["80px", "0px"], {
    clamp: true,
  });
  const cableY = useTransform(scrollYProgress, [0.38, 0.82], ["80px", "-56px"], {
    clamp: true,
  });
  const cableOpacity = useTransform(scrollYProgress, [0.38, 0.52], [0, 1], {
    clamp: true,
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setMarkerReady(latest >= 0.86);
  });

  const poster = coverImage || productImage;

  return (
    <>
      <div
        ref={sectionRef}
        className="relative z-10 h-[130vh] bg-white shadow-[0_-10px_50px_rgba(0,0,0,0.3)]"
      >
        <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="z-20 mb-6 text-center"
          >
            <h2 className="mb-1 text-3xl font-bold tracking-tight text-black sm:text-4xl">
              {sectionTitle}
            </h2>
            {sectionSubtitle ? (
              <p className="text-sm text-gray-600 sm:text-base">{sectionSubtitle}</p>
            ) : null}
          </motion.div>

          <motion.div
            style={{ scale, opacity, y }}
            className="relative z-10 flex w-full max-w-[min(72vw,340px)] flex-col items-center sm:max-w-[460px]"
          >
            <div className="relative w-full">
              <img
                src={productImage}
                alt={sectionTitle}
                className="relative z-10 block h-auto w-full object-contain"
              />

              <motion.button
                type="button"
                aria-label="播放產品影片"
                animate={
                  markerReady && youtubeId
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0 }
                }
                transition={{ type: "spring", stiffness: 280, damping: 16 }}
                onClick={() => markerReady && youtubeId && setVideoOpen(true)}
                className={`absolute top-[30%] left-[35%] z-20 flex h-8 w-8 items-center justify-center rounded-full border-0 bg-[#ea580c] p-0 text-xs font-bold text-white shadow-lg ${
                  markerReady && youtubeId
                    ? "cursor-pointer transition-transform hover:scale-110"
                    : "pointer-events-none"
                }`}
              >
                {markerLabel}
              </motion.button>
            </div>

            {cableImage ? (
              <div className="-mt-[10%] flex w-full justify-center">
                <motion.div
                  style={{ y: cableY, opacity: cableOpacity }}
                  className="pointer-events-none w-[18%]"
                >
                  <img
                    src={cableImage}
                    alt="充電線"
                    className="ml-0 block h-auto w-full object-contain drop-shadow-lg xl:ml-2"
                  />
                </motion.div>
              </div>
            ) : null}
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {videoOpen && youtubeId ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 px-4"
            onClick={() => setVideoOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-2xl bg-black shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label="關閉影片"
                onClick={() => setVideoOpen(false)}
                className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-xl leading-none text-white transition-colors hover:bg-black/80"
              >
                ×
              </button>
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
                title={sectionTitle}
                className="absolute inset-0 h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {!videoOpen && poster ? (
        <span className="sr-only">影片封面：{poster}</span>
      ) : null}
    </>
  );
}
