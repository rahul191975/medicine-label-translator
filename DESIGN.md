# Design Brief

## Purpose & Context
Fast, accessible medicine label translator for low-literacy, rural, underserved populations. Removes friction from understanding critical medical information.

## Tone & Aesthetic
Clinical yet warm. Medical-grade clarity without corporate coldness. Healthcare institution tone: protective, human, trustworthy.

## Color Palette

| Token           | Light Mode         | Dark Mode          | Usage                                |
|-----------------|--------------------|--------------------|--------------------------------------|
| Primary         | Teal (0.56 193)    | Cyan (0.65 193)    | Actions, CTAs, focus states          |
| Blue            | Sky blue           | Soft blue          | Medication name cards                |
| Green           | Emerald            | Soft green         | Purpose/curative information         |
| Teal            | Cyan               | Cyan               | Dosage/technical info                |
| Amber           | Warm amber         | Soft amber         | Warnings, caution alerts             |
| Rose            | Light coral        | Soft rose          | Side effects                         |
| Red             | Bold red (0.58 27) | Bold red (0.65 27) | Emergency alerts only                |
| Gray            | Warm gray          | Soft gray          | Storage, neutral info                |
| Neutral         | Warm white (0.975) | Dark slate (0.135) | Backgrounds, surfaces                |

## Typography

| Type     | Font        | Usage                                 | Size |
|----------|-------------|---------------------------------------|------|
| Display  | Figtree     | Headings, card titles                 | 22px+|
| Body     | Inter       | Body text, labels, descriptions       | 18px |
| Mono     | GeistMono   | Data, reference numbers, dosages      | 14px |

## Structural Zones

| Zone              | Light Background    | Dark Background     | Treatment                      |
|-------------------|---------------------|---------------------|--------------------------------|
| Header/Title      | Card (1.0 240)      | Card (0.18 240)     | Subtle shadow, padding 1.5rem  |
| Input Buttons     | Primary accent      | Primary accent      | 44px+ tap targets              |
| Content Cards     | Card with color bar | Card with color bar | Left border 4px, color-coded   |
| Emergency Banner  | Red-100             | Red-900/30          | Floating, bold red border      |
| Footer/Help       | Muted (0.88 240)    | Muted (0.22 240)    | Border-top, reduced emphasis   |

## Component Patterns
- **Cards:** 12px border-radius, subtle shadow on light mode, no shadow on dark
- **Buttons:** Primary teal, 44px min-height, rounded, accessible focus ring
- **Inputs:** 18px font, 44px min-height, high-contrast borders
- **Emergency alerts:** Red banner, bold text, icon + message
- **Color-coded sections:** 4px left border, matching background tint (blue/green/teal/amber/rose/gray)

## Motion & Interaction
Minimal motion: transitions 0.3s cubic-bezier for interactive states only. No entrance animations. Focus states visible (2px ring).

## Accessibility Standards
- WCAG AA high-contrast (L diff ≥0.7, foreground-on-bg)
- Large fonts: body 18px+, headings 22px+
- Touch targets: 44px+ (buttons, inputs)
- Color not sole differentiator (text + icon labels)
- Focus visible on all interactive elements

## Differentiation
Color-coded content sections guide information hierarchy without cognitive overload. Emergency alerts only trigger for genuinely dangerous terms. Warm, accessible palette breaks from cold medical UI stereotypes.

## Performance Notes
- No decorative animations or gradients
- Minimal CSS custom properties (24 colors total)
- Font-display: swap for web fonts
- Single-column mobile, 2-column desktop
- Lazy-load voice module on demand

## Signature Detail
Left-border color bars on content cards: visual pattern that communicates content type without requiring literacy. Medication = blue, Purpose = green, Dosage = teal, Warnings = amber, Side Effects = rose, Storage = gray.
