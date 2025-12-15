# ADR-003: Gestion d'état avec Zustand

**Statut**: Accepté

**Date**: 2025-12-15

## Contexte

L'application nécessite une gestion d'état pour:
- La requête de recherche actuelle
- Les filtres appliqués
- Les paires de trading récupérées
- La pagination

Nous devons choisir une solution de state management simple, performante et facile à tester.

## Décision

Nous utilisons **Zustand** pour la gestion d'état globale.

### Implémentation

```typescript
interface SearchState {
  searchQuery: string;
  filters: SearchFilters;
  pairs: PairToken[];
  paginator: Paginator<PairToken>;
  
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  setPairs: (pairs: PairToken[]) => void;
  goToPage: (page: number) => void;
  // ...
}

export const useSearchStore = create<SearchState>((set) => ({
  // state and actions
}));
```

### Principes

1. **Store par domaine**: Un store Zustand par domaine métier
2. **Actions colocalisées**: Les actions sont définies dans le store
3. **Immuabilité**: Utilisation de l'immer middleware pour les updates
4. **Testabilité**: Accès direct au store via `useSearchStore.getState()`

## Conséquences

### Positives

- ✅ **Simplicité**: API minimale, pas de boilerplate
- ✅ **Performance**: Pas de re-renders inutiles grâce aux selectors
- ✅ **Taille**: 1.2kb gzippé (vs 3kb pour Redux)
- ✅ **TypeScript**: Support TypeScript excellent
- ✅ **DevTools**: Compatible avec Redux DevTools
- ✅ **Testabilité**: Facile à tester sans Provider
- ✅ **Pas de Context Hell**: Pas besoin de wrapper l'app

### Négatives

- ❌ Moins de middleware que Redux
- ❌ Communauté plus petite que Redux
- ❌ Pas de time-travel debugging natif

## Comparaison avec alternatives

| Feature | Zustand | Redux | Context API | Jotai |
|---------|---------|-------|-------------|-------|
| Taille | 1.2kb | 3kb | 0kb | 2.5kb |
| Boilerplate | Minimal | Élevé | Moyen | Minimal |
| Performance | Excellent | Bon | Moyen | Excellent |
| DevTools | ✅ | ✅ | ❌ | ✅ |
| Learning Curve | Faible | Élevée | Faible | Moyenne |

## Alternatives considérées

1. **Redux Toolkit**: Standard de l'industrie
   - Rejeté car trop de boilerplate pour une petite app

2. **Context API**: Solution native React
   - Rejeté car problèmes de performance avec re-renders

3. **Jotai**: Atomic state management
   - Rejeté car approche différente, préférence pour store centralisé

## Exemples d'utilisation

```typescript
// Dans un composant
const { pairs, goToPage } = useSearchStore();

// Dans un test
useSearchStore.setState({ pairs: mockPairs });
const state = useSearchStore.getState();
```

## Références

- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Zustand vs Redux](https://blog.logrocket.com/zustand-vs-redux/)
