---
name: Prakriti
colors:
  surface: '#fff8ef'
  surface-dim: '#e0d9cb'
  surface-bright: '#fff8ef'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fbf3e4'
  surface-container: '#f5edde'
  surface-container-high: '#efe7d9'
  surface-container-highest: '#e9e2d3'
  on-surface: '#1e1b13'
  on-surface-variant: '#45483f'
  inverse-surface: '#343027'
  inverse-on-surface: '#f8f0e1'
  outline: '#75786e'
  outline-variant: '#c5c8bc'
  surface-tint: '#546345'
  primary: '#536143'
  on-primary: '#ffffff'
  primary-container: '#6b7a5a'
  on-primary-container: '#fcfff1'
  inverse-primary: '#bccca7'
  secondary: '#855324'
  on-secondary: '#ffffff'
  secondary-container: '#febb84'
  on-secondary-container: '#79491b'
  tertiary: '#506148'
  on-tertiary: '#ffffff'
  tertiary-container: '#697a5f'
  on-tertiary-container: '#fbfff2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e8c2'
  primary-fixed-dim: '#bccca7'
  on-primary-fixed: '#131f07'
  on-primary-fixed-variant: '#3d4b2f'
  secondary-fixed: '#ffdcc2'
  secondary-fixed-dim: '#fbb981'
  on-secondary-fixed: '#2e1500'
  on-secondary-fixed-variant: '#693c0f'
  tertiary-fixed: '#d5e8c8'
  tertiary-fixed-dim: '#b9ccad'
  on-tertiary-fixed: '#111f0b'
  on-tertiary-fixed-variant: '#3b4b33'
  background: '#fff8ef'
  on-background: '#1e1b13'
  surface-variant: '#e9e2d3'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '600'
    lineHeight: 72px
    letterSpacing: -0.02em
  display-md:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '500'
    lineHeight: 56px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  section-gap: 120px
---

## Brand & Style

The design system is rooted in the philosophy of "Essential Nature"—merging premium herbal skincare with high-end editorial aesthetics. The brand personality is serene, grounded, and sophisticated, targeting a conscious audience that values both botanical efficacy and minimalist luxury.

The visual style is a blend of **Minimalism** and **Modern Organic**. It prioritizes heavy whitespace to allow high-quality botanical photography to breathe, creating a sense of calm and clarity. UI elements are understated, relying on precise typography and a natural color palette rather than decorative ornamentation to convey value.

## Colors

The palette is derived from raw earth and botanical life.
- **Primary (Sage Green):** Used for main actions and brand identifiers. It represents the herbal core of the product.
- **Secondary (Terracotta):** Used for highlighting natural ingredients, active states, or CTAs that require a warm, human touch.
- **Background (Cream):** A warm, non-white base that feels like recycled paper or soft linen, reducing eye strain and adding warmth.
- **Accent/Text (Forest Green):** The primary color for typography and deep borders, ensuring high legibility and a sense of luxury.
- **Neutral (Taupe):** Used for subtle dividers, secondary containers, and low-priority backgrounds.

## Typography

The typographic hierarchy establishes a rhythm between "Organic Elegance" and "Scientific Clarity."
- **Headlines:** Use **Playfair Display**. Its high contrast and delicate serifs evoke a boutique, editorial feel. Use the semi-bold weight sparingly for impact.
- **Body & Interface:** Use **Inter**. This provides a neutral, highly legible counterpoint to the serif headings. 
- **Labels:** All-caps treatments with slight tracking (0.05em) should be used for categories, price tags, and small navigation items to maintain a sophisticated architectural feel.

## Layout & Spacing

This design system utilizes a **Fixed Grid** model for desktop to ensure the minimalist composition remains balanced on wide displays.
- **Grid:** A 12-column grid with a maximum width of 1280px.
- **Rhythm:** An 8px linear scale is used for all internal component spacing (padding/margins).
- **Whitespace:** Emphasize vertical "breathing room" between sections (120px+) to mirror the sparse, premium layout of a high-end magazine.
- **Alignment:** Content should predominantly be center-aligned or use asymmetrical offsets to create visual interest in product galleries.

## Elevation & Depth

Depth is handled with extreme subtlety to avoid breaking the "flat-lay" aesthetic.
- **Tonal Layers:** Primary depth is achieved through color shifts—placing #D6CFC1 (Taupe) cards on #F5F1E8 (Cream) backgrounds.
- **Ambient Shadows:** When used, shadows must be ultra-diffused. Use a 15% opacity Forest Green (#3A4A32) tint for the shadow instead of pure black to maintain the earthy warmth.
- **Interaction:** Hover states should involve a slight "lift" (5px shadow expansion) or a soft color transition rather than aggressive scaling.

## Shapes

The shape language is **Rounded**, reflecting the soft edges of river stones and organic leaves.
- **Standard UI:** 0.5rem (8px) for buttons, input fields, and small cards.
- **Large Containers:** 1rem (16px) for hero sections and modal overlays.
- **Media:** Product imagery should either be perfectly sharp (for an editorial look) or use the `rounded-xl` token (1.5rem) to feel more approachable and soft.

## Components

- **Buttons:** Primary buttons use the Sage Green background with white text. Secondary buttons use a Forest Green outline with no fill. Always use a generous horizontal padding (2.5x the height).
- **Cards:** Product cards use the Soft Taupe background with no border. Shadows appear only on hover.
- **Input Fields:** Use a thin 1px border in Taupe. On focus, the border transitions to Sage Green. Label text should always be in the uppercase `label-md` style.
- **Chips/Tags:** Used for ingredient callouts (e.g., "Vegan," "Organic"). Use the Terracotta color at 10% opacity with solid Terracotta text for a soft, natural highlight.
- **Lists:** Product ingredient lists should use custom bullet points—small 4px Forest Green circles or leaf icons.
- **Navigation:** The header should be transparent on scroll-up and transition to a semi-transparent Cream blur on scroll-down to maintain a lightweight feel.