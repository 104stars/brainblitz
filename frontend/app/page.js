import Hero from '../components/common/Hero'
import Features from '../components/common/Features'
import CallToAction from '../components/common/CallToAction'
import Footer from '../components/common/Footer'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <CallToAction />
      <Footer />
    </div>
  );
}
