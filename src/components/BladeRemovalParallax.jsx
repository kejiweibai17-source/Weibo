"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import { Play } from "lucide-react";

const BLADE_REMOVAL_VIDEO_ID = "j9MOH9FR-T8";

export default function BladeRemovalParallax() {
  const containerRef = useRef(null);
  const [markerReady, setMarkerReady] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.32], [0.9, 1], {
    clamp: true,
  });
  const opacity = useTransform(scrollYProgress, [0, 0.28], [0, 1], {
    clamp: true,
  });
  const y = useTransform(scrollYProgress, [0, 0.32], ["48px", "0px"], {
    clamp: true,
  });

  const headY = useTransform(scrollYProgress, [0.4, 0.82], ["0px", "-210px"], {
    clamp: true,
  });
  const headScale = useTransform(scrollYProgress, [0.4, 0.82], [1, 0.9], {
    clamp: true,
  });
  const headOpacity = useTransform(scrollYProgress, [0.3, 0.4], [0, 1], {
    clamp: true,
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setMarkerReady(latest >= 0.84);
  });

  return (
    <>
      <div
        ref={containerRef}
        className="relative h-[105vh] min-h-[560px] max-h-[720px] overflow-visible bg-white"
      >
        <div className="sticky top-24 flex h-[min(70vh,600px)] w-full flex-col items-center justify-center overflow-visible px-4 sm:top-28">
          <motion.div
            style={{ scale, opacity, y }}
            className="relative z-10 mx-auto w-full max-w-[clamp(240px,58vw,340px)]"
          >
            <motion.div
              style={{ y: headY, opacity: headOpacity, scale: headScale }}
              className="relative z-0 mx-auto w-[86%] -mb-[9%] pointer-events-none will-change-transform"
            >
              <img
                src="/images/head.png"
                alt="昔馬 SMASMALL 磁吸刀頭"
                className="block w-full h-auto object-contain drop-shadow-md"
              />
            </motion.div>

            <div className="relative z-20 w-full">
              <img
                src="/images/body.png"
                alt="昔馬 SMASMALL 電動刮鬍刀機身"
                className="block w-full h-auto object-contain"
              />

              <motion.button
                type="button"
                aria-label="播放磁吸刀頭拆卸示意影片"
                animate={
                  markerReady
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0 }
                }
                transition={{ type: "spring", stiffness: 280, damping: 16 }}
                onClick={() => markerReady && setVideoOpen(true)}
                className={`absolute top-[14%] left-1/2 z-30 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border-0 bg-[#00B4D8] p-0 text-white shadow-lg ${
                  markerReady
                    ? "cursor-pointer hover:scale-110 transition-transform"
                    : "pointer-events-none"
                }`}
              >
                <Play size={15} fill="currentColor" className="ml-0.5" />
              </motion.button>
            </div>
          </motion.div>

          <motion.p
            animate={markerReady ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-5 text-center text-[12px] text-[#4a7c99]"
          >
            以磁吸方式取下刀頭
          </motion.p>
        </div>
      </div>

      <AnimatePresence>
        {videoOpen && (
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
                src={`https://www.youtube.com/embed/${BLADE_REMOVAL_VIDEO_ID}?autoplay=1&rel=0`}
                title="昔馬 SMASMALL 磁吸刀頭拆卸示意"
                className="absolute inset-0 h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
