# Sumly Design System (Stitch/Material 3 Standard)

## 1. Core Principles
- **Material Design 3 (Material You):** Utilizing dynamic color tokens, rounded geometries, and tonal elevations.
- **Glassmorphism & Depth:** Using blurred surfaces for floating elements (like the Audit List) to establish visual hierarchy without heavy drop shadows.
- **Micro-interactions:** Every tap must have a fast, fluid visual response (scale down and brightness shift).

## 2. Color Palette (Dark Theme Optimized)
We use a deep, OLED-friendly dark background with highly legible surface variations and vibrant accents.

| Token | Value (Hex) | Purpose |
|-------|------------|---------|
| `--md-sys-color-background` | `#0B0C10` | App background, deepest level. |
| `--md-sys-color-surface` | `#15171E` | Standard card background. |
| `--md-sys-color-surface-variant` | `#1F222B` | Interactive surfaces (keys, dashboard cards). |
| `--md-sys-color-primary` | `#93C5FD` | Primary brand color (soft blue). |
| `--md-sys-color-primary-container` | `#1E3A8A` | High emphasis containers (Operator keys). |
| `--md-sys-color-on-primary-container` | `#DBEAFE` | Text/Icons inside primary containers. |
| `--md-sys-color-secondary` | `#10B981` | Action color (The `=` button, Totals). |
| `--md-sys-color-secondary-container` | `#065F46` | Secondary emphasis. |
| `--md-sys-color-on-secondary-container` | `#A7F3D0` | Text/Icons inside secondary containers. |
| `--md-sys-color-error` | `#FCA5A5` | Destructive actions (Backspace, Clear). |

## 3. Typography
- **Font Family:** `Inter`, fallback to system sans-serif. Highly legible at small sizes, elegant at large sizes.
- **Headings:** Bold (600/700), tight tracking.
- **Numbers (Amount Display):** Monospaced or highly uniform tabular numbers, ultra-light weight (300) for large displays.

## 4. Component Standards

### A. The Calculator Keypad
- **Shape:** Stadium or full-rounded pills (`border-radius: 999px`).
- **Touch Target:** Minimum 64x64px equivalent.
- **Active State:** Instant scale to 0.92, ripple or brightness change.

### B. The Audit List (Memory Area)
- **Visual Style:** Floating "Glass" card. Semi-transparent surface with background blur.
- **Itemization:** Clear alignment. Operators on the left (colored), label in the center (dimmed), amount on the right (bright).

### C. Inputs
- **Label Input:** Borderless by default, showing only a 2px primary-colored bottom border when focused. No background.
