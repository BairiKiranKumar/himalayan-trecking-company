import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRightIcon, CaretDownIcon } from "@phosphor-icons/react";
import { Flip, gsap, MQ } from "../lib/gsap";
import { durations, formatAlt, formatPrice, treks, type Difficulty, type Season, type Trek } from "../data";
import { Magnetic } from "./Magnetic";

type DurationId = (typeof durations)[number]["id"];
type SortId = "recommended" | "shortest" | "highest";

interface Filters {
  difficulty: Difficulty | "";
  duration: DurationId | "";
  season: Season | "";
}

const NONE: Filters = { difficulty: "", duration: "", season: "" };

const sorts: { id: SortId; label: string; fn: (a: Trek, b: Trek) => number }[] = [
  { id: "recommended", label: "Recommended", fn: () => 0 },
  { id: "shortest", label: "Shortest first", fn: (a, b) => a.days - b.days || a.maxAlt - b.maxAlt },
  { id: "highest", label: "Highest first", fn: (a, b) => b.maxAlt - a.maxAlt },
];

const matches = (t: Trek, f: Filters) =>
  (!f.difficulty || t.difficulty === f.difficulty) &&
  (!f.duration || durations.find((d) => d.id === f.duration)!.test(t.days)) &&
  (!f.season || t.seasons.includes(f.season));

const reduced = () => matchMedia(MQ.reduce).matches;
const pick = (id: string) => window.dispatchEvent(new CustomEvent("enquire", { detail: id }));

