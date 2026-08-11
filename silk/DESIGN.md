# Silk — Neomorphic / Soft UI

## North Star: "Extruded Light"
Soft, tactile, and dimensional. Elements appear pressed into or extruded from the surface. Minimal contrast, maximum depth feel.
This theme is optimized for a `dark` color mode, enhancing the depth and shadow effects.

## Colors
- **Primary (`#6366f1`):** Indigo — interactive elements and focus states.
- **Background (Neutral `on_surface_dim`):** A dark, cool gray (`#1e1e23`) — the "clay" from which elements are molded in dark mode.
- **Tertiary (`#7c3aed`):** Violet — secondary accents and highlights.
- All surfaces share the same color family. Depth comes from light and shadow, not color variation.

## Neomorphic Effect (Core Pattern)
- **Raised elements:** `box-shadow: 6px 6px 12px rgba(0,0,0,0.08), -6px -6px 12px rgba(255,255,255,0.6)`.
- **Pressed/inset:** `box-shadow: inset 4px 4px 8px rgba(0,0,0,0.06), inset -4px -4px 8px rgba(255,255,255,0.5)`.
- Background of element MUST match the parent surface color for the effect to work.
- Never combine with borders or gradients.

## Typography
- **All fonts:** Plus Jakarta Sans — geometric, friendly, modern.
- Use medium weight for body, semibold for headings. Avoid bold.
- Text color: `on_surface` for primary, `on_surface_variant` for secondary.

## Components
- **Buttons:** Raised neomorphic style. Active/pressed = inset shadow. Primary = indigo text/icon, raised surface.
- **Cards:** Raised neomorphic surface. Same background color as parent. Generous padding.
- **Inputs:** Inset shadow style. Text input appears carved into the surface.
- **Toggles/Sliders:** Raised thumb on inset track.

## Rules
- Surface color must be consistent — the illusion breaks with color changes.
- Minimum 12px border-radius on all neomorphic elements. (Roundedness: 3 for maximum roundedness).
- Never use flat design mixed with neomorphic. Commit fully to the style.
- Generous spacing (spacing: 3) to emphasize the dimensional elements and avoid a cramped feel.