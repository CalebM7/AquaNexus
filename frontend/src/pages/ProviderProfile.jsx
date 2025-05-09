// src/pages/ProviderProfile.jsx
import { useParams } from 'react-router-dom';

export default function ProviderProfile() {
  const { id } = useParams(); // Get the provider ID from the URL

  // Static data for now, matching the hardcoded providers in Providers.jsx
  const providerData = {
    1: {
      name: 'Hydro Solutions Kenya',
      rating: 4.5,
      reviews: 25,
      certifications: ['WRA Certified', 'Eco-Friendly'],
      description: 'Specializes in large-scale rainwater harvesting systems.',
      priceRange: 'KES 50k - 500k',
      serviceType: 'Rainwater Harvesting',
      image: 'https://placehold.co/600x400/00ACC1/white?text=Provider+A',
    },
    2: {
      name: 'DeepDrill Masters',
      rating: 4.0,
      reviews: 18,
      certifications: ['NEMA Approved', 'Borehole Expert'],
      description: 'Expert borehole drilling and pump installation services.',
      priceRange: 'KES 150k - 1M+',
      serviceType: 'Borehole Drilling',
      image: 'https://placehold.co/600x400/1A73E8/white?text=Provider+B',
    },
    3: {
      name: 'AquaHarvest Systems',
      rating: 5.0,
      reviews: 30,
      certifications: ['WRA Certified', 'Rainwater Pro'],
      description: 'Affordable rainwater solutions for homes and farms.',
      priceRange: 'KES 30k - 200k',
      serviceType: 'Rainwater Harvesting',
      image: 'https://placehold.co/600x400/4CAF50/white?text=Provider+C',
    },
  };

  const provider = providerData[id] || { name: 'Provider Not Found' };

  if (!providerData[id]) {
    return <div className="text-center mt-8 text-red-500">Provider Not Found</div>;
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800">
          {provider.name}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Provider Image */}
          <div className="md:col-span-1">
            <img
              src={provider.image}
              alt={provider.name}
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
          </div>
          {/* Provider Details */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4 star-rating">
              {[...Array(5)].map((_, index) => {
                const rating = provider.rating || 0;
                if (index + 1 <= Math.floor(rating)) {
                  return <i key={index} className="fas fa-star text-yellow-400"></i>;
                } else if (index < rating && rating % 1 >= 0.5) {
                  return <i key={index} className="fas fa-star-half-alt text-yellow-400"></i>;
                } else {
                  return <i key={index} className="far fa-star text-gray-300"></i>;
                }
              })}
              <span className="text-gray-600 text-sm ml-2">
                ({provider.rating} stars | {provider.reviews} Reviews)
              </span>
            </div>
            <div className="mb-4 space-x-2">
              {provider.certifications.map((cert) => (
                <span
                  key={cert}
                  className={`badge ${
                    cert.includes('Eco-Friendly') || cert.includes('Rainwater Pro')
                      ? 'bg-aqua-green text-white'
                      : 'bg-aqua-blue text-white'
                  }`}
                >
                  {cert}
                </span>
              ))}
            </div>
            <p className="text-gray-600 mb-4">{provider.description}</p>
            <p className="text-lg font-semibold text-aqua-teal mb-4">
              Price Range: {provider.priceRange}
            </p>
            <p className="text-gray-600 mb-4">Service Type: {provider.serviceType}</p>
            <button className="bg-aqua-teal text-white px-6 py-2 rounded-md font-semibold hover:bg-opacity-90 transition duration-300">
              Contact Provider
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}