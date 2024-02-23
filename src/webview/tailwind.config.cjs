/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Akrobat", "sans-serif"],
      },
      colors: {
        main: {
          100: "#ffab45",
          200: "#ff943b",
          300: "#ff8334",
          400: "#fa7730",
          500: "#EF722E",
          600: "#d76629",
          700: "#b35522",
          800: "#8f441b",
          900: "#6b3314",
        },
        primaryGreen: "#95C82A",
        accentRed: "#FF2431",
        aquaBlue: "#45F0D1",
        deepGray: "#4F5064",
        lavenderGray: "#8A8CB4",
        faintGray: "rgba(217, 217, 217, 0.02)",
        royalBlue: "#3E68FF",
        skyBlue: "#57AEFF",
        sunYellow: "#FFB951",
        steelGray: "#898989",
        mustardYellow: "#FFEE57",
        sunriseYellow: "#FFDA57",
        tealCyan: "#51C3C3",
        deepPurple: "#4850FF",
        lightPurple: "#8E93FF",
        silverCloud: "#D9D9D9",
        midnightCharcoal: "#1B1B1B",
        limeZest: "#B9F045",
      },
      backgroundImage: {
        darkRadialGradient:
          "radial-gradient(47.55% 47.55% at 50% 0%, #050623 0%, #00010F 100%)",
        semiTransparentRadialGradient:
          "radial-gradient(116.43% 121.73% at 0% 0%, rgba(255, 218, 87, 0.20) 0%, rgba(255, 218, 87, 0.00) 100%)",
        subtleDarkRadialGradient:
          "radial-gradient(47.55% 47.55% at 50% 0%, rgba(18, 18, 18, 0.80) 17.5%, rgba(0, 0, 0, 0.80) 100%)",
        darkLinearGradient:
          "linear-gradient(90deg, rgba(0, 0, 0, 0.80) 0%, rgba(1, 1, 1, 0.76) 33.58%, rgba(18, 18, 18, 0.00) 61.81%)",
        vibrantBlueRadialGradient:
          "radial-gradient(47.55% 47.55% at 50% 0%, rgba(60, 63, 129, 0.80) 17.5%, rgba(0, 2, 50, 0.80) 100%)",
        softWhiteRadialGradient:
          "radial-gradient(665.83% 139.08% at 0% 0%, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.00) 100%)",
        tealCyanRadialGradient:
          "radial-gradient(665.83% 139.08% at 0% 0%, rgba(81, 195, 195, 0.15) 0%, rgba(81, 195, 195, 0.00) 100%)",
        freshGreenRadialGradient:
          "radial-gradient(665.83% 139.08% at 0% 0%, rgba(149, 200, 42, 0.15) 0%, rgba(149, 200, 42, 0.00) 100%)",
        subtleMidnightMist:
          "radial-gradient(48.75% 48.75% at 50% 51.25%, #050623 0%, rgba(0, 1, 15, 0.88) 100%)",
        eclipseShadow:
          "linear-gradient(90deg, #000 0%, rgba(0, 0, 0, 0.50) 19.01%, rgba(0, 0, 0, 0.00) 50.5%, rgba(0, 0, 0, 0.50) 83.9%, #000 100%)",
        celestialBlueNebula:
          "radial-gradient(209.03% 141.29% at 100% 0%, rgba(72, 80, 255, 0.40) 0%, rgba(72, 80, 255, 0.17) 19.03%, rgba(72, 80, 255, 0.00) 100%)",
        crimsonCometGlow:
          "radial-gradient(665.83% 139.08% at 0% 0%, rgba(255, 74, 74, 0.15) 0%, rgba(255, 74, 74, 0.00) 100%)",
        sublimeCitrusHaze:
          "linear-gradient(180deg, rgba(185, 240, 69, 0.10) 0%, rgba(185, 240, 69, 0.00) 100%)",
        delicateWhiteVeil:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.00) 100%)",
        passionateRubyBlaze: "linear-gradient(180deg, rgba(255, 36, 49, 0.40) 0%, rgba(255, 36, 49, 0.00) 100%)",
      },
      borderWidth: {
        1: "1px",
      },
      dropShadow: {
        "glow-simple": "0px 1px 32px rgba(255, 238, 87, 0.15)",
        glow: [
          "0 0px 2px rgba(255,255, 255, 0.35)",
          "0 0px 6px rgba(255, 255,255, 0.2)"
        ]
      },
      minWidth: (utils) => utils.theme("spacing"),
      spacing: {
        "5.5": "1.375rem",
        21: "5.25rem",
        22: "5.5rem",
        42: "10.5rem",
        49: "12.25rem",
        135: "33.75rem",
        132.5: "33.125rem",
        "7/100": "7%",
        "1/10": "10%",
        "1/8": "12.5%",
        "1/5": "20%",
        "2/5": "40%",
        "3/5": "60%",
        "4/5": "80%",
        "screen-1/2": "50vh",
        "screen-1/3": "33.333333vh",
        "screen-2/3": "66.666667vh",
        "screen-1/4": "25vh",
        "screen-3/4": "75vh",
        "screen-1/5": "20vh",
        "screen-2/5": "40vh",
        "screen-3/5": "60vh",
        "screen-4/5": "80vh",
        "screen-1/10": "10vh",
      },
      opacity: {
        1: "0.01",
      },
      zIndex: {
        max: 9007199254740000,
      },
    },
  },
  plugins: [
    function ({ addBase, theme }) {
      function extractColorVars(colorObj, colorGroup = "") {
        return Object.keys(colorObj).reduce((vars, colorKey) => {
          const value = colorObj[colorKey];

          const newVars =
            typeof value === "string"
              ? {
                [`--color${colorGroup}-${colorKey}`]: value,
                ...(colorKey === "500" && {
                  [`--color${colorGroup}`]: value,
                }),
              }
              : extractColorVars(value, `-${colorKey}`);

          return { ...vars, ...newVars };
        }, {});
      }

      addBase({
        ":root": extractColorVars(theme("colors")),
      });
    },
  ],
};
