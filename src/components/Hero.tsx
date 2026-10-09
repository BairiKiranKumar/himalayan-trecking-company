import { useEffect, useRef, useState } from "react";
import { gsap, MQ, useGSAP } from "../lib/gsap";
import { ArrowDownRightIcon, PauseIcon, PlayIcon } from "@phosphor-icons/react";
import { Magnetic } from "./Magnetic";

/** Phones get a portrait crop of the film framed on the peak and the trekker. */
const SMALL = "(max-width: 767.98px)";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);

  // Play only while on screen. Reduced motion starts paused; the button still works.
  useEffect(() => {
    const v = video.current!;
    v.muted = true;
    if (matchMedia(MQ.reduce).matches) userPaused.current = true;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !userPaused.current) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.05 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const v = video.current!;
    userPaused.current = !v.paused;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        const section = root.current!;
        const card = section.querySelector<HTMLElement>(".hero__card")!;

        // Scale at which the inset, rounded card overfills the section on every side, corners included.
        const coverScale = () => {
          const r = parseFloat(getComputedStyle(card).borderTopLeftRadius) || 0;
          const halfW = card.offsetWidth / 2;
          const halfH = card.offsetHeight / 2;
          const cx = card.offsetLeft + halfW;
          const cy = card.offsetTop + halfH;
          return Math.max(
            (cx + r) / halfW,
            (section.clientWidth - cx + r) / halfW,
            (cy + r) / halfH,
            (section.clientHeight - cy + r) / halfH,
          );
        };

        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(card, { scale: coverScale }, { scale: 1, duration: 0.55 }, 0)
          .fromTo(card, { y: 0 }, { y: () => section.clientHeight * 0.35, duration: 1 }, 0)
          .to(".hero__copy", { opacity: 0, duration: 0.45 }, 0.15);
      });

      mm.add(`${MQ.fine} and ${MQ.motion}`, () => {
        const title = root.current!.querySelector(".hero__title")!;
        const xTo = gsap.quickTo(title, "x", { duration: 1, ease: "power3" });
        const yTo = gsap.quickTo(title, "y", { duration: 1, ease: "power3" });
        const move = (e: PointerEvent) => {
          xTo((e.clientX / innerWidth - 0.5) * 20);
          yTo((e.clientY / innerHeight - 0.5) * 20);
        };
        root.current!.addEventListener("pointermove", move);
        return () => root.current?.removeEventListener("pointermove", move);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="hero" id="top" aria-label="Introduction">
      <div className="hero__card">
        <video
          ref={video}
          className="hero__video"
          poster={matchMedia(SMALL).matches ? "/media/hero-poster-mobile.jpg" : "/media/hero-poster.jpg"}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          <source src="/media/hero-mobile.mp4" type="video/mp4" media={SMALL} />
          <source src="/media/hero-1920.mp4" type="video/mp4" />
        </video>
        <div className="hero__shade" aria-hidden="true" />
      </div>

      {/* Outside the card so the cover scale never pushes text past the viewport edge. */}
      <div className="hero__copy">
        <div className="hero__text">
          <h1 className="hero__title">
            The high Himalaya, <em>on foot.</em>
          </h1>
          <div className="hero__foot">
            <p className="hero__lede">
              Small-group treks across Uttarakhand, Himachal, Sikkim and Ladakh, led by people who grew up on these trails.
            </p>
            <Magnetic>
              <a className="btn btn--light" href="#treks">
                Find your trek
                <ArrowDownRightIcon size={18} weight="bold" aria-hidden="true" />
              </a>
            </Magnetic>
          </div>
        </div>

        <button className="hero__toggle" type="button" onClick={toggle} aria-label={playing ? "Pause background film" : "Play background film"}>
          {playing ? <PauseIcon size={16} weight="fill" aria-hidden="true" /> : <PlayIcon size={16} weight="fill" aria-hidden="true" />}
          <span>{playing ? "Pause" : "Play"}</span>
        </button>
      </div>
    </section>
  );
}
