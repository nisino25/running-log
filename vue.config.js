const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,

  pwa: {
    name: "Running log",
    themeColor: "#1E1E1E",  // Match this with your actual background color
    msTileColor: "#1E1E1E", // Match for Windows Tiles
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black-translucent",
    manifestOptions: {
      short_name: "VuePWA",
      start_url: "/",
      display: "standalone",
      background_color: "#1E1E1E", // Match with your app background
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
