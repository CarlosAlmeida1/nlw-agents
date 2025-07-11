# 🚀 NLW Agents - Backend API

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

**API robusta com IA integrada para processamento de áudio e geração de respostas inteligentes**

</div>

## 📋 Sobre

Backend em **Node.js** + **TypeScript** que oferece funcionalidades avançadas de:

- 🎙️ **Processamento de áudio** com transcrição automática
- 🧠 **Integração com IA** (Google Gemini) para embeddings e respostas
- 📊 **Gerenciamento de salas** e sessões de gravação
- ⚡ **Rate limiting inteligente** com retry e cache
- 🔍 **Busca semântica** no conteúdo transcrito

## 🏗️ Arquitetura

### Stack Principal
- **Fastify** - Framework web ultra-rápido
- **Drizzle ORM** - Query builder type-safe
- **PostgreSQL** - Banco de dados vetorial
- **Zod** - Validação de schemas TypeScript
- **Docker** - Containerização do ambiente

### Serviços Integrados
- **Google Gemini 2.5 Flash** - Transcrição e geração de texto
- **Text Embedding 004** - Geração de embeddings vetoriais

## 📁 Estrutura do Projeto

```
server/
├── 📁 src/
│   ├── 📁 db/                    # Configuração do banco
│   │   ├── 📁 migrations/        # Migrações SQL
│   │   ├── 📁 schemas/           # Schemas Drizzle
│   │   ├── 📄 connection.ts      # Conexão PostgreSQL
│   │   ├── 📄 migrate.ts         # Runner de migrações
│   │   └── 📄 seed.ts            # Dados de exemplo
│   │
│   ├── 📁 http/                  # Rotas da API
│   │   └── 📁 routes/
│   │       ├── 📄 create-room.ts          # Criar salas
│   │       ├── 📄 create-question.ts      # Fazer perguntas
│   │       ├── 📄 get-rooms.ts            # Listar salas
│   │       ├── 📄 get-room-questions.ts   # Perguntas da sala
│   │       ├── 📄 upload-audio.ts         # Upload de áudio
│   │       └── 📄 recording-control.ts    # Controle de gravação
│   │
│   ├── 📁 services/              # Serviços externos
│   │   └── 📄 gemini.ts          # Integração com IA
│   │
│   ├── 📁 lib/                   # Utilitários
│   │   └── 📄 recording-sessions.ts # Estado das gravações
│   │
│   ├── 📄 env.ts                 # Variáveis de ambiente
│   └── 📄 server.ts              # Servidor principal
│
├── 📄 docker-compose.yml         # PostgreSQL + pgAdmin
├── 📄 drizzle.config.ts          # Configuração ORM
└── 📄 package.json               # Dependências
```

## ⚙️ Instalação e Configuração

### Pré-requisitos
- **Node.js** 18+
- **Docker** e **Docker Compose**
- **Chave API do Google Gemini**

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
PORT=3000
DATABASE_URL=postgresql://docker:docker@localhost:5432/agents
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=sua_chave_api_do_gemini
```

### 3. Inicializar Banco de Dados

```bash
# Subir PostgreSQL
docker compose up -d

# Executar migrações
npm run db:migrate

# Popular com dados de exemplo
npm run db:seed
```

### 4. Iniciar Servidor

```bash
# Desenvolvimento
npm run dev

# Produção
npm run start
```

## 🛠️ Scripts Disponíveis

```bash
npm run dev          # Servidor em modo desenvolvimento
npm run start        # Servidor em modo produção
npm run build        # Build TypeScript
npm run db:migrate   # Executar migrações
npm run db:seed      # Popular banco com dados
npm run db:studio    # Interface visual do banco
```

## 🔌 Endpoints da API

### 📊 Salas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/rooms` | Listar todas as salas |
| `POST` | `/rooms` | Criar nova sala |

### ❓ Perguntas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/rooms/:roomId/questions` | Listar perguntas da sala |
| `GET` | `/rooms/:roomId/questions/:questionId` | Obter pergunta específica |
| `POST` | `/rooms/:roomId/questions` | Fazer nova pergunta |

### 🎙️ Áudio e Gravação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/rooms/:roomId/audio` | Upload de chunk de áudio |
| `GET` | `/rooms/:roomId/recording/status` | Status da gravação |
| `POST` | `/rooms/:roomId/recording/start` | Iniciar gravação |
| `POST` | `/rooms/:roomId/recording/pause` | Pausar gravação |
| `POST` | `/rooms/:roomId/recording/resume` | Retomar gravação |
| `POST` | `/rooms/:roomId/recording/stop` | Parar gravação |

