export default function Navbar() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <a href="#" className="text-2xl font-bold text-blue-600">
          AquaNexus
        </a>
        <div className="space-x-4">
          <a
            href="#providers"
            className="text-gray-600 hover:text-blue-600 px-3 py-2"
          >
            Providers
          </a>
          <a
            href="#how-it-works"
            className="text-gray-600 hover:text-blue-600 px-3 py-2"
          >
            How It Works
          </a>
          <a
            href="#testimonials"
            className="text-gray-600 hover:text-blue-600 px-3 py-2"
          >
            Testimonials
          </a>
          <a
            href="#"
            className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600"
          >
            Login
          </a>
        </div>
      </nav>
    </header>
  )
}