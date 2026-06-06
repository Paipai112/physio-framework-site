# Physio Framework — Dark Premium Design System

> **Project:** 生理信号处理框架知识库
> **Theme:** OLED Dark + Exaggerated Minimalism + Bento Grid
> **Generated:** 2026-06-06

---

## Global Rules

### Color Palette — Dark Premium

#### Semantic Colors

| Role | Hex | Tailwind | Usage |
|------|-----|----------|-------|
| Background (Deepest) | `#000000` | `black` | Root bg, hero sections |
| Background (Base) | `#0A0A0A` | `neutral-950` | Page bg |
| Surface | `#121212` | `zinc-900` | Cards, panels |
| Surface Elevated | `#1A1A1A` | `neutral-900` | Hover states, elevated cards |
| Surface Highlight | `#242424` | `zinc-800` | Active states, borders |
| Border Subtle | `#1F1F1F` | — | Card borders |
| Border Default | `#2A2A2A` | `zinc-800` | Section dividers |
| Text Primary | `#FAFAFA` | `zinc-50` | Headings, body |
| Text Secondary | `#A3A3A3` | `zinc-400` | Descriptions, meta |
| Text Muted | `#737373` | `zinc-500` | Captions, footnotes |

#### Layer Accent Colors (Refined for Dark)

| Layer | Hex | Name | Usage |
|-------|-----|------|-------|
| L1 传感器层 | `#FF5757` | Crimson | Badges, icons, highlights |
| L2 基础指标层 | `#FFB347` | Amber Gold | Badges, icons, highlights |
| L3 融合指标层 | `#4ADE80` | Emerald | Badges, icons, highlights |
| L4 高级指标层 | `#60A5FA` | Sapphire | Badges, icons, highlights |
| L5 AI教练层 | `#C084FC` | Amethyst | Badges, icons, highlights |

#### Glow Accents (for hover/active effects)

| Layer | Glow Color |
|-------|------------|
| L1 | `rgba(255, 87, 87, 0.15)` |
| L2 | `rgba(255, 179, 71, 0.15)` |
| L3 | `rgba(74, 222, 128, 0.15)` |
| L4 | `rgba(96, 165, 250, 0.15)` |
| L5 | `rgba(192, 132, 252, 0.15)` |

---

### Typography

- **Heading Font:** Space Grotesk (geometric, distinctive, modern tech)
- **Body Font:** DM Sans (excellent readability on dark backgrounds)
- **Mono Font:** JetBrains Mono (code, data, IDs)
- **CJK Fallback:** Noto Sans SC (Chinese text)

**Google Fonts CSS:**
```css
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Noto+Sans+SC:wght@400;500;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
```

**Tailwind Config:**
```js
fontFamily: {
  heading: ['Space Grotesk', 'Noto Sans SC', 'sans-serif'],
  body: ['DM Sans', 'Noto Sans SC', 'sans-serif'],
  mono: ['JetBrains Mono', 'monospace'],
}
```

**Type Scale:**
| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `text-hero` | `clamp(3rem, 8vw, 6rem)` | 1.0 | 700 | Hero headlines |
| `text-display` | `clamp(2rem, 5vw, 3.5rem)` | 1.1 | 600 | Section titles |
| `text-heading-1` | `2rem / 32px` | 1.2 | 600 | Page titles |
| `text-heading-2` | `1.5rem / 24px` | 1.3 | 600 | Card titles |
| `text-heading-3` | `1.25rem / 20px` | 1.4 | 500 | Subheadings |
| `text-body` | `1rem / 16px` | 1.75 | 400 | Body text |
| `text-body-sm` | `0.875rem / 14px` | 1.6 | 400 | Secondary text |
| `text-caption` | `0.75rem / 12px` | 1.5 | 400 | Captions, meta |

---

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | `4px` | Tight inline gaps |
| `space-2` | `8px` | Icon gaps, chip padding |
| `space-3` | `12px` | Compact padding |
| `space-4` | `16px` | Standard padding |
| `space-6` | `24px` | Card padding |
| `space-8` | `32px` | Section gaps |
| `space-12` | `48px` | Large section gaps |
| `space-16` | `64px` | Hero spacing |
| `space-24` | `96px` | Page section dividers |

---

### Effects & Animation

#### Shadows (Dark Mode)
| Level | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.3)` | Subtle lift |
| `shadow-md` | `0 4px 12px rgba(0,0,0,0.4)` | Cards |
| `shadow-lg` | `0 8px 30px rgba(0,0,0,0.5)` | Modals, featured |
| `shadow-glow` | `0 0 20px var(--glow-color)` | Hover accent glow |

#### Transitions
| Element | Duration | Easing | Property |
|---------|----------|--------|----------|
| Hover states | 200ms | `ease-out` | `background, color, border-color` |
| Card lift | 300ms | `ease-out` | `transform, box-shadow` |
| Modal/Dialog | 250ms | `ease-out` | `opacity, transform` |
| Page transitions | 300ms | `ease-in-out` | `opacity` |

#### Glass Cards
```css
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(12px);
  border-radius: 16px;
}
.glass-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}
```

---

## Page Patterns

### Homepage — Bento Grid Showcase
```
1. Hero (vertical, centered)
   - Oversized heading with gradient text
   - Subtitle with max-w-prose
   - Layer stat strip
2. Bento Grid (5-layer architecture)
   - Asymmetric bento layout
   - Each cell: layer color accent, module count, key modules
3. Stats Bar
   - 98 modules, 84 references, 43 glossary terms
4. Footer
```

### Content Pages — Clean Reading Layout
```
1. Breadcrumb nav (subtle, top)
2. Page header (title + metadata)
3. Content body (max-w-3xl, centered)
4. Prev/Next navigation (bottom)
```

---

## Anti-Patterns

- No emojis as icons — use SVG (Lucide/Heroicons)
- No pure #FFF text on #000 bg — use #FAFAFA for readability
- No scale transforms on hover that shift layout
- No borders lighter than #1F1F1F on dark bg
- No instant state changes without transitions
- No missing cursor-pointer on interactive elements
- No hardcoded colors — use Tailwind tokens or CSS variables
- No `<img>` without alt text

---

## Pre-Delivery Checklist

- [ ] All icons from Lucide (consistent 24x24, stroke-width 2)
- [ ] cursor-pointer on all clickable elements
- [ ] Hover states with 200ms ease-out transition
- [ ] Dark text contrast ≥ 4.5:1 against #0A0A0A
- [ ] Visible focus rings (2px, accent color, offset 2px)
- [ ] prefers-reduced-motion: disable all animations
- [ ] Responsive at 375px, 768px, 1024px, 1440px
- [ ] No emoji icons anywhere
- [ ] No horizontal scroll on mobile
- [ ] All images have alt text
