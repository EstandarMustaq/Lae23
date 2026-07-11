'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import { useState } from 'react';

export default function AjudarPage() {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    tipoAjuda: 'recursos',
    descricao: '',
    localizacao: '',
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Oferta de ajuda:', formData);
    // TODO: Integrar com API
    alert('Obrigado pela oferta! Em breve entraremos em contato.');
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-4xl font-bold text-primary mb-2">
              Oferecer ajuda
            </h1>
            <p className="text-gray-600 mb-8">
              Você pode ajudar doando recursos ou oferecendo voluntariado
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seu nome
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  placeholder="Digite seu nome"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  placeholder="Seu número de telefone"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de ajuda
                </label>
                <select
                  name="tipoAjuda"
                  value={formData.tipoAjuda}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="recursos">Recursos (alimentos, água, medicamentos)</option>
                  <option value="voluntariado">Voluntariado (resgate, transporte)</option>
                  <option value="abrigo">Abrigo temporário</option>
                  <option value="finaceiro">Ajuda financeira</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localização
                </label>
                <input
                  type="text"
                  name="localizacao"
                  value={formData.localizacao}
                  onChange={handleChange}
                  placeholder="Sua localização"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição da ajuda
                </label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  required
                  placeholder="Descreva o que você pode oferecer..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-4 bg-accent hover:bg-teal-700 text-white font-bold text-lg rounded-lg transition shadow-lg hover:shadow-xl"
              >
                ❤️ Confirmar ajuda
              </button>

              <p className="text-center text-sm text-gray-500">
                Seus dados serão usados apenas para coordenar a ajuda com segurança
              </p>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
