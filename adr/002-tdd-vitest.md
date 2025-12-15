# ADR-002: Test-Driven Development avec Vitest

**Statut**: Accepté

**Date**: 2025-12-15

## Contexte

Le projet nécessite une suite de tests robuste pour garantir la qualité du code et faciliter les refactorings. Nous devons choisir un framework de test moderne et performant compatible avec Vite.

## Décision

Nous adoptons **Vitest** comme framework de test principal avec une approche **Test-Driven Development (TDD)**.

### Approche TDD

1. **Red**: Écrire un test qui échoue
2. **Green**: Écrire le code minimal pour faire passer le test
3. **Refactor**: Améliorer le code tout en gardant les tests verts

### Organisation des tests

- Tests unitaires à côté des fichiers sources (ex: `PairToken.test.ts`)
- Tests de composants avec React Testing Library (White box)
- Setup partagé dans `src/test/setup.ts`

## Conséquences

### Positives

- ✅ **Performance**: Vitest est 10x plus rapide que Jest grâce à Vite
- ✅ **Compatibilité**: Configuration Vite réutilisée, pas de duplication
- ✅ **DX**: Hot Module Replacement pour les tests
- ✅ **API familière**: Compatible avec Jest, migration facile
- ✅ **Couverture**: 115 tests passent avec 100% de couverture des modèles
- ✅ **TDD**: Force à penser à l'API avant l'implémentation

### Négatives

- ❌ Écosystème moins mature que Jest
- ❌ Certains plugins Jest peuvent ne pas être compatibles
- ❌ TDD demande plus de temps initial de développement

## Métriques

- **115 tests** au total
- **Temps d'exécution**: ~1.2s pour toute la suite
- **Couverture**: 
  - Models: 100%
  - Components: 95%
  - Store: 100%

### Commandes

```bash
# Lancer les tests
npm test

# Lancer les tests avec l'interface UI
npm run test:ui

# Générer le rapport de couverture
npm run test:coverage
```

Le rapport de couverture est généré dans `coverage/index.html` et peut être ouvert dans un navigateur.

## Alternatives considérées

1. **Jest**: Framework le plus populaire
   - Rejeté car plus lent et nécessite configuration supplémentaire avec Vite

2. **Testing Library seule**: Sans framework de test
   - Rejeté car manque de fonctionnalités (mocking, coverage, etc.)

## Références

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Test-Driven Development by Kent Beck](https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530)
