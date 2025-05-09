// src/pages/Landing.jsx
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import TrustBadges from '../components/TrustBadges';
import Providers from '../components/Providers';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

export default function Landing() {
  return (
    <div>
      <Hero />
      <HowItWorks />
      <TrustBadges />
      <Providers />
      <Testimonials />
      <Footer />
    </div>
  );
}