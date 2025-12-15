# ADR-001: Architecture Domain-Driven Design

**Statut**: Accepté

**Date**: 2025-12-15

## Contexte

Le projet nécessite une architecture claire et maintenable pour gérer la recherche et l'affichage de paires de trading DEX. L'application doit être facilement extensible pour ajouter de nouveaux domaines métier à l'avenir.

## Décision

Nous adoptons une architecture Domain-Driven Design (DDD) avec la structure suivante:

```
src/
  domains/
    Search/
      models/       # Entités et logique métier
      components/   # Composants UI spécifiques au domaine
      pages/        # Pages du domaine
      store/        # État du domaine (Zustand)
      hooks/        # Hooks React personnalisés
      api/          # Appels API
      types/        # Types TypeScript
```

### Principes appliqués

1. **Séparation des préoccupations**: Chaque domaine est isolé avec ses propres modèles, composants et logique
2. **Modèles riches**: Les classes `PairToken` et `Paginator` encapsulent la logique métier
3. **Factory patterns**: Méthode statique `fromDexScreener()` pour créer des instances depuis l'API
4. **Tests au niveau du domaine**: Chaque partie du domaine a ses propres tests

## Conséquences

### Positives

- ✅ Code organisé et facile à naviguer
- ✅ Facilite l'ajout de nouveaux domaines (ex: Portfolio, Analytics)
- ✅ Tests isolés par domaine
- ✅ Réutilisabilité des composants au sein d'un domaine
- ✅ Logique métier centralisée dans les modèles

### Négatives

- ❌ Structure de dossiers plus profonde
- ❌ Peut sembler over-engineered pour une petite application
- ❌ Courbe d'apprentissage pour les nouveaux développeurs

## Alternatives considérées

1. **Feature-based structure**: Organisation par fonctionnalité plutôt que par domaine
   - Rejetée car moins scalable pour des domaines métier complexes

2. **Flat structure**: Tous les composants au même niveau
   - Rejetée car difficile à maintenir à mesure que l'application grandit

## Références

- [Domain-Driven Design by Eric Evans](https://www.domainlanguage.com/ddd/)
- [React Application Architecture for Production](https://www.robinwieruch.de/react-folder-structure/)
