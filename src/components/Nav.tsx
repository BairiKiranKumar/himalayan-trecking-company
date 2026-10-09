import { useRef } from "react";
import { ScrollTrigger, useGSAP } from "../lib/gsap";

export function Nav() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Solid once the page moves; stays solid all the way to the footer (a toggleClass range would drop it at max scroll).
    const nav = ref.current!;
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => nav.classList.toggle("is-solid", self.scroll() > 8),
      onRefresh: (self) => nav.classList.toggle("is-solid", self.scroll() > 8),
    });
  });

  return (
    <header ref={ref} className="nav">
      <div className="nav__bg" aria-hidden="true" />
      <a className="nav__brand" href="#top">Himalayan Trekking Co.</a>
      <nav aria-label="Primary">
        <ul className="nav__links">
          <li><a href="#treks">Treks</a></li>
          <li><a href="#route">The route</a></li>
          <li><a href="#leaders">Leaders</a></li>
          <li><a className="nav__cta" href="#book">Enquire</a></li>
        </ul>
      </nav>
    </header>
  );
}
