---
name: Fizcal Funhouse
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e4e2e1'
  on-surface: '#1b1c1c'
  on-surface-variant: '#4d4732'
  inverse-surface: '#303030'
  inverse-on-surface: '#f3f0f0'
  outline: '#7e775f'
  outline-variant: '#d0c6ab'
  surface-tint: '#705d00'
  primary: '#705d00'
  on-primary: '#ffffff'
  primary-container: '#ffd700'
  on-primary-container: '#705e00'
  inverse-primary: '#e9c400'
  secondary: '#8d00d9'
  on-secondary: '#ffffff'
  secondary-container: '#aa30fa'
  on-secondary-container: '#fffbff'
  tertiary: '#b12d00'
  on-tertiary: '#ffffff'
  tertiary-container: '#ffcfc2'
  on-tertiary-container: '#b22e00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffe16d'
  primary-fixed-dim: '#e9c400'
  on-primary-fixed: '#221b00'
  on-primary-fixed-variant: '#544600'
  secondary-fixed: '#f3daff'
  secondary-fixed-dim: '#e3b5ff'
  on-secondary-fixed: '#2f004c'
  on-secondary-fixed-variant: '#6e00ab'
  tertiary-fixed: '#ffdbd1'
  tertiary-fixed-dim: '#ffb5a0'
  on-tertiary-fixed: '#3b0900'
  on-tertiary-fixed-variant: '#872000'
  background: '#fcf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e1'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  body-lg:
    fontFamily: Quicksand
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 28px
  body-md:
    fontFamily: Quicksand
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  base: 8px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: 40px
  container-max: 1200px
---

## Brand & Style
The design system transforms traditional fiscal management into a high-energy, playful experience. Targeting a younger demographic or those intimidated by "serious" finance, the UI evokes an emotional response of joy, accessibility, and optimism. 

The aesthetic is a hybrid of **High-Contrast Bold** and **Tactile "Squishy"** design. It borrows from the "Neo-Brutalism" movement—using heavy strokes and vibrant colors—but softens the edges to create a "bouncy" atmosphere. The interface should feel like a collection of stickers and physical buttons that are satisfying to press. The tone is unapologetically informal, utilizing puns and emojis to celebrate financial milestones (e.g., "Holy Guacamole! You saved $50! 🥑").

## Colors
The palette is built on high-vibrancy "Comic-Book" primaries. 
- **Primary (Electric Gold):** Used for main actions and focus areas to draw the eye with sunshine energy.
- **Secondary (Electric Purple):** Used for accents, interactive states, and branding elements to provide a royal yet funky contrast.
- **Tertiary (Action Red):** Reserved for urgent alerts, "Spend" categories, or "Hot" streaks.
- **Neutral:** A deep charcoal instead of pure black is used for heavy borders and text to maintain readability without being "sterile."
- **Backgrounds:** Use extremely soft tints of the primary colors (e.g., #FFFBE6) to keep the "vibe" high without straining the eyes.

## Typography
Since specific "Comic" fonts aren't in the library, this design system uses **Plus Jakarta Sans** for headlines to achieve a soft, contemporary roundness with a bold "pop." **Quicksand** is the primary body font, chosen for its distinctively rounded terminals that reinforce the "bubbly" brand personality. **Space Grotesk** is used sparingly for labels and data points to provide a slight "tech-quirk" contrast that keeps the fiscal data feeling accurate despite the playfulness. Headlines should always use tight tracking to feel dense and impactful.

## Layout & Spacing
The layout follows a **Fluid Grid** model with exaggerated padding to give elements "room to breathe"—or rather, "room to bounce." 

- **The Bounce Factor:** Use generous inner padding (24px+) in cards to avoid a cramped feeling.
- **Asymmetry:** Occasionally offset cards by 2-4 pixels to create a "sticker" look where not everything is perfectly aligned to the pixel grid.
- **Breakpoints:** On mobile, margins stay wide (20px) to ensure the bubbly UI elements don't feel like they are "popping" off the screen edge.

## Elevation & Depth
This system eschews traditional soft shadows for **Hard-Edge Tactility**. 
- **The "Sticker" Depth:** Surfaces use a 4px to 8px solid black (or deep purple) offset border to create a 2D "pop-out" effect. 
- **Shadows:** Instead of blurs, use "Block Shadows"—solid color blocks offset to the bottom-right of a container.
- **Micro-interactions:** When an element is pressed, it should translate (move) 2px or 4px down and to the right, effectively "hiding" the block shadow to simulate a physical button being pushed into the page.

## Shapes
Maximum roundness is mandatory. This design system uses the **Pill-shaped** setting (3) for almost everything. 
- **Buttons and Inputs:** Should always have fully rounded ends (pill-shaped).
- **Cards:** Use a minimum of 24px (rounded-xl) for corners.
- **Doodles:** Incorporate "blob" shapes in the background—organic, non-geometric circles and waves that sit behind the main content containers to break up the linear nature of fiscal charts.

## Components
- **Buttons:** Large, pill-shaped, and bouncy. Primary buttons use the Electric Gold (#FFD700) with a 2px solid border. Upon hover, they should scale up slightly (1.05x).
- **Cards:** "Sticker-style" containers with thick 3px borders and a solid color block shadow. Use bright white backgrounds for the content area to keep text legible.
- **Chips/Badges:** Use these for transaction categories. Each chip should have a "doodle" icon or emoji (e.g., a tiny slice of pizza for "Dining").
- **Input Fields:** Thick borders and rounded ends. The focus state should change the border color to Electric Purple and "pop" the label slightly larger.
- **Progress Bars:** Use thick, rounded tracks. The progress fill should be a bright gradient or a repeating pattern (like diagonal stripes) to feel energetic.
- **Empty States:** Instead of "No Data," use "Ruh-roh! No coins in the jar yet! 🍯" with a large, hand-drawn style illustration.