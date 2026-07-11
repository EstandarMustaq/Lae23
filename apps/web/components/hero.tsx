'use client';

export default function Hero() {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="flex flex-col gap-6">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary leading-tight">
              Ajuda certa, <br /> no lugar certo.
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Reporte pessoas isoladas, encontre ajuda próxima e mantenha famílias conectadas.
            </p>

            <button className="w-full sm:w-auto px-8 py-4 bg-secondary hover:bg-orange-600 text-white font-bold text-lg rounded-lg transition shadow-lg hover:shadow-xl">
              🚨 Reportar emergência
            </button>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Funciona com ligação limitada
            </div>
          </div>

          {/* Right Side - Map Preview */}
          <div className="relative h-96 lg:h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-200">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🗺️</div>
                <p className="text-gray-600 font-medium">Mapa interativo</p>
                <p className="text-sm text-gray-500">em tempo real</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
