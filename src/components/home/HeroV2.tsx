"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const HERO_VIDEO_URL = process.env.NEXT_PUBLIC_HERO_VIDEO_URL || "";

export function HeroV2() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !HERO_VIDEO_URL) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-v2-bg-primary"
    >
      <div className="grid grid-cols-1 md:grid-cols-[35fr_65fr] min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)]">
        {/* Left — Typography block */}
        <div className="order-2 md:order-1 flex flex-col justify-center px-8 py-24 md:py-32 md:px-16 lg:px-24 xl:px-32">
          <div
            className={cn(
              "max-w-[600px] transition-all duration-700 ease-out",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            )}
            data-v2-animate
          >
            <h1 className="font-serif font-light text-[2.5rem] md:text-[4rem] lg:text-[5.5rem] leading-[1.05] text-v2-text-primary">
              Toprağın Hafızası,
              <br />
              Derinin Dili
            </h1>

            <p className="font-inter text-v2-body text-v2-text-muted max-w-[45ch] mt-6">
              El yapımı hakiki deri sandaletler. Bodrum atölyemizden, sizin
              hikayenize.
            </p>

            <Link href="/kadin" className="group inline-block mt-10">
              <span className="block font-inter text-xs tracking-[0.15em] uppercase text-v2-text-primary">
                Koleksiyonu Gör
              </span>
              <span
                aria-hidden
                className="block h-px w-12 bg-v2-text-primary/40 mt-3 transition-all duration-500 ease-out group-hover:w-16 motion-reduce:transition-none"
              />
            </Link>
          </div>
        </div>

        {/* Right — Full-bleed image / video */}
        <div className="order-1 md:order-2 relative h-[55vh] md:h-auto overflow-hidden">
          {/* Video (if URL provided) */}
          {HERO_VIDEO_URL && (
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              poster="https://res.cloudinary.com/dxqmfpa8g/image/upload/v1766832194/image_3840_1_1_j3hb5t.webp"
              onLoadedData={() => setVideoLoaded(true)}
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
                videoLoaded ? "opacity-100" : "opacity-0"
              )}
            >
              <source src={HERO_VIDEO_URL} type="video/mp4" />
            </video>
          )}

          {/* Poster image (always present as fallback) */}
          {/* TODO: GERÇEK GÖRSEL — PLACEHOLDER_hero-poster.jpg dosyasını grep'leyip değiştirin */}
          <Image
            src="https://res.cloudinary.com/dxqmfpa8g/image/upload/v1766832194/image_3840_1_1_j3hb5t.webp"
            alt="Halikarnas Sandals — el yapımı deri sandaletler"
            fill
            priority
            className={cn(
              "object-cover",
              HERO_VIDEO_URL && videoLoaded && "opacity-0"
            )}
            sizes="(max-width: 768px) 100vw, 65vw"
          />
        </div>
      </div>
    </section>
  );
}
