"use client";

function resolveImageSrc(image) {
  if (!image) return "";
  if (image.startsWith("http") || image.startsWith("/")) return image;
  return `/${image.replace(/^\/+/, "")}`;
}

export default function S3GroomingPrecision({ section }) {
  if (!section) return null;

  const backgroundSrc = resolveImageSrc(section.backgroundImage);
  const primarySpec = section.specs?.[0];
  const gridSpecs = section.specs?.slice(1) ?? [];

  return (
    <div className="relative flex h-screen w-full select-none items-center justify-center overflow-hidden font-sans">
      {backgroundSrc ? (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundSrc})` }}
          aria-hidden
        />
      ) : (
        <div className="absolute inset-0 bg-[#0a0a0c]" aria-hidden />
      )}
      <div className="absolute inset-0 bg-black/35" aria-hidden />

      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-12">
        <div className="flex w-full items-end justify-between">
          <div className="pointer-events-auto w-[340px] overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
            <div className="border-b border-white/10 bg-white/5 p-4">
              <h3 className="text-sm font-bold tracking-widest text-white">
                產品資訊
              </h3>
            </div>

            <div className="p-5">
              {primarySpec ? (
                <div className="mb-4">
                  <p className="mb-1 text-xs tracking-wider text-gray-500">
                    {primarySpec.label}
                  </p>
                  <p className="text-lg text-white">{primarySpec.value}</p>
                </div>
              ) : null}

              {gridSpecs.length > 0 ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                  {gridSpecs.map((spec) => (
                    <div key={`${spec.label}-${spec.value}`}>
                      <p className="mb-1 text-[10px] tracking-wider text-gray-500">
                        {spec.label}
                      </p>
                      <p className="text-sm font-medium text-gray-200">
                        {spec.value}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <div className="pointer-events-none w-[320px] text-right">
            {section.subtitle ? (
              <p className="mb-2 text-xs tracking-widest text-gray-500 uppercase">
                {section.subtitle}
              </p>
            ) : null}
            <h2 className="mb-3 text-xl font-bold tracking-wide text-white md:text-2xl">
              {section.title}
            </h2>
            {section.description ? (
              <p className="text-sm leading-relaxed text-gray-400">
                {section.description}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
