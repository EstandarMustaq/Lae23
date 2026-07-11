'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import { useState } from 'react';

export default function ProcurarFamiliarPage() {
  const [tabAtiva, setTabAtiva] = useState<'procurar' | 'registrar'>('procurar');
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    contato: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Formulário enviado:', formData);
    alert('Informações registradas com sucesso!');
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-primary mb-8">Reunir família</h1>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-gray-200">
            <button
              onClick={() => setTabAtiva('procurar')}
              className={`pb-4 px-4 font-semibold transition ${
                tabAtiva === 'procurar'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              🔍 Procurar familiar
            </button>
            <button
              onClick={() => setTabAtiva('registrar')}
              className={`pb-4 px-4 font-semibold transition ${
                tabAtiva === 'registrar'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              📝 Registrar desaparecido
            </button>
          </div>

          {/* Procurar Tab */}
          {tabAtiva === 'procurar' && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-primary mb-6">
                Procurar por familiar
              </h2>

              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Digite o nome do familiar..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Resultados simulados */}
                <div className="mt-8 space-y-4">
                  <h3 className="font-semibold text-gray-700">Resultados:</h3>

                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-primary">
                            Maria dos Santos
                          </h4>
                          <p className="text-sm text-gray-600">
                            Localização: Beira, Moçambique
                          </p>
                          <p className="text-sm text-gray-600">
                            Status: Em um ponto seguro
                          </p>
                        </div>
                        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition">
                          Entrar em contato
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Registrar Tab */}
          {tabAtiva === 'registrar' && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-primary mb-6">
                Registrar familiar desaparecido
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do familiar
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    placeholder="Nome completo"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
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
                    placeholder="Descreva características físicas, roupas usadas, quando desapareceu..."
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seu contato
                  </label>
                  <input
                    type="tel"
                    name="contato"
                    value={formData.contato}
                    onChange={handleChange}
                    required
                    placeholder="Seu telefone para contato"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-4 bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-lg transition shadow-lg hover:shadow-xl"
                >
                  📝 Registrar familiar
                </button>

                <p className="text-center text-sm text-gray-500">
                  Aumentaremos o alcance da busca através de nossa rede
                </p>
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
