# 🎨 NLW Agents - Frontend

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Interface moderna e responsiva para sistema de salas com IA e gravação de áudio**

</div>

## 📋 Sobre

Frontend em **React 19** + **TypeScript** com interface moderna que oferece:

- 🎙️ **Gravação de áudio** com controles avançados (pausar/retomar/parar)
- 🏠 **Gerenciamento de salas** com criação e listagem
- ❓ **Sistema de perguntas** com respostas da IA em tempo real
- ⚡ **Interface responsiva** com loading states e feedback visual
- 🎨 **Design system** consistente com componentes reutilizáveis

## 🏗️ Arquitetura

### Stack Principal
- **React 19** - Biblioteca UI com hooks modernos
- **TypeScript** - Superset tipado do JavaScript  
- **Vite** - Build tool e dev server ultrarrápido
- **TailwindCSS v4** - Framework CSS utility-first

### UI/UX
- **Shadcn/UI** - Componentes reutilizáveis baseados em Radix UI
- **Lucide React** - Biblioteca de ícones moderna
- **Class Variance Authority** - Gerenciamento de variantes
- **Responsive Design** - Adaptável a todos dispositivos

### Estado e Navegação
- **React Router DOM** - Roteamento client-side
- **TanStack React Query** - Gerenciamento de estado servidor
- **Custom Hooks** - Lógica reutilizável para API

## 📁 Estrutura do Projeto

```
web/
├── 📁 src/
│   ├── 📁 components/              # Componentes reutilizáveis
│   │   ├── 📁 ui/                  # Design system base
│   │   │   ├── 📄 button.tsx       # Componente Button
│   │   │   ├── 📄 card.tsx         # Componente Card
│   │   │   ├── 📄 form.tsx         # Componentes Form
│   │   │   ├── 📄 input.tsx        # Componente Input
│   │   │   └── 📄 textarea.tsx     # Componente Textarea
│   │   │
│   │   ├── 📄 create-room-form.tsx      # Formulário criar sala
│   │   ├── 📄 question-form.tsx         # Formulário perguntas
│   │   ├── 📄 question-item.tsx         # Item de pergunta
│   │   ├── 📄 question-list.tsx         # Lista de perguntas
│   │   └── 📄 room-list.tsx             # Lista de salas
│   │
│   ├── 📁 pages/                   # Páginas da aplicação
│   │   ├── 📄 create-room.tsx      # Página inicial (criar salas)
│   │   ├── 📄 room.tsx             # Página da sala
│   │   └── 📄 record-room-audio.tsx # Página de gravação
│   │
│   ├── 📁 http/                    # Integração com API
│   │   ├── 📁 types/               # Tipos TypeScript
│   │   ├── 📄 use-create-question.ts    # Hook perguntas
│   │   ├── 📄 use-create-room.ts        # Hook criar sala
│   │   ├── 📄 use-recording-control.ts  # Hook gravação
│   │   ├── 📄 use-room-questions.ts     # Hook listar perguntas
│   │   └── 📄 use-rooms.ts              # Hook listar salas
│   │
│   ├── 📁 lib/                     # Utilitários
│   │   ├── 📄 utils.ts             # Funções utilitárias
│   │   └── 📄 dayjs.ts             # Configuração datas
│   │
│   ├── 📄 app.tsx                  # Configuração de rotas
│   ├── 📄 main.tsx                 # Entry point
│   └── 📄 index.css                # Estilos globais
│
├── 📄 index.html                   # Template HTML
├── 📄 vite.config.ts               # Configuração Vite
├── 📄 components.json              # Configuração Shadcn/UI
└── 📄 package.json                 # Dependências
```

## ⚙️ Instalação e Configuração

### Pré-requisitos
- **Node.js** 18+
- **Backend** rodando em `http://localhost:3000`

### 1. Instalar Dependências

```bash
npm install
```

### 2. Iniciar Servidor de Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## 🛠️ Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Linting com Biome
npm run format       # Formatação de código
npm run check        # Lint + format
npm run type-check   # Verificação de tipos
```

## 🎨 Design System

### Componentes Base

**Button** - Botão com variantes e estados
```tsx
<Button variant="default" size="lg">
  Clique aqui
</Button>
```

**Card** - Container com header e content
```tsx
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>Conteúdo</CardContent>
</Card>
```

**Form** - Formulários com validação
```tsx
<Form {...form}>
  <FormField name="field" render={({ field }) => (
    <FormItem>
      <FormLabel>Label</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
    </FormItem>
  )} />
