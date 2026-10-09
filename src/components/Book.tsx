import { useEffect, useRef, useState, type FormEvent } from "react";
import { gsap, MQ, useGSAP } from "../lib/gsap";
import { treks } from "../data";
import { Magnetic } from "./Magnetic";

const months = ["March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function Book() {
  const root = useRef<HTMLElement>(null);
  const trekSelect = useRef<HTMLSelectElement>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  // "Enquire" on a trek card preselects that trek here.
  useEffect(() => {
    const pick = (e: Event) => {
      if (trekSelect.current) trekSelect.current.value = (e as CustomEvent<string>).detail;
    };
    window.addEventListener("enquire", pick);
    return () => window.removeEventListener("enquire", pick);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from(".book__inner", {
          opacity: 0,
          duration: 1.1,
          ease: "power2.out",
          scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
        });
      });
    },
    { scope: root },
  );

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = String(new FormData(e.currentTarget).get("name") ?? "");
    // TODO: post to the enquiry inbox or CRM once an endpoint exists.
    setSentTo(name.trim().split(" ")[0] || "there");
  };

  return (
    <section ref={root} className="book" id="book" aria-labelledby="book-title">
      <div className="book__inner">
        <div className="book__panel">
          <img src="/media/book.webp" alt="Sunrise on the Kanchenjunga range over a still lake on the Goechala trek" width={960} height={1280} loading="lazy" decoding="async" />
          <div className="book__panel-text">
            <h2 id="book-title">Tell us where you want to walk.</h2>
            <p>A trek leader, not a sales desk, replies within one working day with dates and honest advice.</p>
          </div>
        </div>

        <div className="book__side">

        {sentTo ? (
          <div className="book__done" role="status">
            <p className="book__thanks">Thank you, {sentTo}.</p>
            <p>Your enquiry is with the team. Expect a reply from one of our leaders within a working day.</p>
          </div>
        ) : (
          <form className="form" onSubmit={submit}>
            <div className="form__row">
              <label className="field">
                <span>Full name</span>
                <input name="name" autoComplete="name" required />
              </label>
              <label className="field">
                <span>Email</span>
                <input name="email" type="email" autoComplete="email" required />
              </label>
            </div>
            <div className="form__row form__row--3">
              <label className="field">
                <span>Trek</span>
                <select ref={trekSelect} name="trek" defaultValue="">
                  <option value="">Not sure yet</option>
                  {treks.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Month</span>
                <select name="month" defaultValue="">
                  <option value="">Flexible</option>
                  {months.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Group size</span>
                <input name="group" type="number" min={1} max={12} defaultValue={2} inputMode="numeric" />
              </label>
            </div>
            <label className="field">
              <span>Anything we should know</span>
              <textarea name="notes" rows={4} placeholder="Past treks, fitness, dietary needs, questions" />
            </label>
            <div className="form__foot">
              <p>We only use your details to reply to you.</p>
              <Magnetic>
                <button className="btn btn--primary" type="submit">Send enquiry</button>
              </Magnetic>
            </div>
          </form>
        )}
          <dl className="book__contact">
            <div><dt>Write</dt><dd><a href="mailto:hello@example.com">hello@example.com</a></dd></div>
            <div><dt>Call</dt><dd><a href="tel:+910000000000">+91 00000 00000</a></dd></div>
            <div><dt>Visit</dt><dd>Rajpur Road, Dehradun</dd></div>
          </dl>
        </div>
      </div>
    </section>
  );
}
