# Design System

**Direction:** "Premium Editorial Minimalism" — Gen-Z energy, magazine feel.

**Client quote:** "The moment you see my face, it feels creamy, looks creamy... not too much noise... not too loud... not screaming at you."

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-cream` | `#f5f2ec` | Page background (warm parchment, not white) |
| `--color-cream-mid` | `#ede9e0` | Alternating section backgrounds (shop) |
| `--color-cream-dark` | `#ddd9d0` | Hairline borders, dividers |
| `--color-ink` | `#1a1a18` | Primary text, dark sections, primary buttons |
| `--color-ink-mid` | `#3a3a36` | — |
| `--color-ink-light` | `#6b6860` | Secondary text, body copy |
| `--color-ink-xlight` | `#9a9890` | Labels, hints, eyebrow text |
| `--color-green` | `#5a8a2a` | Accent — headings `<em>`, cursor hover |
| `--color-green-dark` | `#3e6018` | Primary button hover |
| `--color-green-light` | `#8fc45a` | Accent on dark sections |
| `--color-green-pale` | `#eef5e6` | Pillar card hover wash |

### Rules

- Green is **never** used as a background color (except `--color-green-pale` rising wash on pillar hover)
- Green only appears on: `<em>` italic text, cursor hover, link hover, CTA hover
- Dark sections use `--color-ink` as background with `#f0ede6` cream text
- No pure black (`#000`) or pure white (`#fff`) anywhere

## Typography

### Fonts

| Font | Weights | Usage |
|------|---------|-------|
| **Cormorant Garamond** | 300, 400, 500 (+ italic) | All headings, quotes, stats, footer brand |
| **DM Sans** | 300, 400, 500 (+ italic) | Body, nav, buttons, labels, UI |

### Loaded via Google Fonts

```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap" rel="stylesheet" />
```

### Scale

| Element | Font | Size | Weight | Tracking |
|---------|------|------|--------|----------|
| Hero headline | Cormorant | `clamp(52px, 7vw, 96px)` | 300 | -0.02em |
| Section heading | Cormorant | `clamp(32px, 4vw, 52px)` | 300 | -0.02em |
| Pillar name | Cormorant | `clamp(28px, 3vw, 40px)` | 300 | -0.01em |
| Editorial quote | Cormorant | `clamp(36px, 5.5vw, 72px)` | 300 | -0.02em |
| About heading | Cormorant | `clamp(36px, 4.5vw, 60px)` | 300 | -0.02em |
| Stat number | Cormorant | 48px | 300 | -0.03em |
| Shop card name | Cormorant | 22px | 300 | -0.01em |
| Footer brand | Cormorant | `clamp(40px, 5vw, 64px)` | 300 | -0.02em |
| Body text | DM Sans | 15px | 300 | — |
| Labels/eyebrow | DM Sans | 10-11px | 400 | 0.08-0.14em |
| Nav links | DM Sans | 11px | 400 | 0.1em |
| Buttons | DM Sans | 11px | 500 | 0.08em |
| Descriptions | DM Sans | 12-13px | 300 | — |

### Emphasis Pattern

`<em>` tags in headings are always:
- `font-style: italic`
- `color: var(--color-green)` (or `--color-green-light` on dark backgrounds)

## Spacing

### Horizontal Gutters

```css
padding: 0 clamp(24px, 5vw, 80px);
```

This single value is used everywhere — nav, hero, pillars, sections, footer. Never hardcode a fixed gutter.

### Vertical Section Padding

| Section | Padding |
|---------|---------|
| Hero | `min-height: 100svh`, `padding-top: 72px` (nav height), `padding-bottom: 80px` |
| Pillars | `56px` top and bottom per card |
| Editorial (dark) | `120px` top and bottom |
| Work strip | `100px 0 80px` |
| Shop teaser | `100px` top and bottom |
| About strip | `100px` top and bottom |
| Footer | `72px` top, `40px` bottom |

### Internal Spacing

| Pattern | Value |
|---------|-------|
| Card gaps | 8px (hero grid), 12px (work strip), 16px (shop grid) |
| Label to heading | 24px |
| Heading to body | 16-28px |
| Body to CTA | 32-44px |
| Nav height | 72px |
| Section header margin-bottom | 48px |

## Borders

Always `0.5px solid var(--color-cream-dark)`. Never 1px. This gives the hairline editorial look.

## Buttons

### Primary (`.btn-primary`)

```css
background: var(--color-ink);
color: var(--color-cream);
padding: 14px 32px;
font-size: 11px;
font-weight: 500;
letter-spacing: 0.08em;
text-transform: uppercase;
border-radius: 2px;
```

Hover: `background: var(--color-green-dark)`, slight `translateY(-1px)`.

### Ghost (`.btn-ghost`)

```css
border: 0.5px solid var(--color-cream-dark);
color: var(--color-ink-light);
/* same padding, size, weight as primary */
```

Hover: border and text darken to ink.

## Animation

### Easing

```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
```

Used on everything — transitions, animations, scroll reveals.

### Scroll Reveal

Add `reveal` class to any element. Uses `IntersectionObserver` with `threshold: 0.12`.

```css
.reveal { opacity: 0; transform: translateY(32px); transition: 0.8s; }
.reveal.visible { opacity: 1; transform: translateY(0); }
```

Stagger siblings: `reveal-delay-1` (+100ms), `reveal-delay-2` (+200ms), `reveal-delay-3` (+300ms).

### Hero Cascade

Elements fade up in sequence: nav (0.1s) → eyebrow (0.3s) → headline (0.45s) → subtext (0.6s) → buttons (0.75s) → scroll hint (1.1s) → photo grid (0.5s fade in).

### Hover Effects

| Element | Effect |
|---------|--------|
| Pillar cards | Green wash rises from bottom (`scaleY(0→1)`) |
| Work items | Inner image scales 1.03, gradient overlay fades in |
| Shop cards | Card lifts `-4px`, image scales 1.04 |
| Nav links | Green underline draws left-to-right |
| Arrow links | Gap increases, arrow translates right |

## Custom Cursor

10px ink dot, `mix-blend-mode: multiply`. Expands to 48px green circle on interactive elements (links, buttons, cards). Hidden on mobile (< 900px).

## Grain Overlay

SVG fractal noise at 2.5% opacity, fixed position, covers entire viewport. Adds subtle texture without noise.

## Mobile Nav

Circle clip-path animation. Origin point calculated as:
```css
calc(100% - clamp(24px, 5vw, 80px) - 17px) 36px
```
This centers the animation on the hamburger button at any viewport width.

## Responsive Breakpoints

| Breakpoint | Changes |
|-----------|---------|
| ≤ 900px | Hero single column, pillars stack, nav links hidden → hamburger, cursor hidden, about section stacks |
| ≤ 600px | Hero photo grid hidden, shop grid single column, footer stacks |

## CSS Architecture

All styles in one file: `apps/web/src/index.css`. Uses Tailwind v4's `@theme {}` block for custom properties, but components reference **CSS class names** (not Tailwind utilities) for all design-critical styles. This preserves exact 1:1 fidelity with the original design.
