'use client';

import { useEffect, useState } from 'react';

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  type: 'urgent' | 'help' | 'safe';
  title: string;
  description: string;
}

interface MapProps {
  markers?: MapMarker[];
}

const defaultMarkers: MapMarker[] = [
  {
    id: '1',
    lat: -17.8252,
    lng: 25.9655,
    type: 'urgent',
    title: 'Pedido urgente',
    description: 'Necessita resgate imediato',
  },
  {
    id: '2',
    lat: -17.7633,
    lng: 25.6521,
    type: 'help',
    title: 'Ajuda a caminho',
    description: 'Voluntários em deslocamento',
  },
  {
    id: '3',
    lat: -17.9283,
    lng: 25.5235,
    type: 'safe',
    title: 'Ponto seguro',
    description: 'Abrigo disponível',
  },
  {
    id: '4',
    lat: -17.8742,
    lng: 25.7891,
    type: 'urgent',
    title: 'Pedido urgente',
    description: 'Necessita alimentos',
  },
];

export default function MapComponent({ markers = defaultMarkers }: MapProps) {
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Simular carregamento do mapa
    const timer = setTimeout(() => setMapLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="mapa" className="w-full bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-primary mb-2">Situação agora</h2>
        <p className="text-gray-600 mb-6">
          Visualize em tempo real os pedidos, ofertas de ajuda e pontos seguros na sua região
        </p>

        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-green-50">
          {/* Mapa Simulado */}
          <div className="h-96 w-full flex items-center justify-center relative">
            <div className="absolute inset-0 opacity-10">
              {/* Grid background */}
              <svg className="w-full h-full">
                <defs>
                  <pattern
                    id="grid"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="gray"
                      strokeWidth="0.5"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Marcadores */}
            {mapLoaded && (
              <div className="absolute inset-0">
                {markers.map((marker) => {
                  const icon =
                    marker.type === 'urgent'
                      ? '🚨'
                      : marker.type === 'help'
                        ? '🚐'
                        : '🏠';
                  const bgColor =
                    marker.type === 'urgent'
                      ? 'bg-red-500'
                      : marker.type === 'help'
                        ? 'bg-orange-500'
                        : 'bg-accent';

                  return (
                    <div
                      key={marker.id}
                      className={`absolute ${bgColor} rounded-full w-10 h-10 flex items-center justify-center text-lg shadow-lg hover:scale-110 transition cursor-pointer`}
                      style={{
                        top: `${30 + (marker.lat + 17.8) * 3}%`,
                        left: `${40 + (marker.lng - 25.5) * 2}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      title={marker.title}
                    >
                      {icon}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Placeholder Text */}
            <div className="relative z-10 text-center pointer-events-none">
              <p className="text-gray-500 font-medium">Mapa interativo</p>
              <p className="text-sm text-gray-400">Em tempo real</p>
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-6 left-6 bg-white rounded-lg shadow-lg p-4 border border-gray-200 z-20">
            <h3 className="font-bold text-sm text-gray-800 mb-3">Legenda</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span>Pedido urgente</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                <span>Ajuda a caminho</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-4 h-4 rounded-full bg-accent"></div>
                <span>Ponto seguro</span>
              </div>
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="absolute right-6 bottom-6 flex flex-col gap-2 z-20">
            <button className="w-10 h-10 bg-white rounded shadow hover:bg-gray-100 font-bold text-lg flex items-center justify-center">
              +
            </button>
            <button className="w-10 h-10 bg-white rounded shadow hover:bg-gray-100 font-bold text-lg flex items-center justify-center">
              −
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
