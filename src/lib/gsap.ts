import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, Flip, SplitText, useGSAP);

export { gsap, ScrollTrigger, Flip, SplitText, useGSAP };

export const MQ = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  /** Mouse-driven effects: real pointer, wide viewport. */
  fine: "(min-width: 1024px) and (hover: hover) and (pointer: fine)",
  /** Below this the featured gallery stacks instead of pinning sideways. */
  horizontal: "(min-width: 900px)",
} as const;
