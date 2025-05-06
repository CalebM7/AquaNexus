import Navbar from './components/Navbar'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import Providers from './components/Providers'
import Testimonials from './components/Testimonials'
export default function App() {
  return (
    <div>
      <Navbar />
      <Hero />
<HowItWorks/>
<Providers/>
<Testimonials/>
      <h1 className="text-3xl font-bold text-blue-600 mt-8 text-center">
        AquaNexus Frontend Works!
      </h1>
    </div>
  )
}