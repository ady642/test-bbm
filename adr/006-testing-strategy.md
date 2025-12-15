# ADR-006: Stratégie de test (Vitest + Playwright)

**Statut**: Accepté

**Date**: 2025-12-15

## Contexte

Nous avons besoin d'une stratégie de test complète couvrant:
- Tests unitaires des modèles et utilitaires
- Tests d'intégration des composants React
- Tests E2E du parcours utilisateur
- Tests de régression visuelle

## Décision

Nous adoptons une **pyramide de tests** avec trois niveaux:

```
        /\
       /  \    E2E (Playwright)
      /    \   - 8 tests E2E
     /------\  - Visual regression
    /        \ 
   /  INTEG  \ Component Tests (Vitest + RTL)
  /           \- 50+ tests composants
 /-------------\
/    UNIT       \ Unit Tests (Vitest)
/________________\- 65+ tests unitaires
```

### 1. Tests Unitaires (Vitest)

**Cible**: Modèles, utilitaires, hooks

```typescript
// Exemple: PairToken.test.ts
describe('PairToken', () => {
  it('should create instance from DexScreener data', () => {
    const pair = PairToken.fromDexScreener(mockData);
    expect(pair.pairName).toBe('SOL/USDC');
  });
});
```

**Couverture**: 100% des modèles et utilitaires

### 2. Tests de Composants (Vitest + React Testing Library)

**Cible**: Composants React, pages, interactions

```typescript
// Exemple: SearchForm.test.tsx
describe('SearchForm', () => {
  it('should call onSearch when form is submitted', async () => {
    const onSearch = vi.fn();
    render(<SearchForm onSearch={onSearch} />);
    
    await userEvent.type(screen.getByPlaceholder(/search/i), 'ETH');
    await userEvent.click(screen.getByRole('button'));
    
    expect(onSearch).toHaveBeenCalledWith('ETH');
  });
});
```

**Principes**:
- Tests côté utilisateur (pas d'implémentation)
- Queries accessibles (getByRole, getByLabelText)
- Tests asynchrones avec waitFor

### 3. Tests E2E (Playwright)

**Cible**: Parcours utilisateur complets

```typescript
// Exemple: search.spec.ts
test('should perform search and display results', async ({ page }) => {
  await page.goto('/');
  await page.getByPlaceholder(/search/i).fill('ETH');
  await page.getByPlaceholder(/search/i).press('Enter');
  
  await expect(page.getByText(/searching/i)).toBeVisible();
  // Vérifier résultats...
});
```

**Scénarios couverts**:
- ✅ Recherche de paires
- ✅ Validation du formulaire
- ✅ Changement de thème
- ✅ Changement de langue
- ✅ Pagination
- ✅ Affichage des cartes

### 4. Tests de Régression Visuelle (Playwright)

**Cible**: Apparence sur différents viewports

```typescript
// Exemple: visual.spec.ts
test('should match desktop homepage screenshot', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('desktop-homepage.png', {
    fullPage: true,
    animations: 'disabled',
  });
});
```

**Viewports testés**:
- 📱 Mobile (375x667)
- 💻 Desktop (1280x720)
- 📱 Tablet (768x1024)

**États testés**:
- Page d'accueil
- Résultats de recherche
- Mode sombre
- Langue française
- État d'erreur
- État vide

## Configuration

### Vitest

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
```

### Playwright

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './e2e',
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 12'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
  },
});
```

## Métriques

| Type | Nombre | Temps | Couverture |
|------|--------|-------|------------|
| Unit | 65 | ~400ms | 100% |
| Component | 50 | ~600ms | 95% |
| E2E | 8 | ~30s | Parcours critiques |
| Visual | 8 | ~20s | UI complète |
| **Total** | **131** | **~52s** | **97%** |

## Conséquences

### Positives

- ✅ **Confiance**: Couverture complète de l'application
- ✅ **Refactoring**: Tests permettent refactoring en sécurité
- ✅ **Documentation**: Tests servent de documentation vivante
- ✅ **Régression**: Détection automatique des régressions visuelles
- ✅ **CI/CD**: Intégration facile dans pipeline
- ✅ **Multi-browser**: Playwright teste sur différents navigateurs

### Négatives

- ❌ **Temps**: Suite complète prend ~1 minute
- ❌ **Maintenance**: Tests E2E peuvent être fragiles
- ❌ **Snapshots**: Screenshots doivent être mis à jour régulièrement
- ❌ **Coût**: Tests E2E plus lents et consomment plus de ressources

## Scripts npm

```json
{
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest --coverage",
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui",
  "test:e2e:headed": "playwright test --headed",
  "test:e2e:update-snapshots": "playwright test --update-snapshots"
}
```

## Bonnes pratiques

### Tests Unitaires
- ✅ Un test = un comportement
- ✅ Arrange-Act-Assert pattern
- ✅ Noms descriptifs

### Tests de Composants
- ✅ Tester le comportement, pas l'implémentation
- ✅ Utiliser queries accessibles
- ✅ Mocker les dépendances externes

### Tests E2E
- ✅ Tester les parcours critiques uniquement
- ✅ Utiliser des selectors stables (role, label)
- ✅ Éviter les timeouts fixes, préférer waitFor

### Tests Visuels
- ✅ Désactiver les animations
- ✅ Masquer les éléments dynamiques (dates, etc.)
- ✅ Tester sur viewports représentatifs

## Alternatives considérées

1. **Cypress**: Alternative à Playwright
   - Rejeté car Playwright plus moderne et rapide

2. **Jest**: Pour tests unitaires
   - Rejeté car Vitest plus rapide avec Vite

3. **Storybook + Chromatic**: Pour tests visuels
   - Rejeté car Playwright suffit pour nos besoins

## Références

- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)
