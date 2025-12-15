# DEX Pair Explorer

Application React/TypeScript pour rechercher et explorer des paires de trading sur les DEX (Decentralized Exchanges) via l'API DEX Screener.

## 🚀 Démo

L'application permet de :
- Rechercher des paires de trading (ex: SOL/USDC, ETH/USDT)
- Afficher les informations détaillées : prix, volume 24h, liquidité, market cap
- Pagination des résultats (12 paires par page)
- Interface moderne et responsive avec TailwindCSS

## 🏗️ Architecture

Le projet suit une architecture **Domain-Driven Design (DDD)** avec une approche **Test-Driven Development (TDD)**.

### Structure du projet

```
src/
├── domains/
│   └── Search/
│       ├── models/           # Modèles métier (PairToken, Paginator)
│       ├── types/            # Types TypeScript
│       ├── store/            # Store Zustand
│       ├── api/              # Services API
│       ├── hooks/            # Hooks React Query
│       ├── components/       # Composants React
│       └── pages/            # Pages
├── lib/                      # Utilitaires
└── test/                     # Configuration des tests
```

## 🛠️ Stack Technique

- **React 19** - Framework UI
- **TypeScript** - Typage statique
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Zustand** - State management
- **TanStack Query** - Data fetching et cache
- **React Hook Form** - Gestion des formulaires avec validation
- **Vitest** - Framework de tests
- **React Testing Library** - Tests de composants
- **Lucide React** - Icônes

## 📦 Installation

```bash
npm install
```

## 🧪 Tests

Le projet contient des tests couvrant :
- Modèles métier (PairToken, Paginator)
- Composants React (SearchForm, PairCard, Pagination, etc.)
- Validation des formulaires
- Gestion des états (loading, error, empty)

```bash
# Lancer les tests
npm test

# Tests en mode watch
npm test -- --watch

# Tests avec UI
npm test:ui

# Coverage
npm test:coverage
```

## 🚀 Développement

```bash
# Démarrer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 🏭 Build

```bash
# Build de production
npm run build

# Preview du build
npm run preview
```

## 🎯 Choix Techniques

### Domain-Driven Design (DDD)
- Organisation par domaine métier (Search)
- Séparation claire des responsabilités
- Modèles métier avec logique encapsulée

### Test-Driven Development (TDD)
- Tests écrits avant l'implémentation
- Couverture complète des modèles et composants
- Approche Red-Green-Refactor

### Factory Pattern
- `PairToken.fromDexScreener()` pour créer des instances depuis l'API
- Encapsulation de la logique de transformation

### Performance
- Pagination côté client pour réduire les appels API
- Cache avec TanStack Query (30s staleTime)
- Composants optimisés pour éviter les re-renders

### UX/UI
- États visuels clairs (loading, error, empty)
- Feedback visuel sur les interactions
- Responsive design
- Accessibilité (ARIA labels)

## 📝 Notes

**Temps de développement** : ~2h30 heures

**Améliorations possibles avec plus de temps** :
- Filtres avancés (liquidité min, volume min, blockchain)
- Tri des résultats
- Favoris persistants (localStorage)
- Graphiques de prix
- Déploiement CI/CD
- Améliorer design (UI et UX)
- Séparer couches UI et métier