## 🤖 Integração com IA

### Funcionalidades do Gemini

**1. Transcrição de Áudio**
```typescript
// Converte áudio WebM para texto
const transcription = await transcribeAudio(audioBase64, mimeType)
```

**2. Geração de Embeddings**
```typescript
// Cria embeddings vetoriais para busca semântica
const embeddings = await generateEmbeddings(transcription)
```

**3. Geração de Respostas**
```typescript
// Responde perguntas baseadas no contexto
const answer = await generateAnswer(question, relevantTranscriptions)
```

### Rate Limiting e Cache

- **Retry com backoff exponencial** para erros 429
- **Fila de processamento** (max 120 req/min)
- **Cache de embeddings** para evitar recálculos
- **Tratamento robusto de erros** com mensagens específicas

## 💾 Banco de Dados

### Schema Principal

**Salas (`rooms`)**
- `id`, `name`, `description`, `createdAt`

**Perguntas (`questions`)**
- `id`, `roomId`, `question`, `answer`, `createdAt`

**Chunks de Áudio (`audioChunks`)**
- `id`, `roomId`, `transcription`, `embeddings`, `createdAt`

### Queries Otimizadas

- **Busca por similaridade** usando vetores
- **Joins eficientes** com contagem de perguntas
- **Índices** para performance em produção

## 🔧 Configurações Avançadas

### Rate Limiting

```typescript
// Configuração do retry
const MAX_RETRIES = 3
const INITIAL_DELAY = 1000
const BACKOFF_FACTOR = 2
```

### Cache de Embeddings

```typescript
// Cache em memória para embeddings
const embeddingsCache = new Map<string, number[]>()
```

### Fila de API

```typescript
// Controle de requisições
const minInterval = 500 // 500ms entre chamadas
```

## 🐳 Docker

O projeto inclui configuração completa do Docker:

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: docker
      POSTGRES_PASSWORD: docker
      POSTGRES_DB: agents
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  pgadmin:
    image: dpage/pgadmin4
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@admin.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "8080:80"
```

## 🔍 Monitoramento

### Logs Estruturados
- Request/response logging com Fastify
- Error tracking com stack traces
- Performance metrics de API calls

### Health Check
```bash
GET /health  # Retorna "OK"
```

## 🚀 Deploy

### Produção

1. **Build da aplicação:**
```bash
npm run build
```

2. **Configurar variáveis de ambiente:**
```bash
export DATABASE_URL="postgresql://user:pass@host:5432/db"
export GEMINI_API_KEY="sua_chave"
```

3. **Executar migrações:**
```bash
npm run db:migrate
```

4. **Iniciar servidor:**
```bash
npm start
```

### Docker em Produção

```bash
# Build da imagem
docker build -t nlw-agents-server .

# Executar container
docker run -p 3000:3000 nlw-agents-server
```

## 🧪 Testes

```bash
# Executar testes
npm test

# Cobertura
npm run test:coverage

# E2E
npm run test:e2e
```

## 📝 Exemplos de Uso

### Criar Sala

```bash
curl -X POST http://localhost:3000/rooms \
  -H "Content-Type: application/json" \
  -d '{"name": "Minha Sala", "description": "Descrição da sala"}'
```

### Upload de Áudio

```bash
curl -X POST http://localhost:3000/rooms/123/audio \
  -F "file=@audio.webm"
```

### Fazer Pergunta

```bash
curl -X POST http://localhost:3000/rooms/123/questions \
  -H "Content-Type: application/json" \
  -d '{"question": "O que foi discutido sobre IA?"}'
```

## 🔐 Segurança

- **Validação de entrada** com Zod
- **CORS configurado** para frontend
- **Rate limiting** integrado
- **Sanitização de dados** automática
- **Environment variables** para secrets

## 📊 Performance

- **Fastify** - ~65k req/sec
- **Connection pooling** com PostgreSQL
- **Async/await** em todas operações
- **Streaming** para upload de arquivos
- **Cache inteligente** de embeddings

---

<div align="center">

**Desenvolvido com ❤️ usando as melhores práticas de Node.js**

[⬆ Voltar ao início](#-nlw-agents---backend-api)

</div> 