'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import { useState } from 'react';

export default function ReportarPage() {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    descricao: '',
    localizacao: '',
    urgencia: 'media',
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
    console.log('Formulário enviado:', formData);
    // TODO: Integrar com API
    alert('Pedido de ajuda reportado com sucesso!');
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-4xl font-bold text-primary mb-2">
              Reportar pessoa isolada
            </h1>
            <p className="text-gray-600 mb-8">
              Preencha as informações abaixo para reportar alguém que necessita de ajuda
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da pessoa
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  placeholder="Digite o nome completo"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contato/Telefone
                </label>
                <input
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  placeholder="Digite o telefone"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
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
                  required
                  placeholder="Localização ou endereço aproximado"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nível de urgência
                </label>
                <select
                  name="urgencia"
                  value={formData.urgencia}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="baixa">Baixa - Ajuda em breve</option>
                  <option value="media">Média - Ajuda necessária</option>
                  <option value="alta">Alta - Emergência</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  required
                  placeholder="Descreva a situação, necessidades de ajuda, recursos, etc."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-4 bg-secondary hover:bg-orange-600 text-white font-bold text-lg rounded-lg transition shadow-lg hover:shadow-xl"
              >
                🚨 Reportar emergência
              </button>

              <p className="text-center text-sm text-gray-500">
                Seus dados serão mantidos em sigilo e usados apenas para coordenar ajuda
              </p>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
