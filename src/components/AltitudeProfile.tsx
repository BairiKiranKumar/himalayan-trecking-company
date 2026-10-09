import { useRef } from "react";
import { gsap, MQ, useGSAP } from "../lib/gsap";
import { camps, formatAlt } from "../data";

const VW = 1000;
const VH = 400;
const KM = camps[camps.length - 1].km;
const ALT_MIN = 1000;
const ALT_MAX = 5200;
const GRID = [2000, 3000, 4000, 5000];

const xs = camps.map((c) => c.km);
const ys = camps.map((c) => c.alt);

// Monotone cubic (Fritsch-Carlson) tangents: smooth, and never overshoots a camp's real altitude.
const slopes = (() => {
  const n = xs.length;
  const d = xs.slice(0, -1).map((x, i) => (ys[i + 1] - ys[i]) / (xs[i + 1] - x));
  const m = xs.map((_, i) => (i === 0 ? d[0] : i === n - 1 ? d[n - 2] : d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2));
  d.forEach((di, i) => {
    if (di === 0) {
      m[i] = m[i + 1] = 0;
      return;
    }
    const a = m[i] / di;
    const b = m[i + 1] / di;
    const s = a * a + b * b;
    if (s > 9) {
      const t = 3 / Math.sqrt(s);
      m[i] = t * a * di;
      m[i + 1] = t * b * di;
    }
  });
  return m;
})();

