import { useRef } from "react";
import { gsap, MQ, useGSAP } from "../lib/gsap";
import { gallery } from "../data";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { Magnetic } from "./Magnetic";

export function FeaturedTrek() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current!;
      const track = section.querySelector<HTMLElement>(".feature__track")!;
      const frames = gsap.utils.toArray<HTMLElement>(".feature__frame", section);
      const mm = gsap.matchMedia();

      mm.add(`${MQ.horizontal} and ${MQ.motion}`, () => {
        const distance = () => track.scrollWidth - section.clientWidth;
        const scroll = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => "+=" + distance(),
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        frames.forEach((frame) => {
          gsap.fromTo(
            frame.querySelector("img"),
            { xPercent: -7 },
            {
              xPercent: 7,
              ease: "none",
              scrollTrigger: { trigger: frame, containerAnimation: scroll, start: "left right", end: "right left", scrub: true },
            },
          );
        });
      });

      // Small screens: frames stack, parallax runs vertically, nothing pins.
      mm.add(`(max-width: 899.98px) and ${MQ.motion}`, () => {
        frames.forEach((frame) => {
          gsap.fromTo(
            frame.querySelector("img"),
            { yPercent: -7 },
            { yPercent: 7, ease: "none", scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true } },
          );
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="feature" aria-labelledby="feature-title">
      <div className="feature__track">
        <div className="feature__intro">
          <h2 id="feature-title" className="feature__title">
            Rupin Pass, <em>end to end.</em>
          </h2>
          <dl className="feature__stats">
            <div><dt>Days</dt><dd>8</dd></div>
            <div><dt>Highest point</dt><dd>4,650<small>m</small></dd></div>
            <div><dt>On foot</dt><dd>50<small>km</small></dd></div>
          </dl>
          <p className="feature__text">
            The route our leaders pick as their favourite. Cliff villages, forest, wide meadows, a snow gully, and the
            orchards of Kinnaur at the end. Departures in June and September.
          </p>
          <Magnetic>
            <a className="btn btn--primary" href="#book" onClick={() => window.dispatchEvent(new CustomEvent("enquire", { detail: "rupin" }))}>
              Enquire
              <ArrowUpRightIcon size={18} weight="bold" aria-hidden="true" />
            </a>
          </Magnetic>
        </div>

        {gallery.map((g, i) => (
          <figure key={g.image} className={`feature__frame ${i % 2 ? "feature__frame--tall" : "feature__frame--wide"}`}>
            <div className="feature__media">
              <img src={g.image} alt={`${g.place} on the Rupin Pass trek`} width={1800} height={1200} loading="lazy" decoding="async" />
            </div>
            <figcaption>
              <span className="feature__day">{g.day}</span>
              <strong>{g.place}</strong>
              <span className="feature__line">{g.line}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
