import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { Intro } from "./components/Intro";
import { Hero } from "./sections/Hero";
import { About } from "./sections/About";
import { Services } from "./sections/Services";
import { Methodology } from "./sections/Methodology";
import { Portfolio } from "./sections/Portfolio";
import { Differentials } from "./sections/Differentials";
import { FAQ } from "./sections/FAQ";
import { Contact } from "./sections/Contact";
import { Footer } from "./sections/Footer";
import { useScrollReveal } from "./hooks/useScrollReveal";

const INTRO_KEY = "nodera_intro_seen";

export default function App() {
  const [showIntro, setShowIntro] = useState(false);
  useScrollReveal();

  useEffect(() => {
    try {
      const seen = sessionStorage.getItem(INTRO_KEY);
      if (!seen) {
        setShowIntro(true);
      }
    } catch {
      // Si sessionStorage no está disponible, no mostramos el intro
    }
  }, []);

  function handleIntroDone() {
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      // ignore
    }
    setShowIntro(false);
  }

  return (
    <>
      {showIntro && <Intro onDone={handleIntroDone} />}
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Methodology />
        <Portfolio />
        <Differentials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
