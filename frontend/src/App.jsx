import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Providers from './pages/Providers';
import ProviderProfile from './pages/ProviderProfile';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import FeaturedProviders from './components/FeaturedProviders';

export default function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/providers" element={<Providers />} />
        <Route path="/provider/:id" element={<ProviderProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}