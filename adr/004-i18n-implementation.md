# ADR-004: Internationalisation avec i18next

**Statut**: Accepté

**Date**: 2025-12-15

## Contexte

L'application doit supporter plusieurs langues (Anglais et Français initialement) avec possibilité d'extension. Nous devons choisir une solution d'internationalisation robuste et facile à maintenir.

## Décision

Nous utilisons **i18next** avec **react-i18next** pour l'internationalisation.

### Structure des traductions

```
src/
  i18n/
    config.ts           # Configuration i18next
    locales/
      en.json          # Traductions anglaises
      fr.json          # Traductions françaises
```

### Utilisation

```typescript
// Dans un composant
const { t, i18n } = useTranslation();

<h1>{t('app.title')}</h1>
<button onClick={() => i18n.changeLanguage('fr')}>
  Français
</button>
```

### Composant de sélection de langue

- Drapeaux emoji pour identification visuelle (🇬🇧 🇫🇷)
- Boutons avec état actif
- Responsive (code langue caché sur mobile)

## Conséquences

### Positives

- ✅ **Standard de l'industrie**: Solution la plus utilisée pour React
- ✅ **Détection automatique**: Détecte la langue du navigateur
- ✅ **Interpolation**: Support des variables dans les traductions
- ✅ **Pluralisation**: Gestion automatique du pluriel
- ✅ **Lazy loading**: Chargement des traductions à la demande possible
- ✅ **TypeScript**: Support TypeScript avec types générés
- ✅ **Tests**: Traductions partagées entre app et tests

### Négatives

- ❌ Taille du bundle: ~10kb (peut être optimisé)
- ❌ Configuration initiale plus complexe
- ❌ Nécessite maintenance des fichiers de traduction

## Organisation des traductions

```json
{
  "app": {
    "title": "DEX Pair Explorer",
    "description": "Search and discover..."
  },
  "search": {
    "placeholder": "Search for pairs...",
    "validation": {
      "required": "Search query is required"
    }
  }
}
```

**Principes**:
- Namespaces par domaine/feature
- Clés descriptives en camelCase
- Groupement logique des traductions

## Tests

Les traductions sont importées directement dans le setup de test:

```typescript
// src/test/setup.ts
import en from '../i18n/locales/en.json';
import fr from '../i18n/locales/fr.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
  },
});
```

**Avantage**: Une seule source de vérité pour les traductions.

## Alternatives considérées

1. **react-intl**: Solution de FormatJS
   - Rejeté car API plus complexe et moins flexible

2. **LinguiJS**: Solution moderne avec extraction automatique
   - Rejeté car moins mature et communauté plus petite

3. **Custom solution**: Implémentation maison
   - Rejeté car réinventer la roue, manque de fonctionnalités

## Références

- [i18next Documentation](https://www.i18next.com/)
- [react-i18next Documentation](https://react.i18next.com/)
- [i18next Best Practices](https://locize.com/blog/react-i18next/)