</Form>
```

### Tema e Cores

- **Base**: Palette zinc com dark mode
- **Primary**: Blue gradient para CTAs
- **Secondary**: Green para success states  
- **Accent**: Red/amber para recording states
- **Muted**: Gray para textos secundários

## 📱 Páginas e Funcionalidades

### 🏠 Página Inicial (`/`)
- **Grid responsivo** com formulário de criação e lista de salas
- **Formulário validado** com Zod para criar novas salas
- **Lista dinâmica** de salas existentes com contadores
- **Cards interativos** com hover effects e gradientes

### 🏠 Página da Sala (`/room/:roomId`)
- **Formulário de perguntas** com textarea expansível
- **Lista de perguntas** com status de carregamento
- **Respostas da IA** com formatação rica
- **Botão para gravação** de áudio integrado

### 🎙️ Página de Gravação (`/room/:roomId/audio`)
- **Controles de gravação** com 3 estados (parado/gravando/pausado)
- **Indicadores visuais** com animações e cores dinâmicas
- **Status em tempo real** sincronizado com backend
- **Upload automático** de chunks de áudio a cada 5s

## 🔌 Integração com Backend

### Hooks Customizados

**useRooms** - Gerenciar salas
```tsx
const { data: rooms, isLoading } = useRooms()
```

**useCreateRoom** - Criar sala
```tsx
const { mutateAsync: createRoom } = useCreateRoom()
await createRoom({ name, description })
```

**useRoomQuestions** - Perguntas da sala  
```tsx
const { data: questions } = useRoomQuestions(roomId)
```

**useCreateQuestion** - Fazer pergunta
```tsx
const { mutateAsync: createQuestion } = useCreateQuestion(roomId)
await createQuestion({ question })
```

**useRecordingControl** - Controle de gravação
```tsx
const { status, startRecording, pauseRecording } = useRecordingControl(roomId)
```

### Estado e Cache

- **TanStack Query** para cache e sincronização
- **Optimistic updates** para UX fluida  
- **Background refetching** para dados atualizados
- **Error boundaries** para recuperação de erros

## 🎭 Estados e Loading

### Loading States

**Skeleton loaders** para listas
```tsx
{isLoading ? <SkeletonList /> : <QuestionList />}
```

**Spinners inline** para ações
```tsx
<Button disabled={isSubmitting}>
  {isSubmitting && <Spinner />}
  Enviar
</Button>
```

**Progress indicators** para uploads
```tsx
<div className="h-1 bg-blue-500 animate-pulse" />
```

### Error Handling

- **Toast notifications** para feedback
- **Error boundaries** para crashes
- **Retry buttons** para falhas de rede
- **Fallback states** para dados vazios

## 🎨 Estilização

### TailwindCSS

**Utility-first** com classes customizadas:
```tsx
<div className="bg-gradient-to-br from-slate-900 to-slate-800 min-h-screen">
  <Card className="border-0 shadow-2xl bg-gradient-to-br from-slate-800 to-red-950/20">
```

**Responsive design** com breakpoints:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
```

**Animations** com CSS:
```tsx
<div className="animate-pulse bg-red-500/20">
<div className="animate-ping rounded-full">
```

### CSS Variables

```css
:root {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --primary: 239 84% 67%;
  --primary-foreground: 0 0% 98%;
}
```

## 📊 Performance

### Bundle Optimization

- **Vite** para build otimizado
- **Tree shaking** automático
- **Code splitting** por rotas
- **Asset optimization** (imagens, fonts)

### Runtime Performance

- **React 19** com concurrent features
- **Memoização** de componentes pesados
- **Lazy loading** de rotas
- **Debounce** em inputs de busca

## 🧪 Testes

### Setup de Testes

```bash
npm run test          # Executar testes
npm run test:watch    # Modo watch
npm run test:coverage # Cobertura
```

### Estratégia

- **Unit tests** para utils e hooks
- **Component tests** com Testing Library
- **Integration tests** para fluxos
- **E2E tests** com Playwright

## 🚀 Build e Deploy

### Build Local

```bash
npm run build        # Gerar build
npm run preview      # Testar build local
```

### Deploy Estático

```bash
# Netlify
npm run build && netlify deploy --prod --dir dist

# Vercel  
npm run build && vercel --prod

# GitHub Pages
npm run build && gh-pages -d dist
```

### Variáveis de Ambiente

```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=NLW Agents
```

## 📝 Exemplos de Uso

### Criar Componente

```tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function MeuComponente() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Título</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Ação</Button>
      </CardContent>
    </Card>
  )
}
```

### Hook Customizado

```tsx
import { useQuery } from '@tanstack/react-query'

export function useMeuHook() {
  return useQuery({
    queryKey: ['meu-hook'],
    queryFn: async () => {
      const response = await fetch('/api/dados')
      return response.json()
    }
  })
}
```

### Página com Layout

```tsx
import { useParams } from 'react-router-dom'
import { MeuComponente } from '@/components/meu-componente'

export function MinhaPagina() {
  const { id } = useParams()
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <MeuComponente />
      </div>
    </div>
  )
}
```

## 🔧 Configurações

### Alias de Importação

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Configuração Vite

```ts
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

## 🎯 Padrões e Boas Práticas

### Estrutura de Componentes

- **Single Responsibility** - Uma responsabilidade por componente
- **Composition over Inheritance** - Prefer composição
- **Props Interface** - Sempre tipar props
- **Default Props** - Valores padrão quando necessário

### State Management

- **Local State** com useState para UI
- **Server State** com TanStack Query
- **Form State** com React Hook Form
- **Global State** mínimo e específico

### Code Quality

- **TypeScript strict** mode habilitado
- **Biome** para linting e formatação
- **Conventional Commits** para mensagens
- **Husky** para git hooks

---

<div align="center">

**Desenvolvido com ❤️ usando React e as melhores práticas de frontend**

[⬆ Voltar ao início](#-nlw-agents---frontend)

</div>
