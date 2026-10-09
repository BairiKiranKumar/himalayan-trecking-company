import { Fragment, useRef, useState } from "react";
import { gsap, MQ, useGSAP } from "../lib/gsap";
import { leaders } from "../data";

export function Leaders() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MQ.fine} and ${MQ.motion}`, () => {
        const names = root.current!.querySelector<HTMLElement>(".leaders__names")!;
        const cursor = root.current!.querySelector<HTMLElement>(".leaders__cursor")!;
        const xTo = gsap.quickTo(cursor, "x", { duration: 0.55, ease: "power3" });
        const yTo = gsap.quickTo(cursor, "y", { duration: 0.55, ease: "power3" });
        // Sit just right of the pointer so the hovered name stays readable.
        const OFFSET = 28;
        gsap.set(cursor, { yPercent: -50, opacity: 0, scale: 0.85, transformOrigin: "0% 50%" });

        let shown = false;
        const show = (e: PointerEvent) => {
          if (!(e.target as HTMLElement).closest(".leader-name")) return hide();
          if (!shown) {
            // Jump to the pointer on entry instead of sliding in from the last exit point.
            xTo(e.clientX + OFFSET, e.clientX + OFFSET);
            yTo(e.clientY, e.clientY);
            gsap.to(cursor, { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out", overwrite: "auto" });
            shown = true;
            return;
          }
          xTo(e.clientX + OFFSET);
          yTo(e.clientY);
        };
        const hide = () => {
          if (!shown) return;
          shown = false;
          gsap.to(cursor, { opacity: 0, scale: 0.85, duration: 0.3, ease: "power2.in", overwrite: "auto" });
        };
        names.addEventListener("pointermove", show);
        names.addEventListener("pointerleave", hide);
        return () => {
          names.removeEventListener("pointermove", show);
          names.removeEventListener("pointerleave", hide);
        };
      });
    },
    { scope: root },
  );

  const last = leaders.length - 1;

  return (
    <section ref={root} className="leaders" id="leaders" aria-labelledby="leaders-title">
      <h2 id="leaders-title" className="sr-only">Trek leaders</h2>

      <p className="leaders__names">
        <span className="leaders__muted">Your trek is led by </span>
        {leaders.map((l, i) => (
          <Fragment key={l.name}>
            {i === last && <span className="leaders__muted">and </span>}
            <span className="leader-name" onPointerEnter={() => setActive(i)}>
              {l.name}
              <span className="sr-only">, {l.role}, {l.years} seasons</span>
            </span>
            <span className="leaders__muted">{i === last ? "." : i === last - 1 ? " " : ", "}</span>
          </Fragment>
        ))}
      </p>

      <p className="leaders__note">
        Every leader holds a wilderness first aid certificate and has led their routes for at least five seasons. Most
        were born within a day&rsquo;s walk of the trailhead.
      </p>

      {/* Phones and touch: no hover, so the leaders become a swipeable row of portraits. */}
      <ul className="leaders__row" aria-hidden="true">
        {leaders.map((l) => (
          <li key={l.name} className="leader-card">
            <img src={l.image} alt="" width={800} height={1067} loading="lazy" decoding="async" />
            <strong>{l.name}</strong>
            <span>{l.role}</span>
          </li>
        ))}
      </ul>

      <div className="leaders__cursor" aria-hidden="true">
        <div className="leaders__portrait">
          {leaders.map((l, i) => (
            <img key={l.name} src={l.image} alt="" width={800} height={1067} decoding="async" className={i === active ? "is-active" : undefined} />
          ))}
        </div>
        <p className="leaders__caption">
          {leaders[active].role}
          <span>{leaders[active].years} seasons</span>
        </p>
      </div>
    </section>
  );
}
