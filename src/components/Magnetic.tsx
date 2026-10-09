import { useRef, type ReactNode } from "react";
import { gsap, MQ, useGSAP } from "../lib/gsap";

/**
 * Pulls its child toward the cursor. Listens on the wrapper, which never
 * moves, so the hit area and its rect stay stable while the child travels.
 */
export function Magnetic({ children, strength = 0.3, max = 12 }: { children: ReactNode; strength?: number; max?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(`${MQ.fine} and ${MQ.motion}`, () => {
      const wrap = ref.current!;
      const target = wrap.firstElementChild as HTMLElement;
      const xTo = gsap.quickTo(target, "x", { duration: 0.6, ease: "power3" });
      const yTo = gsap.quickTo(target, "y", { duration: 0.6, ease: "power3" });
      const clamp = gsap.utils.clamp(-max, max);

      const move = (e: PointerEvent) => {
        const r = wrap.getBoundingClientRect();
        xTo(clamp((e.clientX - (r.left + r.width / 2)) * strength));
        yTo(clamp((e.clientY - (r.top + r.height / 2)) * strength));
      };
      const leave = () => {
        xTo(0);
        yTo(0);
      };
      wrap.addEventListener("pointermove", move);
      wrap.addEventListener("pointerleave", leave);
      return () => {
        wrap.removeEventListener("pointermove", move);
        wrap.removeEventListener("pointerleave", leave);
      };
    });
  });

  return (
    <span ref={ref} className="magnetic">
      {children}
    </span>
  );
}
