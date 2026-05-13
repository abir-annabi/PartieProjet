# HANDITALENTS_FRONTEND.md
# Design System · Frontend Rules · Agent Instructions
# Version 1.0 — Mai 2026
# Stack: Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · TypeScript strict
# Langues: FR (défaut) | AR (RTL) | EN
# Rôles: admin | company | candidate | inspector | aneti

---

# PARTIE 1 — DESIGN SYSTEM

## 1.1 COULEURS

### Palette principale — Brand Aubergine

La couleur de marque est un aubergine profond. Pas de gradients. Pas de washes saturés.
L'interface doit rester lisible pour des données denses de recrutement.

```css
:root {
  /* Brand — Aubergine */
  --color-brand-50:  #F7F3FE;
  --color-brand-100: #ECE4FB;
  --color-brand-200: #D8CAF6;  /* accent surface, focus ring */
  --color-brand-300: #BDA0C7;
  --color-brand-400: #9468A1;
  --color-brand-500: #6B2E7A;
  --color-brand-600: #4A1257;
  --color-brand-700: #35063E;  /* PRIMARY — boutons, headers */
  --color-brand-800: #25052D;
  --color-brand-900: #1A0320;
  --color-brand-950: #0E0214;

  /* Neutral — Ink (teinte violette froide) */
  --color-bg:         #FBFAFC;
  --color-neutral-50: #F6F5F8;
  --color-neutral-100:#ECEAF0;
  --color-neutral-200:#D9D5DF;
  --color-neutral-300:#B8B3C2;
  --color-neutral-400:#8E889C;
  --color-neutral-500:#6B6478;  /* texte secondaire — 5.4:1 sur blanc ✓ AA */
  --color-neutral-600:#4A4458;
  --color-neutral-700:#2D2837;  /* texte corps — 14.1:1 sur blanc ✓ AAA */
  --color-neutral-800:#1F1B28;
  --color-neutral-900:#14111A;

  /* Semantic — Status */
  --color-success-100:#DCFCE7;
  --color-success-500:#22C55E;
  --color-success-700:#15803D;

  --color-warning-100:#FEF9C3;
  --color-warning-500:#EAB308;
  --color-warning-700:#A16207;

  --color-danger-100: #FEE2E2;
  --color-danger-500: #EF4444;
  --color-danger-700: #B91C1C;

  --color-info-100:   #DBEAFE;
  --color-info-500:   #3B82F6;
  --color-info-700:   #1D4ED8;

  /* Surfaces */
  --color-surface:        #FFFFFF;
  --color-surface-subtle: #F6F5F8;
  --color-surface-muted:  #ECEAF0;
  --color-border:         #D9D5DF;
  --color-border-strong:  #B8B3C2;

  /* Text */
  --color-text-primary:   #14111A;
  --color-text-secondary: #2D2837;
  --color-text-muted:     #6B6478;
  --color-text-disabled:  #8E889C;
  --color-text-inverse:   #FFFFFF;
  --color-text-link:      #4A1257;
  --color-text-link-hover:#35063E;

  /* Focus ring */
  --color-focus-ring:     #D8CAF6;  /* brand-200 */
  --focus-ring:           0 0 0 3px var(--color-focus-ring);
}
```

**Paires de contraste WCAG vérifiées :**