function altAt(km: number) {
  let i = 0;
  while (i < xs.length - 2 && km > xs[i + 1]) i++;
  const h = xs[i + 1] - xs[i];
  const t = Math.min(Math.max((km - xs[i]) / h, 0), 1);
  const t2 = t * t;
  const t3 = t2 * t;
  return (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h * slopes[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h * slopes[i + 1];
}

const sx = (km: number) => (km / KM) * VW;
const sy = (alt: number) => VH - ((alt - ALT_MIN) / (ALT_MAX - ALT_MIN)) * VH;

const line = xs.reduce((path, x, i) => {
  if (i === 0) return `M${sx(x)},${sy(ys[0])}`;
  const h = x - xs[i - 1];
  const c1 = `${sx(xs[i - 1] + h / 3)},${sy(ys[i - 1] + (slopes[i - 1] * h) / 3)}`;
  const c2 = `${sx(x - h / 3)},${sy(ys[i] - (slopes[i] * h) / 3)}`;
  return `${path} C${c1} ${c2} ${sx(x)},${sy(ys[i])}`;
}, "");
const area = `${line} L${VW},${VH} L0,${VH} Z`;

const highest = camps.reduce((a, b) => (b.alt > a.alt ? b : a));
const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/** One odometer column: a 0 to 9 strip clipped to a single digit, moved with transform only. */
function OdoColumn() {
  return (
    <span className="odo__col">
      <span className="odo__strip">
        {DIGITS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </span>
    </span>
  );
}

export function AltitudeProfile() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current!;
      const chart = section.querySelector<HTMLElement>(".alt__chart")!;
      const reveal = section.querySelector<HTMLElement>(".alt__reveal")!;
      const revealInner = section.querySelector<HTMLElement>(".alt__reveal-inner")!;
      const walker = section.querySelector<HTMLElement>(".alt__walker")!;
      const markers = gsap.utils.toArray<HTMLElement>(".alt__camp", section);
      const strips = gsap.utils.toArray<HTMLElement>(".odo__strip", section);
      const dayEl = section.querySelector<HTMLElement>("[data-day]")!;
      const placeEl = section.querySelector<HTMLElement>("[data-place]")!;
      const kmEl = section.querySelector<HTMLElement>("[data-km]")!;

      let w = chart.clientWidth;
      let h = chart.clientHeight;
      let lastCamp = -1;
      let lastTens = -1;
      const shown = [-1, -1, -1];

      // Altitude in tens of metres, one strip per digit: thousands, hundreds, tens.
      const setAltitude = (alt: number) => {
        const tens = Math.round(alt / 10);
        if (tens === lastTens) return;
        lastTens = tens;
        [Math.floor(tens / 100) % 10, Math.floor(tens / 10) % 10, tens % 10].forEach((d, i) => {
          if (d === shown[i]) return;
          strips[i].style.transform = `translate3d(0,${-d * 10}%,0)`;
          shown[i] = d;
        });
      };
      let lastKm = -1;

      const render = (p: number) => {
        const km = p * KM;
        const alt = altAt(km);

        // Counter-translated wipe: transform-only "draw" of the route.
        reveal.style.transform = `translate3d(${(p - 1) * 100}%,0,0)`;
        revealInner.style.transform = `translate3d(${(1 - p) * 100}%,0,0)`;
        walker.style.transform = `translate3d(${p * w}px,${(sy(alt) / VH) * h}px,0)`;

        const current = camps.reduce((idx, c, i) => (km >= c.km - 0.01 ? i : idx), 0);
        if (current !== lastCamp) {
          markers.forEach((m, i) => {
            m.classList.toggle("is-active", i <= current);
            m.classList.toggle("is-current", i === current);
          });
          dayEl.textContent = `Day ${camps[current].day}`;
          placeEl.textContent = camps[current].name;
          lastCamp = current;
        }

        setAltitude(alt);
        const wholeKm = Math.round(km);
        if (wholeKm !== lastKm) {
          kmEl.textContent = String(wholeKm);
          lastKm = wholeKm;
        }
      };

      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        const proxy = { p: 0 };
        render(0);
        gsap.to(proxy, {
          p: 1,
          ease: "none",
          onUpdate: () => render(proxy.p),
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => "+=" + innerHeight * 2.2,
            pin: true,
            scrub: 0.4,
            invalidateOnRefresh: true,
            onRefresh: () => {
              w = chart.clientWidth;
              h = chart.clientHeight;
              render(proxy.p);
            },
          },
        });
      });

      mm.add(MQ.reduce, () => {
        render(1);
        markers.forEach((m) => m.classList.remove("is-current"));
        markers[camps.indexOf(highest)].classList.add("is-current");
        setAltitude(highest.alt);
        kmEl.textContent = String(highest.km);
        dayEl.textContent = "Highest point";
        placeEl.textContent = highest.name;
        walker.style.display = "none";
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="alt" id="route" aria-labelledby="alt-title">
      <div className="alt__inner">
        <header className="alt__head">
          <p className="label">The route</p>
          <h2 id="alt-title" className="display">Rupin Pass, day by day.</h2>
          <p className="alt__intro">
            Fifty kilometres from Dhaula to Sangla. The climb is gradual for six days, then one long morning to the pass and
            a knee-testing descent into Kinnaur.
          </p>
        </header>

        <div className="alt__readout" aria-hidden="true">
          <p className="alt__value">
            <OdoColumn />
            <span>,</span>
            <OdoColumn />
            <OdoColumn />
            <span>0</span>
            <small>m</small>
          </p>
          <p className="alt__where">
            <span data-day>Day 1</span>
            <span className="alt__sep">·</span>
            <span data-place>Dhaula</span>
          </p>
          <p className="alt__km">
            <span data-km>0</span> of {KM} km
          </p>
        </div>

        <div className="alt__chart">
          <div className="alt__grid" aria-hidden="true">
            {GRID.map((g) => (
              <div key={g} className="alt__gridline" style={{ top: `${(sy(g) / VH) * 100}%` }}>
                <span>{formatAlt(g)}</span>
              </div>
            ))}
          </div>

          <svg className="alt__svg alt__svg--ghost" viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="none" aria-hidden="true">
            <path d={line} />
          </svg>

          <div className="alt__reveal" aria-hidden="true">
            <div className="alt__reveal-inner">
              <svg className="alt__svg alt__svg--route" viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="none">
                <path className="alt__area" d={area} />
                <path className="alt__line" d={line} />
              </svg>
            </div>
          </div>

          <span className="alt__walker" aria-hidden="true" />

          <ol className="alt__camps">
            {camps.map((c, i) => (
              <li
                key={c.name}
                className={`alt__camp ${i % 2 ? "alt__camp--stagger" : ""}`}
                style={{ left: `${(c.km / KM) * 100}%`, top: `${(sy(c.alt) / VH) * 100}%` }}
              >
                <span className="alt__dot" aria-hidden="true" />
                <span className="alt__name">
                  {c.name}
                  <span className="alt__alt"> {formatAlt(c.alt)}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
