const animate = require("tailwindcss-animate");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  safelist: ["dark"],
  prefix: "",
  content: ["./src/**/*.{ts,tsx,vue}", "./index.html"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
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
        common: "#FFFFFF",
        uncommon: "#B9F045",
        rare: "#2087FF",
        epic: "#BB2CFF",
        legendary: "#FFDA57",
        contraband: "#EE2E24",
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
        saffronBlaze: "#FA8633",
        ceruleanSky: "#3382FA",
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "collapsible-down": {
          from: { height: 0 },
          to: { height: "var(--radix-collapsible-content-height)" },
        },
        "collapsible-up": {
          from: { height: "var(--radix-collapsible-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "collapsible-down": "collapsible-down 0.2s ease-in-out",
        "collapsible-up": "collapsible-up 0.2s ease-in-out",
      },
      contain: {
        content: "content",
      },
      backgroundImage: {
        weaponCard:
          "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(102,102,102,0.2) 100%), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.05) 100%)",
        weaponCardA:
          "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(102,102,102,0.2) 100%), linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.15) 100%)",
        darkRadialGradient: "radial-gradient(47.55% 47.55% at 50% 0%, #050623 0%, #00010F 100%)",
        subtleDarkRadialGradient:
          "radial-gradient(47.55% 47.55% at 50% 0%, rgba(18, 18, 18, 0.80) 17.5%, rgba(0, 0, 0, 0.80) 100%)",
        darkLinearGradient:
          "linear-gradient(90deg, rgba(0, 0, 0, 0.80) 0%, rgba(1, 1, 1, 0.76) 33.58%, rgba(18, 18, 18, 0.00) 61.81%)",
        passionateRubyBlaze:
          "linear-gradient(180deg, rgba(255, 36, 49, 0.40) 0%, rgba(255, 36, 49, 0.00) 100%)",
        passionateRubyBlaze2:
          "linear-gradient(180deg, rgba(255, 36, 49, 1) 0%, rgba(255, 36, 49, 0.5) 100%)",
        sunriseYellowToBlack:
          "linear-gradient(180deg, rgba(255, 218, 87, 0.15) 0%, rgba(255, 218, 87, 0.01) 100%)",
        variable: "var(--bg)",
        pistol:
          "url(https://cdn.leonardo.ai/users/dff1175f-28d6-4b1d-9dce-8c6d881d7fd4/generations/31d3f50b-97c1-42a2-957a-95b9189ba2a2/Default_even_sheet_of_army_clothing_texture_wallpaper_1.jpg?w=512)",
      },
      borderWidth: {
        1: "1px",
        3.5: "3.5px",
      },
      dropShadow: {
        "glow-simple": "0px 1px 32px rgba(255, 238, 87, 0.15)",
        glow: ["0 0px 2px rgba(255,255, 255, 0.35)", "0 0px 6px rgba(255, 255,255, 0.2)"],
        "glow-color": ["0 0px 2px var(--glow-color)", "0 0px 18px var(--glow-color)"],
        light: "0px 1px 1px rgba(0, 0, 0, 0.8)",
      },
      minWidth: (utils) => utils.theme("spacing"),
      spacing: {
        ...generateSpacings([0, 100], [0, 0.25, 0.5, 0.75]),
        ...generateSpacings([100, 200], [0, 0.5]),
        ...generateSpacings([200, 300], [0]),
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
      boxShadow: {
        sunriseYellow: "0px 3px 15px 0px rgba(255, 209, 45, 0.50)",
      },
    },
  },
  plugins: [
    animate,
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

function generateSpacings([from, to], granuality) {
  return [...Array(to - from).keys()].reduce(
    (acc, i) => ({
      ...acc,
      ...Object.fromEntries(
        granuality.map((j) => [
          `${i + from + j}`,
          `${((i + from + j) / 4).toFixed(4).replace(/0+$/g, "").replace(/\.$/g, "")}rem`,
        ]),
      ),
    }),
    {},
  );
}
