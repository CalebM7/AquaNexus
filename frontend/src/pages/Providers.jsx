// src/pages/Providers.jsx
import { useEffect, useState } from 'react';

export default function Providers() {
  const [providers, setProviders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/providers', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch providers');
        const data = await response.json();
        setProviders(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchProviders();
  }, []);

  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800">
          All Service Providers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {providers.map((provider) => (
            <div
              key={provider.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition duration-300"
            >
              <img
                src={provider.image || 'https://placehold.co/600x400'}
                alt={provider.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{provider.name}</h3>
                <p className="text-gray-600 mb-3 text-sm">{provider.description}</p>
                <a
                  href={`/provider/${provider.id}`}
                  className="mt-4 inline-block text-aqua-blue font-semibold hover:underline"
                >
                  View Profile <i className="fas fa-arrow-right ml-1 text-xs"></i>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}