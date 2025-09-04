# CineDiscover - Movie Discovery App
<img width="1919" height="907" alt="image" src="https://github.com/user-attachments/assets/372b6af7-052a-4003-b99b-90229ae09249" />


Uma aplicação moderna para busca de filmes construída com React, TypeScript e a API do TMDB.

## ✨ Funcionalidades

- **🔍 Busca Inteligente**: Busca com debounce e histórico de pesquisas
- **📄 Paginação Avançada**: Navegação fluida entre resultados
- **🎬 Detalhes Completos**: Informações detalhadas incluindo elenco e equipe técnica
- **❤️ Sistema de Favoritos**: Adicione filmes aos favoritos com persistência local
- **⚡ Performance Otimizada**: Lazy loading de imagens e cache inteligente
- **📱 Design Responsivo**: Interface adaptável para todos os dispositivos
- **🎨 UI Premium**: Animações suaves e micro-interações elegantes

## 🚀 Tecnologias

- **React 18** com Hooks e Context API
- **TypeScript** para tipagem estática
- **React Router** para navegação
- **Tailwind CSS** para estilização
- **Lucide React** para ícones
- **API do TMDB** para dados de filmes

## 📦 Instalação

1. Clone o projeto
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure sua chave da API do TMDB:
   - Obtenha uma chave gratuita em: https://www.themoviedb.org/settings/api
   - Substitua `YOUR_TMDB_API_KEY` em `src/services/tmdbApi.ts`

4. Execute o projeto:
   ```bash
   npm run dev
   ```

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── common/
│   ├── layout/
│   └── movie/         
├── context/            # Context API para estado global
│   ├── AppContext.tsx
├── hooks/              # Custom hooks
│   ├── useDebounce.ts
├── pages/              # Páginas da aplicação
│   ├── FavoritePage.tsx
│   ├── MovieDetailsPage.tsx      
│   └── SearchPage.tsx
├── services/           # Serviços de API
│   └── tmdbApi.ts   
└── types/              # Definições TypeScript
    └── movie.ts
```

## 🎯 Funcionalidades Implementadas

### ✅ Obrigatórias
- [x] Página de busca com resultados paginados
- [x] Paginação com navegação entre páginas
- [x] Página de detalhes completa
- [x] Sistema de favoritos com localStorage
- [x] Tratamento de erros e states de loading

### ⭐ Diferenciais
- [x] Debounce na busca para otimização
- [x] Lazy loading de imagens com placeholders
- [x] Cache inteligente de requisições API
- [x] Histórico de pesquisas
- [x] Skeleton loading states
- [x] Animações e micro-interações
- [x] Design responsivo premium
- [x] Tratamento robusto de erros com retry
- [x] Performance otimizada


## 📱 Responsividade

- **Mobile**: 2 colunas de filmes
- **Tablet**: 3-4 colunas
- **Desktop**: 5-6 colunas
- **Telas grandes**: Até 6 colunas


## 📈 Otimizações

- Cache de requisições por 5 minutos
- Lazy loading com Intersection Observer
- Debounce para reduzir calls desnecessárias
- Componentes otimizados com React.memo
- Gerenciamento eficiente de estado

## 🎪 Demonstração

A aplicação carrega filmes populares por padrão e permite:
1. Buscar por qualquer filme
2. Ver detalhes completos com elenco e informações técnicas
3. Adicionar/remover dos favoritos
4. Navegar entre páginas de resultados
5. Acessar histórico de pesquisas
