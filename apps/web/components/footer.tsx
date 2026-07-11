'use client';

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                <span className="text-white font-bold">🤝</span>
              </div>
              <h3 className="font-bold text-lg">Mãos Unidas</h3>
            </div>
            <p className="text-sm text-gray-300">
              Coordenando resgate e ajuda em emergências
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Ações Rápidas</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="/reportar" className="hover:text-white transition">
                  Reportar emergência
                </a>
              </li>
              <li>
                <a href="/ajudar" className="hover:text-white transition">
                  Oferecer ajuda
                </a>
              </li>
              <li>
                <a href="/procurar-familiar" className="hover:text-white transition">
                  Procurar familiar
                </a>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-bold mb-4">Informações</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="/sobre" className="hover:text-white transition">
                  Sobre nós
                </a>
              </li>
              <li>
                <a href="/como-funciona" className="hover:text-white transition">
                  Como funciona
                </a>
              </li>
              <li>
                <a href="/contato" className="hover:text-white transition">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="/privacidade" className="hover:text-white transition">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="/termos" className="hover:text-white transition">
                  Termos de Serviço
                </a>
              </li>
              <li>
                <a href="/acessibilidade" className="hover:text-white transition">
                  Acessibilidade
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-300">
          <p>&copy; 2026 Mãos Unidas. Todos os direitos reservados.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <a href="#" className="hover:text-white transition">
              Facebook
            </a>
            <a href="#" className="hover:text-white transition">
              Twitter
            </a>
            <a href="#" className="hover:text-white transition">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
