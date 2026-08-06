module.exports = {
  content: ["./*.html", "./assets/js/**/*.js"],
  theme: {
    extend: {
      colors: {
        primary: "#705d00", "primary-container": "#ffd700", "primary-fixed": "#ffe16d",
        "on-primary": "#ffffff", "on-primary-fixed": "#221b00", "on-primary-container": "#705e00", "on-primary-fixed-variant": "#544600", "primary-fixed-dim": "#e9c400",
        secondary: "#8d00d9", "secondary-container": "#aa30fa", "secondary-fixed": "#f3daff",
        "secondary-fixed-dim": "#e3b5ff", "on-secondary": "#ffffff", "on-secondary-container": "#fffbff",
        "on-secondary-fixed": "#2f004c", "on-secondary-fixed-variant": "#6e00ab",
        tertiary: "#b12d00", "tertiary-container": "#ffcfc2", "tertiary-fixed": "#ffdbd1", "tertiary-fixed-dim": "#ffb5a0", "on-tertiary": "#ffffff", "on-tertiary-fixed": "#3b0900", "on-tertiary-container": "#b22e00", "on-tertiary-fixed-variant": "#872000",
        error: "#ba1a1a", "error-container": "#ffdad6", "on-error": "#ffffff", "on-error-container": "#93000a",
        background: "#fcf9f8", surface: "#fcf9f8", "surface-container": "#f0eded",
        "surface-container-low": "#f6f3f2", "surface-container-lowest": "#ffffff",
        "surface-container-high": "#eae7e7", "surface-container-highest": "#e4e2e1", "surface-dim": "#dcd9d9", "surface-bright": "#fcf9f8", "surface-variant": "#e4e2e1",
        "on-background": "#1b1c1c", "on-surface": "#1b1c1c", "on-surface-variant": "#4d4732", outline: "#7e775f", "outline-variant": "#d0c6ab", "inverse-surface": "#303030", "inverse-on-surface": "#f3f0f0", "inverse-primary": "#e9c400", "surface-tint": "#705d00"
      },
      borderRadius: { DEFAULT: "1rem", lg: "2rem", xl: "3rem", full: "9999px" },
      spacing: { "container-max": "1200px", "margin-desktop": "40px", gutter: "16px", base: "8px", "margin-mobile": "20px" },
      maxWidth: { content: "1200px" },
      fontFamily: {
        headline: ["Plus Jakarta Sans", "sans-serif"], body: ["Quicksand", "sans-serif"],
        "headline-lg": ["Plus Jakarta Sans", "sans-serif"], "headline-lg-mobile": ["Plus Jakarta Sans", "sans-serif"],
        "headline-md": ["Plus Jakarta Sans", "sans-serif"], "body-lg": ["Quicksand", "sans-serif"],
        "body-md": ["Quicksand", "sans-serif"], "label-caps": ["Space Grotesk", "sans-serif"]
      },
      fontSize: {
        "headline-lg": ["40px", { lineHeight: "48px", letterSpacing: "-0.02em", fontWeight: "800" }],
        "headline-lg-mobile": ["32px", { lineHeight: "36px", letterSpacing: "-0.02em", fontWeight: "800" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "700" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "500" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "500" }],
        "label-caps": ["12px", { lineHeight: "16px", letterSpacing: "0.1em", fontWeight: "700" }]
      }
    }
  },
  plugins: [require("@tailwindcss/forms")]
};
