'use client';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">🤝</span>
            </div>
            <div>
              <h1 className="font-bold text-xl text-primary">Mãos Unidas</h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex gap-8">
            <a
              href="#mapa"
              className="text-gray-700 hover:text-primary font-medium transition"
            >
              📍 Mapa
            </a>
            <a
              href="#reportar"
              className="text-gray-700 hover:text-primary font-medium transition"
            >
              ✏️ Reportar
            </a>
            <a
              href="#voluntarios"
              className="text-gray-700 hover:text-primary font-medium transition"
            >
              👥 Voluntários
            </a>
            <a
              href="#familia"
              className="text-gray-700 hover:text-primary font-medium transition"
            >
              👨‍👩‍👧‍👦 Reunir família
            </a>
          </nav>

          {/* CTA Button */}
          <button className="hidden md:block px-6 py-2.5 bg-secondary hover:bg-orange-600 text-white font-semibold rounded-lg transition shadow-md hover:shadow-lg">
            🚨 Reportar emergência
          </button>

          {/* Mobile Menu */}
          <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
