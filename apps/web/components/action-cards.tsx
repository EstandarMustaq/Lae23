'use client';

const actions = [
  {
    id: 1,
    icon: '👤',
    title: 'Reportar pessoa isolada',
    description: 'Reporte alguém que está em risco ou desaparecido',
    borderColor: 'border-red-200',
    hoverColor: 'hover:border-red-400',
    bgColor: 'hover:bg-red-50',
    href: '/reportar',
  },
  {
    id: 2,
    icon: '❤️',
    title: 'Quero ajudar',
    description: 'Disponibilize recursos ou ofereça voluntariado',
    borderColor: 'border-accent/30',
    hoverColor: 'hover:border-accent',
    bgColor: 'hover:bg-accent/5',
    href: '/ajudar',
  },
  {
    id: 3,
    icon: '👥',
    title: 'Procurar familiar',
    description: 'Busque informações de familiares desaparecidos',
    borderColor: 'border-blue-200',
    hoverColor: 'hover:border-primary',
    bgColor: 'hover:bg-primary/5',
    href: '/procurar-familiar',
  },
];

export default function ActionCards() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {actions.map((action) => (
          <a
            key={action.id}
            href={action.href}
            className={`group p-8 border-2 ${action.borderColor} rounded-2xl transition-all cursor-pointer ${action.hoverColor} ${action.bgColor}`}
          >
            <div className="flex flex-col gap-4">
              <div className="text-5xl">{action.icon}</div>
              <h3 className="text-2xl font-bold text-primary">{action.title}</h3>
              <p className="text-gray-600">{action.description}</p>
              <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                <span>Começar</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
