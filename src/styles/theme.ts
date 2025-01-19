// src/styles/theme.ts

export const theme = {
    colors: {
      primary: "#337196",      // Calypso Blue
      background: "#F9FAFB",   // Light Cool Gray
      text: "#45546A",         // Dark Grey-Blue
      accent1: "#00BFA6",      // Bright Teal
      accent2: "#FF7E67",      // Coral Orange
      accent3: "#7986CB",      // Periwinkle
      accent4: "#B4A7D6",      // Soft Purple
    },
    fonts: {
      heading: "'Plus Jakarta Sans', system-ui, sans-serif",
      body: "'Inter', system-ui, sans-serif",
    },
    fontWeights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    letterSpacing: {
      heading: "-0.02em",
      body: "0",
    }
  } as const;
  
  // Common style mixins
  export const styleUtils = {
    headingStyles: {
      fontFamily: theme.fonts.heading,
      letterSpacing: theme.letterSpacing.heading,
      fontWeight: theme.fontWeights.semibold,
    },
    bodyStyles: {
      fontFamily: theme.fonts.body,
      letterSpacing: theme.letterSpacing.body,
      fontWeight: theme.fontWeights.regular,
    }
  } as const;