import { useEffect, useState } from "react";

export default function Slideshow({ slides, intervalMs = 4500 }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [slides.length, intervalMs]);

  return (
    <div className="relative overflow-hidden rounded-xl border border-line bg-white">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div key={i} className="min-w-full px-8 py-10 text-center">
            <p className="font-display text-2xl text-ink mb-3">{slide.title}</p>
            <p className="text-muted text-sm max-w-md mx-auto">{slide.body}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-1.5 pb-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-5 bg-gold" : "w-1.5 bg-line"
            }`}
          />
        ))}
      </div>
    </div>
  );
}