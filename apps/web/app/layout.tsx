import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mãos Unidas - Ajuda Certa, No Lugar Certo',
  description: 'Plataforma de coordenação de resgate e ajuda em emergências. Reporte pessoas isoladas, encontre ajuda próxima e mantenha famílias conectadas.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
      </head>
      <body className="bg-background text-text antialiased">
        {children}
      </body>
    </html>
  );
}
