# NLW Agents - Sistema de Salas

Sistema full-stack para gerenciamento de salas com funcionalidades de perguntas e respostas em tempo real.

## 🚀 Tecnologias

### Backend (`/server`)
- **Node.js** com TypeScript
- **Fastify** - Framework web rápido e eficiente
- **Drizzle ORM** - Type-safe SQL query builder
- **PostgreSQL** - Banco de dados relacional
- **Zod** - Validação de esquemas TypeScript
- **Docker** - Containerização do banco

### Frontend (`/web`)
- **React 19** com TypeScript
- **Vite** - Build tool e dev server
- **TailwindCSS** - Framework CSS utilitário
- **Radix UI** - Componentes acessíveis
- **TanStack Query** - Gerenciamento de estado servidor
- **React Router DOM** - Roteamento

## 📁 Estrutura do Projeto

```
nlw-agents/
├── server/          # Backend API
│   ├── src/
│   │   ├── db/      # Configuração do banco
│   │   └── server.ts
│   └── docker-compose.yml
└── web/             # Frontend React
    └── src/
```

## ⚙️ Setup e Configuração

### Pré-requisitos
- Node.js 18+
- Docker e Docker Compose

### Backend

1. **Navegue para o diretório do servidor:**
   ```bash
   cd server
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   ```bash
   cp .env.example .env
   ```

4. **Inicie o banco de dados:**
   ```bash
   docker compose up -d
   ```

5. **Execute as migrações:**
   ```bash
   npm run db:migrate
   ```

6. **Popule o banco com dados de exemplo:**
   ```bash
   npm run db:seed
   ```

7. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

### Frontend

1. **Navegue para o diretório web:**
   ```bash
   cd web
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

## 🛠️ Scripts Disponíveis

### Backend (`/server`)
- `npm run dev` - Inicia servidor em modo desenvolvimento
- `npm run start` - Inicia servidor em produção
- `npm run db:migrate` - Executa migrações do banco
- `npm run db:seed` - Popula banco com dados

### Frontend (`/web`)
- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build
- `npm run lint` - Executa linting
- `npm run format` - Formata código

## 🔧 Padrões de Projeto

- **Validação** com Zod em ambos frontend e backend
- **Type Safety** com TypeScript strict
- **Database First** com Drizzle ORM
- **Component Composition** com Radix UI
- **Utility First CSS** com TailwindCSS
- **Code Quality** com Biome (ESLint + Prettier)

## 🌐 URLs

- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:5173
- **PostgreSQL**: localhost:5432

## 📝 Variáveis de Ambiente

Copie `.env.example` para `.env` e configure:

```env
PORT=3000
DATABASE_URL=postgresql://docker:docker@localhost:5432/agents
``` 