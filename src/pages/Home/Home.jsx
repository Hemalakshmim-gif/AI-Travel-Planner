import Hero from "../../components/Hero/Hero";
import Stats from "../../components/Stats/Stats";
import About from "../../components/About/About";
import HowItWorks from "../../components/HowItWorks/HowItWorks";
import CTA from "../../components/CTA/CTA";

function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <About />
      <HowItWorks />
      <CTA />
    </>
  );
}

export default Home;