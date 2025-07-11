# 🤖 NLW Agents

<div align="center">

![GitHub repo size](https://img.shields.io/github/repo-size/user/nlw-agents)
![GitHub language count](https://img.shields.io/github/languages/count/user/nlw-agents)
![GitHub top language](https://img.shields.io/github/languages/top/user/nlw-agents)
![GitHub](https://img.shields.io/github/license/user/nlw-agents)

**Sistema inteligente de salas com IA para gravação de áudio e geração automática de perguntas e respostas**

[Demo](#-demo) • [Instalação](#-instalação) • [Uso](#-uso) • [Tecnologias](#-tecnologias) • [Contribuir](#-contribuir)

</div>

## 📋 Sobre o Projeto

O **NLW Agents** é uma aplicação full-stack moderna que permite criar salas virtuais onde usuários podem:

- 🎙️ **Gravar áudio em tempo real** com controles de pausar/retomar
- 🧠 **Gerar transcrições automáticas** usando IA (Gemini)
- ❓ **Fazer perguntas** e receber respostas baseadas no conteúdo gravado
- 📊 **Gerenciar múltiplas salas** com histórico de perguntas
- ⚡ **Experiência em tempo real** com interface responsiva

## 🎯 Principais Funcionalidades

### 🎵 Gravação de Áudio Inteligente
- Gravação contínua com chunks de 5 segundos
- Controles de pausar/retomar/parar
- Upload automático e processamento em background
- Rate limiting e retry com backoff exponencial

### 🤖 IA Integrada
- Transcrição automática com Gemini 2.5 Flash
- Geração de embeddings para busca semântica
- Respostas contextualizadas baseadas no conteúdo gravado
- Cache inteligente para otimização de performance

### 💬 Sistema de Perguntas
- Interface intuitiva para fazer perguntas
- Busca por similaridade semântica no conteúdo
- Respostas geradas em tempo real
- Histórico completo por sala

## 🚀 Demo

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/nlw-agents.git
cd nlw-agents

# Configure e inicie o backend
cd server
npm install
docker compose up -d
npm run db:migrate
npm run dev

# Configure e inicie o frontend
cd ../web
npm install
npm run dev
```

Acesse `http://localhost:5173` para ver a aplicação em funcionamento!

## 🛠️ Tecnologias

<div align="center">

### Backend
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### IA & Ferramentas
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Drizzle](https://img.shields.io/badge/Drizzle-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)

</div>

## 📁 Estrutura do Projeto

```
nlw-agents/
├── 📁 server/                 # Backend API
│   ├── 📁 src/
│   │   ├── 📁 db/            # Configuração do banco
│   │   ├── 📁 http/          # Rotas da API
│   │   ├── 📁 services/      # Serviços (Gemini IA)
│   │   └── 📄 server.ts      # Servidor principal
│   ├── 📄 docker-compose.yml # Banco PostgreSQL
│   └── 📄 package.json
│
├── 📁 web/                   # Frontend React
│   ├── 📁 src/
│   │   ├── 📁 components/    # Componentes UI
│   │   ├── 📁 pages/         # Páginas da aplicação
│   │   ├── 📁 http/          # Hooks de API
│   │   └── 📄 app.tsx        # App principal
│   └── 📄 package.json
│
└── 📄 README.md              # Este arquivo
```

## ⚙️ Instalação

### Pré-requisitos

- **Node.js** 18+ 
- **Docker** e **Docker Compose**
- **Chave API do Google Gemini**

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/nlw-agents.git
cd nlw-agents
```

### 2. Configure o Backend

```bash
cd server

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com sua chave do Gemini

# Inicie o banco de dados
docker compose up -d

# Execute as migrações
npm run db:migrate

# Popule com dados de exemplo
npm run db:seed

# Inicie o servidor
npm run dev
```

### 3. Configure o Frontend

```bash
cd ../web

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

## 🎮 Uso

### 1. Criar uma Sala
- Acesse a aplicação em `http://localhost:5173`
- Clique em "Criar Sala"
- Preencha nome e descrição

### 2. Gravar Áudio
- Entre na sala criada
- Clique em "Gravar Áudio"
- Use os controles para pausar/retomar/parar
- O áudio é processado automaticamente pela IA

### 3. Fazer Perguntas
- Digite sua pergunta na sala
- A IA busca no conteúdo gravado
- Receba respostas contextualizadas em tempo real

## 🔧 Configuração Avançada

### Variáveis de Ambiente (Server)

```env
PORT=3000
DATABASE_URL=postgresql://docker:docker@localhost:5432/agents
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=sua_chave_api_aqui
```

### Scripts Disponíveis

**Backend:**
```bash
npm run dev          # Desenvolvimento
npm run start        # Produção
npm run db:migrate   # Migrações
npm run db:seed      # Popular dados
```

**Frontend:**
```bash
npm run dev          # Desenvolvimento
npm run build        # Build produção
npm run preview      # Preview build
npm run lint         # Linting
```

## 🏗️ Arquitetura

### Backend
- **Fastify** como framework web
- **Drizzle ORM** para queries type-safe
- **Zod** para validação de schemas
- **Rate limiting** com retry inteligente
- **Cache de embeddings** para performance

### Frontend
- **React 19** com hooks modernos
- **TanStack Query** para estado servidor
- **Shadcn/UI** para componentes
- **React Router** para navegação
- **Responsive design** com TailwindCSS

## 🤝 Contribuir

Contribuições são sempre bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: Minha nova feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Autor

Feito com ❤️ por **Carlos** durante o evento NLW da Rocketseat

---

<div align="center">

**[⬆ Voltar ao topo](#-nlw-agents)**

</div>
