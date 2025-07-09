# NLW Agents - React + TypeScript

Uma aplicação web moderna construída com React, TypeScript e Vite, utilizando as melhores práticas de desenvolvimento frontend.

## 🚀 Tecnologias

### Core
- **React 19.1.0** - Biblioteca para interfaces de usuário
- **TypeScript** - Superset tipado do JavaScript
- **Vite** - Build tool e dev server ultrarrápido

### UI/UX
- **TailwindCSS v4** - Framework CSS utility-first
- **Shadcn/UI** - Componentes reutilizáveis baseados em Radix UI
- **Lucide React** - Biblioteca de ícones
- **Class Variance Authority** - Gerenciamento de variantes de componentes

### Roteamento e Estado
- **React Router DOM** - Roteamento client-side
- **TanStack React Query** - Gerenciamento de estado e cache de dados assíncronos

### Desenvolvimento
- **Biome** - Linter e formatador de código
- **Ultracite** - Tooling adicional

## 📁 Estrutura do Projeto

```
src/
├── components/        # Componentes reutilizáveis
│   └── ui/           # Componentes base do design system
├── pages/            # Páginas da aplicação
├── lib/              # Utilitários e configurações
└── app.tsx           # Configuração principal da aplicação
```

## 🛠️ Configuração e Instalação

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone <url-do-repositorio>

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Gera build de produção
npm run preview      # Preview do build de produção

# Qualidade de código
npm run lint         # Executa linting
npm run format       # Formata código
npm run check        # Verifica código (lint + format)
```

## ⚙️ Configurações

### Alias de Importação
O projeto utiliza alias `@/` para imports relativos ao diretório `src/`:

```typescript
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
```

### Tailwind CSS
Configurado com:
- Tema baseado em zinc
- CSS variables habilitadas
- Componentes Shadcn/UI integrados

## 🎯 Padrões de Projeto

- **Componentização**: Componentes pequenos e reutilizáveis
- **TypeScript**: Tipagem forte em toda aplicação
- **Utility-First CSS**: Estilização com TailwindCSS
- **Design System**: Componentes consistentes com Shadcn/UI
- **Client-Side Routing**: Navegação SPA com React Router

## 📝 Desenvolvimento

A aplicação segue as convenções do React moderno com hooks, componentes funcionais e gerenciamento de estado através do TanStack Query para dados assíncronos.
