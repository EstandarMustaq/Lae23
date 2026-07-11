# Mãos Unidas - Web Application

Frontend da plataforma **Mãos Unidas** para coordenação de resgate e ajuda em emergências.

## 🎯 Visão Geral

A aplicação web **Mãos Unidas** fornece uma interface para:
- **Reportar pessoas isoladas** - Denuncie pessoas em risco ou desaparecidas
- **Oferecer ajuda** - Disponibilize recursos e voluntariado
- **Procurar familiares** - Busque e registre familiares desaparecidos
- **Visualizar situação em tempo real** - Mapa interativo com pedidos e pontos seguros

## 🛠️ Stack Técnico

- **Next.js 16** - Framework React com SSR
- **React 19** - Biblioteca UI
- **Tailwind CSS 3** - Estilização
- **TypeScript** - Tipagem estática
- **Responsive Design** - Mobile-first

## 📁 Estrutura

```
apps/web/
├── app/
│   ├── page.tsx              # Homepage
│   ├── reportar/             # Página de reportar emergência
│   ├── ajudar/               # Página de oferecer ajuda
│   ├── procurar-familiar/    # Página de procurar familiar
│   ├── layout.tsx            # Layout raiz
│   └── globals.css           # Estilos globais
├── components/
│   ├── header.tsx            # Navegação principal
│   ├── hero.tsx              # Seção hero
│   ├── map.tsx               # Visualização do mapa
│   ├── action-cards.tsx      # Cards de ações principais
│   └── footer.tsx            # Rodapé com links
├── next.config.js            # Configuração Next.js
├── tailwind.config.js        # Configuração Tailwind
└── tsconfig.json             # Configuração TypeScript
```

## 🎨 Design

A aplicação segue um design moderno e responsivo com:
- **Cores**: Azul escuro (#003366) como primária, laranja (#FF6B35) como destaque
- **Tipografia**: Sistema simples e limpo
- **Componentes**: Cards, formulários, mapa interativo
- **Acessibilidade**: Semântica HTML, roles ARIA, contraste adequado

## 🚀 Desenvolvimento

### Instalação

```bash
pnpm install
```

### Dev Server

```bash
pnpm dev
```

O servidor inicia em `http://localhost:3000`

### Build

```bash
pnpm build
pnpm start
```

### Type Checking

```bash
pnpm typecheck
```

## 📝 Páginas

### Homepage (`/`)
- Hero section com call-to-action
- Mapa interativo com situação em tempo real
- 3 cards de ação principais
- Footer com links

### Reportar Emergência (`/reportar`)
- Formulário para reportar pessoa isolada
- Campos: nome, telefone, localização, urgência, descrição
- Submit envia dados para API

### Oferecer Ajuda (`/ajudar`)
- Formulário para oferecer recursos ou voluntariado
- Tipos de ajuda: recursos, voluntariado, abrigo, financeiro
- Confirmação de oferta

### Procurar Familiar (`/procurar-familiar`)
- Aba de procura com lista de resultados simulada
- Aba de registro de desaparecido
- Contato com informações de familiares

## 🔄 Integração com API

Os formulários estão preparados para integração com a API do backend:

```typescript
// Exemplo de integração
const response = await fetch('/api/help-requests', {
  method: 'POST',
  body: JSON.stringify(formData)
});
```

### Endpoints Esperados:
- `POST /api/help-requests` - Reportar emergência
- `POST /api/resource-offers` - Oferecer ajuda
- `GET /api/missing-persons` - Procurar familiares
- `POST /api/missing-persons` - Registrar desaparecido

## 📱 Responsividade

Layout otimizado para:
- Mobile (375px+)
- Tablet (768px+)
- Desktop (1024px+)

## ♿ Acessibilidade

- Semântica HTML apropriada
- Contraste de cores WCAG AA
- Navegação por teclado
- Labels em formulários
- Roles ARIA quando necessário

## 🔧 Configuração Ambiental

Crie um arquivo `.env.local` com:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 📚 Referências

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [React Documentation](https://react.dev)

## 📄 Licença

Apache 2.0
