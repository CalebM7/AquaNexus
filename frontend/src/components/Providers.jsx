// src/components/Providers.jsx
export default function Providers() {
  return (
    <section id="providers" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800">
          Featured Service Providers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition duration-300">
            <img
              src="https://placehold.co/600x400/00ACC1/white?text=Provider+A"
              alt="Provider A"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Hydro Solutions Kenya</h3>
              <div className="flex items-center mb-3 star-rating">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star-half-alt"></i>
                <span className="text-gray-600 text-sm ml-2">(4.5 stars | 25 Reviews)</span>
              </div>
              <div className="mb-3 space-x-2">
                <span className="badge bg-aqua-blue text-white">WRA Certified</span>
                <span className="badge bg-aqua-green text-white">Eco-Friendly</span>
              </div>
              <p className="text-gray-600 mb-3 text-sm">
                Specializes in large-scale rainwater harvesting systems.
              </p>
              <p className="text-lg font-semibold text-aqua-teal">Price Range: KES 50k - 500k</p>
              <a
                href="#"
                className="mt-4 inline-block text-aqua-blue font-semibold hover:underline"
              >
                View Profile <i className="fas fa-arrow-right ml-1 text-xs"></i>
              </a>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition duration-300">
            <img
              src="https://placehold.co/600x400/1A73E8/white?text=Provider+B"
              alt="Provider B"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">DeepDrill Masters</h3>
              <div className="flex items-center mb-3 star-rating">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="far fa-star"></i>
                <span className="text-gray-600 text-sm ml-2">(4.0 stars | 18 Reviews)</span>
              </div>
              <div className="mb-3 space-x-2">
                <span className="badge bg-aqua-blue text-white">NEMA Approved</span>
                <span className="badge bg-gray-500 text-white">Borehole Expert</span>
              </div>
              <p className="text-gray-600 mb-3 text-sm">
                Expert borehole drilling and pump installation services.
              </p>
              <p className="text-lg font-semibold text-aqua-teal">Price Range: KES 150k - 1M+</p>
              <a
                href="#"
                className="mt-4 inline-block text-aqua-blue font-semibold hover:underline"
              >
                View Profile <i className="fas fa-arrow-right ml-1 text-xs"></i>
              </a>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition duration-300">
            <img
              src="https://placehold.co/600x400/4CAF50/white?text=Provider+C"
              alt="Provider C"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">AquaHarvest Systems</h3>
              <div className="flex items-center mb-3 star-rating">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <span className="text-gray-600 text-sm ml-2">(5.0 stars | 30 Reviews)</span>
              </div>
              <div className="mb-3 space-x-2">
                <span className="badge bg-aqua-blue text-white">WRA Certified</span>
                <span className="badge bg-aqua-green text-white">Rainwater Pro</span>
              </div>
              <p className="text-gray-600 mb-3 text-sm">
                Affordable rainwater solutions for homes and farms.
              </p>
              <p className="text-lg font-semibold text-aqua-teal">Price Range: KES 30k - 200k</p>
              <a
                href="#"
                className="mt-4 inline-block text-aqua-blue font-semibold hover:underline"
              >
                View Profile <i className="fas fa-arrow-right ml-1 text-xs"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="text-center mt-12">
          <a
            href="#"
            className="bg-aqua-teal text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-opacity-90 transition duration-300 shadow-md"
          >
            See All Providers
          </a>
        </div>
      </div>
    </section>
  );
}