export function TrekFinder() {
  const grid = useRef<HTMLUListElement>(null);
  const lead = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const activeFlip = useRef<gsap.core.Timeline | null>(null);
  const [filters, setFilters] = useState<Filters>(NONE);
  const [sort, setSort] = useState<SortId>("recommended");

  const visible = useMemo(() => {
    const fn = sorts.find((s) => s.id === sort)!.fn;
    return treks.filter((t) => matches(t, filters)).sort(fn);
  }, [filters, sort]);
  const leadTrek = visible[0];
  const rest = new Set(visible.slice(1).map((t) => t.id));
  // Every trek stays mounted (matches first, in sort order) so Flip can move, add and remove cards.
  const ordered = [...visible.slice(1), ...treks.filter((t) => !rest.has(t.id))];
  const filtered = Boolean(filters.difficulty || filters.duration || filters.season);

  const capture = () => {
    flipState.current = Flip.getState(grid.current!.children);
    activeFlip.current?.progress(1).kill();
  };

  const update = (next: Partial<Filters>) => {
    capture();
    setFilters((f) => ({ ...f, ...next }));
  };

  const reset = () => {
    capture();
    setFilters(NONE);
  };

  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state) return;
    flipState.current = null;
    if (reduced()) return;

    activeFlip.current = Flip.from(state, {
      duration: 0.7,
      ease: "power3.inOut",
      absolute: true,
      stagger: 0.03,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.5, delay: 0.25, ease: "power2.out" }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.94, duration: 0.3, ease: "power2.in" }),
    });
  }, [filters, sort]);

  // The lead trek swaps with a short crossfade instead of a Flip, so nothing resizes mid-animation.
  const leadId = leadTrek?.id;
  const firstLead = useRef(true);
  useLayoutEffect(() => {
    if (firstLead.current) {
      firstLead.current = false;
      return;
    }
    if (!lead.current || reduced()) return;
    gsap.fromTo(
      lead.current.querySelectorAll(".lead__media img, .lead__body > *"),
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.04, ease: "power3.out", overwrite: true },
    );
  }, [leadId]);

  return (
    <section className="finder" id="treks" aria-labelledby="finder-title">
      <h2 id="finder-title" className="sr-only">Find a trek</h2>

      <p className="finder__sentence">
        Show me{" "}
        <Pick
          label="Difficulty"
          value={filters.difficulty}
          onChange={(v) => update({ difficulty: v as Filters["difficulty"] })}
          options={[["", "any"], ["Easy", "easy"], ["Moderate", "moderate"], ["Challenging", "challenging"]]}
        />{" "}
        treks of{" "}
        <Pick
          label="Length"
          value={filters.duration}
          onChange={(v) => update({ duration: v as Filters["duration"] })}
          options={[["", "any length"], ["short", "up to 6 days"], ["mid", "7 to 9 days"], ["long", "10 days or more"]]}
        />{" "}
        in{" "}
        <Pick
          label="Season"
          value={filters.season}
          onChange={(v) => update({ season: v as Filters["season"] })}
          options={[["", "any season"], ["Spring", "spring"], ["Summer", "summer"], ["Monsoon", "the monsoon"], ["Autumn", "autumn"], ["Winter", "winter"]]}
        />
        .
      </p>

      <div className="finder__meta">
        <p aria-live="polite">
          {visible.length} of {treks.length} treks
        </p>
        {filtered && (
          <button type="button" className="link" onClick={reset}>
            Reset
          </button>
        )}
        <label className="finder__sort">
          <span>Sort</span>
          <select
            value={sort}
            onChange={(e) => {
              capture();
              setSort(e.target.value as SortId);
            }}
          >
            {sorts.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </label>
      </div>

      {leadTrek ? (
        <div ref={lead} className="lead">
          <div className="lead__media">
            <img src={leadTrek.image} alt="" width={1000} height={750} decoding="async" />
          </div>
          <div className="lead__body">
            <p className="lead__region">{leadTrek.region}</p>
            <h3>{leadTrek.name}</h3>
            <p className="lead__blurb">{leadTrek.blurb}</p>
            <dl className="lead__facts">
              <div><dt>Days</dt><dd>{leadTrek.days}</dd></div>
              <div><dt>Highest point</dt><dd>{formatAlt(leadTrek.maxAlt)}</dd></div>
              <div><dt>Grade</dt><dd>{leadTrek.difficulty}</dd></div>
            </dl>
            <div className="lead__foot">
              <p className="lead__price">
                From {formatPrice(leadTrek.price)}
                <span>{leadTrek.seasons.join(", ")}</span>
              </p>
              <Magnetic>
                <a className="btn btn--primary" href="#book" onClick={() => pick(leadTrek.id)}>
                  Enquire
                  <ArrowUpRightIcon size={18} weight="bold" aria-hidden="true" />
                </a>
              </Magnetic>
            </div>
          </div>
        </div>
      ) : (
        <div className="finder__empty">
          <p>Nothing fits all three. Loosen one choice, or write to us and we will suggest something close.</p>
          <button type="button" className="link" onClick={reset}>
            Show every trek
          </button>
        </div>
      )}

      <ul ref={grid} className="finder__grid">
        {ordered.map((trek) => (
          <li key={trek.id} className="trek" hidden={!rest.has(trek.id)} data-flip-id={trek.id}>
            <TrekCard trek={trek} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function Pick({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: [string, string][];
  onChange: (value: string) => void;
}) {
  return (
    <span className={`pick${value ? " is-set" : ""}`}>
      <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(([v, text]) => (
          <option key={v} value={v}>{text}</option>
        ))}
      </select>
      <CaretDownIcon className="pick__caret" weight="bold" aria-hidden="true" />
    </span>
  );
}

function TrekCard({ trek }: { trek: Trek }) {
  return (
    <article className="trek__card">
      <div className="trek__media">
        <img src={trek.image} alt="" width={1000} height={750} loading="lazy" decoding="async" />
      </div>
      <div className="trek__title">
        <h3>{trek.name}</h3>
        <p>{trek.region}</p>
      </div>
      <p className="trek__facts">
        {trek.days} days, {formatAlt(trek.maxAlt)}, {trek.difficulty.toLowerCase()}
      </p>
      <div className="trek__foot">
        <p className="trek__price">From {formatPrice(trek.price)}</p>
        <a className="trek__link" href="#book" onClick={() => pick(trek.id)}>
          Enquire
          <ArrowUpRightIcon size={16} weight="bold" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
