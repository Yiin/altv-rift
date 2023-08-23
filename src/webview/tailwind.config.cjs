/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,vue}"],
  theme: {
    extend: {
      borderWidth: {
        1: "1px",
      },
      minWidth: (utils) => utils.theme("spacing"),
      spacing: {
        22: "5.5rem",
        49: "12.25rem",
        135: "33.75rem",
        132.5: "33.125rem",
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
