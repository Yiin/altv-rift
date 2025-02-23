/**
 * plugins/webfontloader.js
 *
 * webfontloader documentation: https://github.com/typekit/webfontloader
 */
import WebFont from "webfontloader";

export async function loadFonts() {
  try {
    // Add a timeout promise to prevent infinite waiting
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Font loading timed out after 5 seconds")), 5000);
    });

    const loadingPromise = new Promise(async (resolve, reject) => {
      try {
        WebFont.load({
          google: {
            families: ["Roboto:100,300,400,500,700,900&display=swap"],
          },
          loading: function () {
            console.log("webfont loading");
          },
          active: function () {
            resolve(true);
          },
          inactive: function () {
            reject(new Error("Webfontloader reported inactive"));
          },
          timeout: 4000, // 4 second timeout
        });
      } catch (error) {
        reject(error);
      }
    });

    // Race between the timeout and the actual loading
    await Promise.race([loadingPromise, timeoutPromise]);
    console.log("Fonts loaded successfully");
  } catch (error) {
    console.warn("Font loading failed, falling back to system fonts:", error);
    // Don't throw - allow the application to continue with fallback fonts
  }
}
