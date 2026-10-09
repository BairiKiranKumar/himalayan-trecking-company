import { useRef } from "react";
import { gsap, MQ, SplitText, useGSAP } from "../lib/gsap";
import { asset } from "../lib/asset";

function Inline({ src, alt }: { src: string; alt: string }) {
  return <img className="manifesto__img" src={src} alt={alt} width={240} height={150} loading="lazy" decoding="async" />;
}

export function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        SplitText.create(".manifesto__text", {
          type: "words",
          wordsClass: "manifesto__word",
          autoSplit: true,
          onSplit: () => {
            // Words and inline photos reveal together, in reading order; photos also grow in as they are reached.
            const parts = gsap.utils.toArray<HTMLElement>(".manifesto__word, .manifesto__img", root.current);
            const tl = gsap.timeline({
              scrollTrigger: { trigger: ".manifesto__text", start: "top 80%", end: "bottom 50%", scrub: true },
            });
            tl.fromTo(parts, { opacity: 0.14 }, { opacity: 1, ease: "none", stagger: 0.1, duration: 0.3 }, 0);
            parts.forEach((el, i) => {
              if (el.tagName === "IMG") tl.fromTo(el, { scale: 0.6 }, { scale: 1, ease: "power2.out", duration: 0.6 }, i * 0.1);
            });
            return tl;
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="manifesto" aria-label="How we trek">
      <p className="manifesto__text">
        We walk slowly <Inline src={asset("media/trek-kuari.webp")} alt="Oak forest and snow peaks on the Kuari Pass" /> on purpose.
        Groups of twelve at most, led by people <Inline src={asset("media/leader-2.webp")} alt="Ananya Negi, trek leader" /> from
        the valleys we trek, on routes <Inline src={asset("media/gallery-2.webp")} alt="Tents beside a glacial stream" /> we have
        walked every season for years.
      </p>
    </section>
  );
}