| Combinaison                        | Ratio    | Niveau |
|------------------------------------|----------|--------|
| Blanc sur brand-700 (#35063E)      | 15.8 : 1 | AAA ✓  |
| Brand-700 sur brand-200            | 8.6 : 1  | AAA ✓  |
| Ink-700 sur blanc                  | 14.1 : 1 | AAA ✓  |
| Ink-500 sur blanc                  | 5.4 : 1  | AA ✓   |

**❌ INTERDIT :**
- Gradients violet/bleu génériques
- Couleurs hardcodées dans les composants (toujours les tokens)
- Blanc pur `#FFFFFF` comme seule couleur de fond → utiliser `--color-bg` (`#FBFAFC`)
- Noir pur `#000000` → utiliser `--color-neutral-900`
- Transmettre une information par la couleur seule

---

## 1.2 TYPOGRAPHIE

```css
/* app/layout.tsx — chargé une seule fois via next/font */
:root {
  --font-display: 'Inter', sans-serif;        /* Latin — titres, display */
  --font-body:    'Inter', sans-serif;        /* Latin — corps, UI */
  --font-arabic:  'Noto Sans Arabic', sans-serif; /* AR uniquement */
  --font-mono:    'JetBrains Mono', monospace; /* IDs, codes, tokens */
}

/* En locale AR, remplacer font-body par font-arabic */
[lang="ar"] { font-family: var(--font-arabic); }
```

### Échelle typographique

| Token        | Size    | Weight | Line-height | Tracking | Usage                       |
|--------------|---------|--------|-------------|----------|-----------------------------|
| `text-display`| 56px   | 700    | 60px        | -2.5%    | Hero, grandes pages vides   |
| `text-h1`    | 40px    | 700    | 44px        | -2%      | Titre de page               |
| `text-h2`    | 28px    | 600    | 34px        | –        | Section principale          |
| `text-h3`    | 22px    | 600    | 29px        | –        | Sous-section, card header   |
| `text-h4`    | 18px    | 600    | 25px        | –        | Labels groupés, détails     |
| `text-body-l`| 17px    | 400    | 27px        | –        | Mode accessible (candidat)  |
| `text-body`  | 15px    | 400    | 23px        | –        | Texte standard              |
| `text-body-s`| 13px    | 400    | 20px        | –        | Helper, meta, hints         |
| `text-caption`| 12px   | 600    | 17px        | +0.06em  | Uppercase — badges, labels  |
| `text-mono`  | 13px    | 400    | 20px        | –        | IDs, codes — JetBrains Mono |

**Règles :**
- Longueur de ligne max : **65–75 caractères** pour le corps de texte
- `clamp()` pour les titres display/H1 sur mobile
- Mode accessible candidat : taille de base 16px → inflated à 17px (`text-body-l`)
- Titres : jamais tout en majuscules dans le contenu (sauf `text-caption` / badges)
- Taille de texte min visiable : 12px (jamais en dessous)

---

## 1.3 ESPACEMENT, RADIUS, ÉLÉVATION

### Spacing — base 4px, rythme 8pt

```css
:root {
  --s-1:  4px;
  --s-2:  8px;
  --s-3:  12px;
  --s-4:  16px;
  --s-6:  24px;
  --s-8:  32px;
  --s-12: 48px;
  --s-16: 64px;
}
```

Tailwind : `gap-1`=4px · `gap-2`=8px · `gap-3`=12px · `gap-4`=16px · `gap-6`=24px...

### Radius

```css
:root {
  --r-sm:  6px;   /* chips, tags, badges */
  --r-md:  10px;  /* boutons, inputs */
  --r-lg:  14px;  /* cards, panels */
  --r-xl:  20px;  /* sheets, modals, drawers */
}
```

### Élévation — soft, low only

```css
:root {
  --shadow-1: 0 1px 3px rgba(20,17,26,.06), 0 1px 2px rgba(20,17,26,.04);  /* cards au repos */
  --shadow-2: 0 4px 12px rgba(20,17,26,.08), 0 2px 4px rgba(20,17,26,.06); /* hover, dropdown */
  --shadow-3: 0 8px 24px rgba(20,17,26,.12), 0 4px 8px rgba(20,17,26,.08); /* modals, popovers */
  --ring-focus: 0 0 0 3px var(--color-focus-ring);                          /* focus ring brand-200 */
}
```

---

## 1.4 COMPOSANTS — SPÉCIFICATIONS

### Boutons — 6 variantes · 3 tailles

```
Tailles:
  sm  → height: 32px · padding: 0 12px · text: 13px
  md  → height: 40px · padding: 0 16px · text: 15px (défaut)
  lg  → height: 48px · padding: 0 20px · text: 15px

États obligatoires pour chaque variante:
  default · hover · focus · active · disabled · loading

Variantes:
  primary   → bg: brand-700 · text: white · hover: brand-800
  secondary → bg: transparent · border: brand-700 · text: brand-700 · hover: brand-50
  ghost     → bg: transparent · text: neutral-700 · hover: neutral-100
  danger    → bg: danger-700 · text: white · hover: danger-800
  link      → bg: transparent · text: brand-600 · hover: text underline
  icon-only → min 44×44px · aria-label obligatoire

Touch target minimum: 44×44px sur desktop · 48×48px sur mobile
```

### Inputs — 4 états

```
Structure obligatoire:
  1. <label htmlFor={id}> — jamais de placeholder seul comme label
  2. <input> avec aria-describedby, aria-invalid, aria-required
  3. <p id="hint"> si hint présent
  4. <p id="error" role="alert"> si erreur

États:
  default → border: neutral-200 · ring: none
  focus   → border: brand-400 · ring: 3px brand-200
  error   → border: danger-500 · ring: 3px danger-100 · error message visible
  locked  → bg: neutral-50 · cursor: not-allowed · aria-readonly

Hauteur: 44px desktop · 48px mobile
Radius: r-md (10px)
```

### Chips & Status Badges

```
7 tones — couleur + texte + (icône optionnelle) — jamais couleur seule

Statuts système:
  Validée      → success-700 sur success-100 · border success-200
  En attente   → warning-700 sur warning-100 · border warning-200
  Refusée      → danger-700  sur danger-100  · border danger-200
  En cours     → info-700    sur info-100    · border info-200
  Brouillon    → neutral-600 sur neutral-100 · border neutral-200

Pack tags:
  Gold         → #92400E sur #FEF3C7 · border #FDE68A
  Silver       → neutral-700 sur neutral-100 · border neutral-200
  Bronze       → #92400E sur #FEF9C3 · border #FDE68A (plus clair)

Accessibility chips:
  Lecteur d'écran · Mobilité réduite · Malvoyance · Surdité · Télétravail adapté
  → brand-700 sur brand-50 · border brand-200

Radius: r-sm (6px)
Padding: 4px 10px
Font: text-caption (12px/600/uppercase)
```

### Job Offer Card

```
Structure:
  1. Header: logo entreprise (40px) + titre (text-h4) + entreprise · ville · type contrat
  2. Body: description tronquée à 2 lignes
  3. Chips: tags tech + chips accessibilité
  4. Footer: date publication · nb candidats · CTA "Postuler →"

États:
  default  → shadow-1 · border neutral-200
  hover    → shadow-2 · border brand-200
  saved    → icône bookmark filled brand-500
  applied  → badge "Candidature envoyée" + disabled CTA

Radius: r-lg (14px)
Padding: 24px
La card entière est navigable au clavier (rôle article + lien principal accessible)
```

### Candidate Card (ATS view)

```
Structure:
  1. Avatar initial + nom + score matching (%) + localisation
  2. Badge statut (shortlistée, en cours, etc.)
  3. Résumé: expérience + technologie d'assistance + disponibilité
  4. Tags compétences + chip accessibilité + score soft skills
  5. CTA "Voir profil →"
```

### Data Table (admin / inspecteur)

```
Colonnes: Entreprise (avatar initiales + nom) · Pack · Offres · Conformité % · Statut · Action
Tri: colonnes cliquables avec aria-sort
Ligne hover: bg neutral-50
Statut: toujours badge (couleur + texte)
Action: lien "Voir" — toujours avec contexte (aria-label "Voir Sofrecom International")
Pagination accessible avec aria-label "Navigation pagination"
```

### Pipeline ATS

```
Colonnes (stages): Sourcing · Tests · Entretien · Offre · Recruté
Chaque colonne: titre + compteur + cards candidats empilées
Card dans pipeline: avatar + nom + score % + titre/expérience + chip handicap + statut
DnD (drag & drop): accessible via keyboard (espace pour grab, flèches pour déplacer)
```

### Subscription Packs

```
3 cards: Bronze (gratuit) · Silver (450 DT/mois) · Gold (1200 DT/mois)
Chaque card: nom pack · badge couleur · prix · liste fonctionnalités (✓/✗) · CTA
Card Gold: visuellement mise en avant (border brand-700 · shadow-2)
CTA désactivé pour le pack actif avec texte "Pack actuel"
```

### Toasts / Notifications

```
4 variantes: success · warning · danger · info
Structure: icône + titre (bold) + description
Position: top-right desktop · bottom-center mobile
Duration: 5000ms par défaut · danger = persistent jusqu'à dismiss
role="status" pour info/success · role="alert" pour warning/danger
aria-live="polite" info/success · aria-live="assertive" danger
```

---

## 1.5 ACCESSIBILITY PATTERNS (WCAG 2.2 AA — FONDAMENTAL)

### Menu accessibilité persistant

```
Accessible via Alt + A sur tous les écrans
Toujours visible en top-right
Paramètres persistants en session (localStorage + cookie)

Options:
  - Navigation clavier complète (activée par défaut)
  - Compatibilité lecteur d'écran (NVDA, VoiceOver, JAWS)
  - Synthèse vocale pour les offres (TTS toggle)
  - Navigation par commandes vocales
  - Thème haut contraste
  - Police dyslexie-friendly
  - Taille de police ajustable (15 → 22px)
  - Réduction des animations (prefers-reduced-motion)
```

### Focus visible — règle absolue

```css
/* OBLIGATOIRE sur tout élément interactif */
:focus-visible {
  outline: none;
  box-shadow: var(--ring-focus); /* 3px brand-200 */
  border-radius: var(--r-md);
}

/* INTERDIT — ne jamais écrire */
:focus { outline: none; }
*:focus { outline: none !important; }
```

### Touch targets

```
Minimum absolu: 44×44px
Mobile (≤ 640px): 48×48px
Espacement entre targets: minimum 8px
```

### Contraste minimum

```
Texte normal (< 18pt bold / < 24pt regular): 4.5:1
Texte large (≥ 18pt bold / ≥ 24pt regular): 3:1
Composants UI, icônes informatives: 3:1
Texte désactivé: exempt
```

---

# PARTIE 2 — RÈGLES FRONTEND

## 2.1 ARCHITECTURE DES DOSSIERS

```
src/
├── app/
│   ├── [locale]/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (candidate)/
│   │   │   ├── dashboard/
│   │   │   ├── jobs/
│   │   │   ├── applications/
│   │   │   └── profile/
│   │   ├── (company)/
│   │   │   ├── dashboard/
│   │   │   ├── jobs/
│   │   │   ├── applicants/
│   │   │   └── compliance/
│   │   ├── (admin)/
│   │   ├── (inspector)/
│   │   ├── (aneti)/
│   │   └── layout.tsx        ← dir="rtl/ltr" selon locale
│   └── api/
│
├── components/
│   ├── ui/                   ← Button, Input, Badge, Card, Toast...
│   ├── forms/                ← Composants formulaire avec validation
│   ├── layout/               ← Header, Sidebar, PageWrapper, AccessibilityMenu
│   ├── features/             ← JobCard, CandidatePipeline, ComplianceReport...
│   └── feedback/             ← Skeleton, EmptyState, ErrorState...
│
├── design-system/
│   ├── tokens.css            ← Source des tokens (couleurs, spacing, typo)
│   └── components.css        ← Classes composées utilitaires
│
├── hooks/                    ← useRTL, useAccessibility, useRole, useLocale
├── lib/                      ← api-client, utils, cn
├── stores/                   ← Zustand stores
├── types/                    ← Types TS partagés (api.ts, models.ts, roles.ts)
└── i18n/
    ├── locales/
    │   ├── fr.json
    │   ├── ar.json
    │   └── en.json
    └── config.ts
```

---

## 2.2 CONVENTIONS DE NOMMAGE

```
Composants:        PascalCase      → JobCard.tsx, AccessibilityMenu.tsx
Hooks:             camelCase       → useJobFilters.ts, useRTL.ts
Utils:             camelCase       → formatDate.ts, cn.ts
Types/Interfaces:  PascalCase      → JobCardProps, ApiResponse<T>
Constantes:        UPPER_SNAKE     → MAX_FILE_SIZE, DEFAULT_LOCALE
CSS classes:       kebab-case      → form-field, job-card, status-badge
Tests:             *.test.tsx      → JobCard.test.tsx
i18n keys:         dot.notation    → 'jobs.card.apply', 'status.pending'

Props interface → NomComposantProps
Handlers       → handleSubmit, handleKeyDown, handleToggle
Variantes enum → variant: 'primary' | 'secondary' | 'ghost' | 'danger' | 'link'
```

---

## 2.3 PATTERNS DE COMPOSANTS

### Template de base

```tsx
import { cn } from '@/lib/utils';
import { useTranslation } from 'next-i18next';
import type { ComponentNomProps } from '@/types/components';

export function ComponentNom({
  className,
  variant = 'default',
  ...props
}: ComponentNomProps) {
  const { t } = useTranslation('namespace');

  return (
    <element
      className={cn(
        // layout
        'flex items-center gap-3',
        // apparence
        'rounded-[10px] border border-neutral-200 bg-white',
        // typographie
        'text-[15px] leading-[23px] text-neutral-700',
        // états
        'hover:border-brand-200 hover:shadow-[var(--shadow-2)]',
        'focus-visible:outline-none focus-visible:shadow-[var(--ring-focus)]',
        // transition
        'transition-all duration-150',
        // variantes
        variant === 'active' && 'bg-brand-50 border-brand-200',
        // override externe
        className,
      )}
      {...props}
    >
      {/* contenu */}
    </element>
  );
}
```

### Pattern bouton

```tsx
<button
  type="button"
  disabled={isLoading || disabled}
  aria-disabled={isLoading || disabled}
  aria-label={iconOnly ? label : undefined}
  className={cn(
    'inline-flex items-center justify-center gap-2',
    'min-h-[44px] rounded-[10px] px-4',
    'text-[15px] font-medium leading-none',
    'focus-visible:outline-none focus-visible:shadow-[var(--ring-focus)]',
    'transition-colors duration-150',
    // Primary
    variant === 'primary' && [
      'bg-brand-700 text-white',
      'hover:bg-brand-800',
      'active:bg-brand-900',
      'disabled:opacity-50 disabled:cursor-not-allowed',
    ],
  )}
>
  {isLoading && <Spinner className="size-4" aria-hidden="true" />}
  {icon && <span aria-hidden="true">{icon}</span>}
  <span>{label}</span>
</button>
```

### Pattern input

```tsx
<div className="flex flex-col gap-1.5">
  <label htmlFor={id} className="text-[13px] font-medium leading-[20px] text-neutral-700">
    {label}
    {required && (
      <span aria-hidden="true" className="text-danger-500 ms-1">*</span>
    )}
  </label>

  <input
    id={id}
    name={name}
    required={required}
    aria-required={required}
    aria-describedby={
      error ? `${id}-error` : hint ? `${id}-hint` : undefined
    }
    aria-invalid={error ? 'true' : undefined}
    className={cn(
      'min-h-[44px] rounded-[10px] border px-3',
      'text-[15px] leading-[23px] text-neutral-900',
      'transition-shadow duration-150',
      'focus-visible:outline-none focus-visible:shadow-[var(--ring-focus)]',
      !error && 'border-neutral-200 focus-visible:border-brand-400',
      error && 'border-danger-500 focus-visible:shadow-[0_0_0_3px_var(--color-danger-100)]',
    )}
  />

  {hint && !error && (
    <p id={`${id}-hint`} className="text-[13px] leading-[20px] text-neutral-500">
      {hint}
    </p>
  )}

  {error && (
    <p
      id={`${id}-error`}
      role="alert"
      className="text-[13px] leading-[20px] text-danger-700"
    >
      {error}
    </p>
  )}
</div>
```

### Pattern états UI (obligatoire partout)

```tsx
// Toujours dans cet ordre
if (isLoading) return <ComponentSkeleton />;
if (error)     return <ErrorState onRetry={refetch} />;
if (!data?.length) return <EmptyState />;
return <ComponentList data={data} />;
```

### Pattern empty state

```tsx
<div className="flex flex-col items-center justify-center py-16 text-center">
  <div className="mb-6 text-neutral-300">
    <IconSVG className="size-20" aria-hidden="true" />
  </div>
  <h2 className="text-[22px] font-semibold leading-[29px] text-neutral-800 mb-2">
    {t('empty.title')}
  </h2>
  <p className="text-[15px] leading-[23px] text-neutral-500 mb-6 max-w-sm">
    {t('empty.description')}
  </p>
  <Button variant="primary" onClick={ctaAction}>
    {t('empty.cta')}
  </Button>
</div>
```

---

## 2.4 INTERNATIONALISATION (FR / AR / EN)

### Configuration

```ts
// i18n/config.ts
export const locales = ['fr', 'ar', 'en'] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'fr';
export const rtlLocales: Locale[] = ['ar'];
export const isRTL = (locale: Locale) => rtlLocales.includes(locale);
```

### Layout avec direction

```tsx
// app/[locale]/layout.tsx
export default function LocaleLayout({
  children,
  params: { locale }
}: { children: React.ReactNode; params: { locale: string } }) {
  return (
    <html lang={locale} dir={isRTL(locale as Locale) ? 'rtl' : 'ltr'}>
      <body className={locale === 'ar' ? 'font-arabic' : 'font-body'}>
        {children}
      </body>
    </html>
  );
}
```

### Propriétés logiques CSS — OBLIGATOIRE pour RTL

```
INTERDIT (propriétés physiques directionnelles)  →  CORRECT (propriétés logiques)
──────────────────────────────────────────────────────────────────────────────────
ml-4 / mr-4                                      →  ms-4 / me-4
pl-3 / pr-3                                      →  ps-3 / pe-3
text-left / text-right                           →  text-start / text-end
border-l-2 / border-r-2                          →  border-s-2 / border-e-2
left-0 / right-0 (dans position relative)        →  start-0 / end-0
rounded-l-lg / rounded-r-lg                      →  rounded-s-lg / rounded-e-lg
```

### Icônes directionnelles

```tsx
// Icônes flèches : toujours inverser en RTL
const { locale } = useLocale();
const isRtl = isRTL(locale);

<ChevronRight
  className={cn('size-4', isRtl && 'rotate-180')}
  aria-hidden="true"
/>
// ou utiliser directement ChevronLeft en RTL
```

### Règle zéro texte en dur

```tsx
// INTERDIT
<p>Bienvenue sur HandiTalents</p>
<button>Postuler</button>

// CORRECT
const { t } = useTranslation('common');
<p>{t('welcome.title')}</p>
<button>{t('jobs.card.apply')}</button>
```

---

## 2.5 RESPONSIVE — MOBILE FIRST

```
Breakpoints:
  xs:  375px  (iPhone SE — base)
  sm:  640px
  md:  768px  (tablette portrait)
  lg:  1024px (tablette paysage / laptop)
  xl:  1280px (desktop)
  2xl: 1440px (large desktop)

Conteneur principal:
  <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

Sidebar + contenu:
  <div className="flex flex-col lg:flex-row gap-6">
    <aside className="w-full lg:w-72 xl:w-80 shrink-0">
    <section className="flex-1 min-w-0">

Navigation mobile:
  - Bottom nav bar sur mobile (≤ 640px) pour les 4-5 actions principales
  - Menu hamburger avec aria-expanded + aria-controls
  - Pas d'interactions hover-only sur mobile
```

---

## 2.6 GESTION DES RÔLES

```
Rôles: admin | company | candidate | inspector | aneti

Route groups: app/[locale]/(role)/...
Vérification permissions: côté serveur dans Server Components / middleware
Affichage conditionnel: hook useRole() — pas de logique inline dans les composants
Accès refusé: page 403 dédiée par rôle avec message contextualisé
```

---

## 2.7 APPELS API (REST)

```typescript
// Ne jamais appeler fetch() directement dans un composant client
// Utiliser le client centralisé lib/api-client.ts

// Pattern uniforme pour tous les composants
const { data, isLoading, error, refetch } = useQuery(...)

if (isLoading) return <PageSkeleton />;
if (error)     return <ErrorState onRetry={refetch} />;
if (!data)     return <EmptyState />;
return <Content data={data} />;

// Optimistic updates pour les actions rapides (bookmark, toggle, status)
// Rollback automatique si erreur API
```

---

## 2.8 PERFORMANCE

```tsx
// Images: toujours next/image
import Image from 'next/image';
<Image src="..." alt="..." width={64} height={64} priority={isAboveFold} />

// Fonts: next/font/google — une fois à la racine
// Code splitting: dynamic() pour composants lourds/rarement visités
const ReportEditor = dynamic(() => import('@/components/features/ReportEditor'), {
  loading: () => <EditorSkeleton />,
  ssr: false,
});

// Pas de useEffect pour data fetching → Server Components ou TanStack Query
// Memo/useCallback uniquement si re-render mesuré comme problème
```

---

# PARTIE 3 — INSTRUCTIONS AGENT (Claude Code / Codex)

## RÈGLES NON NÉGOCIABLES — JAMAIS VIOLER

### Accessibilité

```
1. focus-visible OBLIGATOIRE sur tout élément interactif
   INTERDIT: :focus { outline: none } sans box-shadow de remplacement

2. Chaque <input> a un <label htmlFor={id}> lié
   INTERDIT: placeholder seul comme label

3. Icônes seules → aria-label sur le parent + aria-hidden="true" sur l'icône
   Si l'icône accompagne du texte → aria-hidden="true" seulement

4. Erreurs de formulaire → role="alert" ou aria-live="polite"

5. Modales → focus trap + Escape ferme + focus retourne au déclencheur

6. Touch target: min 44×44px desktop, 48×48px mobile

7. Contraste: 4.5:1 texte normal, 3:1 texte large/icônes — vérifier avec contrast.tools

8. Statuts/informations → jamais par couleur seule (badge = couleur + texte + icône optionnelle)
```

### RTL / i18n

```
1. Propriétés LOGIQUES CSS obligatoires
   INTERDIT: ml-* mr-* pl-* pr-* text-left text-right border-l-* border-r-*
   CORRECT:  ms-* me-* ps-* pe-* text-start text-end border-s-* border-e-*

2. Icônes directionnelles: rotate-180 en locale 'ar'

3. Zéro texte en dur dans JSX
   INTERDIT: <p>Bienvenue</p>
   CORRECT:  <p>{t('welcome')}</p>

4. dir="rtl" sur <html> via layout.tsx pour locale 'ar'
```

### TypeScript

```
1. Mode strict — zéro any sans commentaire justificatif
2. Zéro @ts-ignore sans explication sur la ligne précédente
3. Props: NomComposantProps
4. Types API dans types/api.ts
```

### Styles

```
1. Zéro style inline sauf animation dynamique JS (justifier)
2. Zéro couleur/taille hardcodée → tokens CSS
3. Toujours cn() pour classes conditionnelles
4. Couleurs: var(--color-brand-700), var(--color-neutral-500)...
   Pas de: text-[#35063E] ou bg-[#6B6478]
```

### Images

```
1. Toujours next/image — jamais <img> sauf SVG inline
2. alt obligatoire — "" si décoratif, descriptif si informatif
3. priority={true} pour les images LCP (above the fold)
```

## TOKENS À UTILISER DANS LE CODE

```
Background:  bg-[var(--color-bg)] | bg-[var(--color-surface-subtle)]
Border:      border-[var(--color-border)] | border-[var(--color-border-strong)]
Text:        text-[var(--color-text-primary)] | text-[var(--color-text-muted)]
Brand:       bg-[var(--color-brand-700)] | text-[var(--color-brand-700)]
Success:     bg-[var(--color-success-100)] | text-[var(--color-success-700)]
Warning:     bg-[var(--color-warning-100)] | text-[var(--color-warning-700)]
Danger:      bg-[var(--color-danger-100)] | text-[var(--color-danger-700)]
Info:        bg-[var(--color-info-100)] | text-[var(--color-info-700)]
Focus:       focus-visible:shadow-[var(--ring-focus)]
Shadow:      shadow-[var(--shadow-1)] | shadow-[var(--shadow-2)]
```

## CE QU'IL NE FAUT JAMAIS FAIRE

```
❌ outline: none sans box-shadow de remplacement
❌ <img> sans alt (sauf SVG inline)
❌ placeholder seul comme label de champ
❌ ml-*, mr-*, pl-*, pr-*, text-left, text-right dans composants génériques
❌ style={{ color: '#35063E' }} — utiliser var(--color-brand-700)
❌ Texte en dur dans JSX — tout passer par t()
❌ any TypeScript sans commentaire
❌ tabIndex positif (> 0)
❌ fetch() directement dans un composant client
❌ <img> pour les images de contenu — utiliser next/image
❌ Spinner pour chargement de liste — utiliser Skeleton
❌ Toast seul pour action critique — utiliser page de confirmation
❌ Gradients violet/bleu génériques
❌ Couleurs hardcodées (#35063E, #6B6478...)
❌ Informations véhiculées par couleur seule
```

---

# CHECKLIST PR FRONTEND

```
FONCTIONNEL
  □ Mobile (375px+) et desktop (1280px+) testés
  □ RTL testé si composant directionnel
  □ 4 états implémentés: loading · empty · error · success

ACCESSIBILITÉ
  □ Navigation clavier complète (Tab, Shift+Tab, Enter, Escape, flèches si applicable)
  □ focus-visible visible sur tous les éléments interactifs
  □ Tous les inputs ont un <label> lié avec htmlFor
  □ Images: alt défini (vide si décoratif)
  □ Icônes seules: aria-label sur le parent
  □ Erreurs formulaire: role="alert"
  □ Contraste vérifié (contrast.tools)
  □ Touch targets ≥ 44×44px

CODE
  □ TypeScript compile: npx tsc --noEmit
  □ Zéro style inline (sauf justifié)
  □ Zéro valeur hardcodée (couleur, taille, texte)
  □ Zéro texte en dur (tout traduit)
  □ Zéro any TypeScript sans commentaire
  □ cn() utilisé pour classes conditionnelles
  □ Propriétés logiques CSS (ms-*, ps-*, text-start...)

PERFORMANCE
  □ next/image pour toutes les images
  □ Composants lourds lazy-loaded si non critiques
```

---

*HandiTalents Design System v0.1 — Orange Developer Center*
*Nour Raach & Abir Annabi — Superviseur: Houssem Bouraoui*
*Mai 2026 — Stack: Next.js 16 · React 19 · Tailwind CSS v4 · TypeScript strict*
