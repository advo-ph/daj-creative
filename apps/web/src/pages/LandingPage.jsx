import Hero from '../components/Hero';
import Pillars from '../components/Pillars';
import Editorial from '../components/Editorial';
import WorkStrip from '../components/WorkStrip';
import ShopTeaser from '../components/ShopTeaser';
import AboutStrip from '../components/AboutStrip';

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Pillars />
      <Editorial />
      <WorkStrip />
      <ShopTeaser />
      <AboutStrip />
    </>
  );
}
