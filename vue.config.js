const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,

  pwa: {
    name: "My Vue PWA",
    themeColor: "#111827", // Matches the background
    msTileColor: "#111827", // For Windows
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black-translucent", // For iOS (forces dark overlay)
    manifestOptions: {
      short_name: "VuePWA",
      start_url: "/",
      display: "standalone",
      background_color: "#111827", // Ensures seamless edge blending
      icons: [
        {
          src: "/img/icons/icon-192x192.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "/img/icons/icon-512x512.png",
          sizes: "512x512",
          type: "image/png"
        }
      ]
    }
  }
});
