// Design system — GolfGPT / Utah Tee-Up
// Source: docs/DESIGN_SYSTEM.md

export const colors = {
  // Brand
  brandGreen: '#3D5A2A',
  statusGreen: '#4A7A2E',
  brandGreenLight: '#5A7A3A',

  // Backgrounds
  bgCream: '#F5F0E8',
  surface: '#FFFFFF',

  // Text
  textPrimary: '#3B2F1E',
  textSecondary: '#6B5D4F',
  textMuted: '#8A8178',

  // Borders / UI
  borderDefault: '#C4B9A8',
  borderFocus: '#3D5A2A', // thick border on active inputs

  // Status
  error: '#B94040',
  white: '#FFFFFF',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Sharp for data/grid, rounded for conversational elements
export const radius = {
  none: 0,   // data grids, selector cells
  sm: 6,     // time of day options, misc UI
  md: 12,    // chat bubbles, input fields
  pill: 24,  // suggestion chips
};

export const typography = {
  // Families — loaded via expo-font
  serif: 'PlayfairDisplay_700Bold',
  serifRegular: 'PlayfairDisplay_400Regular',
  body: 'Lora_400Regular',
  bodyBold: 'Lora_700Bold',
  bodyItalic: 'Lora_400Regular_Italic',

  // Scale
  logo: { fontSize: 30, letterSpacing: -0.5 },
  tagline: { fontSize: 11, letterSpacing: 2 },
  sectionLabel: { fontSize: 13, letterSpacing: 1.5 },
  bodyLg: { fontSize: 17 },
  // NOTE: no 'body' scale key — would collide with body font family above
  caption: { fontSize: 11, letterSpacing: 1.5 },
  button: { fontSize: 12, letterSpacing: 1.5 },
};

// Border widths — thick borders signal interaction
export const borders = {
  default: 1,
  input: 3,   // chat input focal point
  active: 2,  // selected states, chat bubble
};
