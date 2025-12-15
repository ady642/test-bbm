# ADR-005: Système de thème Dark/Light

**Statut**: Accepté

**Date**: 2025-12-15

## Contexte

L'application doit supporter les modes clair et sombre pour améliorer l'expérience utilisateur. Le système doit:
- Détecter les préférences système
- Permettre le changement manuel
- Persister le choix de l'utilisateur
- S'intégrer avec TailwindCSS

## Décision

Nous implémentons un système de thème avec **React Context** et **TailwindCSS dark mode**.

### Architecture

```typescript
// src/contexts/ThemeContext.tsx
type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // 1. Vérifier localStorage
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
    
    // 2. Détecter préférence système
    return window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light';
  });

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // ...
}
```

### Configuration TailwindCSS

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // Utilise la classe 'dark' sur <html>
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // ...
      },
    },
  },
};
```

### CSS Variables

```css
/* src/index.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ... */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... */
}
```

### Composant ThemeSwitcher

- Icônes Moon/Sun de Lucide React
- Toggle simple avec animation
- Accessible (aria-label)

## Conséquences

### Positives

- ✅ **UX**: Respect des préférences utilisateur
- ✅ **Accessibilité**: Réduit la fatigue oculaire
- ✅ **Performance**: Pas de flash de contenu non stylé
- ✅ **Persistance**: Choix sauvegardé entre sessions
- ✅ **Simplicité**: Pas de librairie externe nécessaire
- ✅ **Flexibilité**: Facile d'ajouter plus de thèmes

### Négatives

- ❌ Nécessite définir toutes les couleurs en double
- ❌ Tests doivent mocker `window.matchMedia`
- ❌ Maintenance des CSS variables

## Implémentation des couleurs

**Approche**: Utiliser des CSS variables HSL pour faciliter les variations

```css
/* Avantage: Facile de créer des variantes */
--primary: 221.2 83.2% 53.3%;
--primary-foreground: 210 40% 98%;

/* Dans TailwindCSS */
bg-primary text-primary-foreground
```

## Tests

Mock de `window.matchMedia` dans le setup:

```typescript
// src/test/setup.ts
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    // ...
  }),
});
```

## Alternatives considérées

1. **next-themes**: Librairie dédiée pour Next.js
   - Rejeté car dépendance supplémentaire non nécessaire

2. **CSS prefers-color-scheme only**: Sans toggle manuel
   - Rejeté car pas de contrôle utilisateur

3. **Styled-components ThemeProvider**: Avec CSS-in-JS
   - Rejeté car on utilise TailwindCSS

## Améliorations futures

- [ ] Support de thèmes personnalisés
- [ ] Transition animée entre thèmes
- [ ] Mode "auto" qui suit le système
- [ ] Thèmes additionnels (high contrast, etc.)

## Références

- [TailwindCSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [prefers-color-scheme MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [Web.dev Dark Mode Best Practices](https://web.dev/prefers-color-scheme/)
