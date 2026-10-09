import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, MQ } from "./lib/gsap";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Manifesto } from "./components/Manifesto";
import { TrekFinder } from "./components/TrekFinder";
import { AltitudeProfile } from "./components/AltitudeProfile";
import { FeaturedTrek } from "./components/FeaturedTrek";
import { Leaders } from "./components/Leaders";
import { Book } from "./components/Book";
import { Footer } from "./components/Footer";

export default function App() {
  useEffect(() => {
    document.fonts.ready.then(() => ScrollTrigger.refresh());

    // Touch devices and reduced motion keep native scrolling.
    if (matchMedia("(pointer: coarse)").matches || matchMedia(MQ.reduce).matches) return;

    const lenis = new Lenis({ lerp: 0.1, anchors: true, autoRaf: false });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Nav />
      <main id="main">
        <Hero />
        <Manifesto />
        <TrekFinder />
        <AltitudeProfile />
        <FeaturedTrek />
        <Leaders />
        <Book />
      </main>
      <Footer />
    </>
  );
}
