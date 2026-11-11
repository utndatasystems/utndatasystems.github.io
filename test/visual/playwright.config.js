const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: __dirname,
  testMatch: "*.spec.js",
  use: { baseURL: "http://127.0.0.1:4173", browserName: "chromium" },
  webServer: {
    cwd: require("node:path").resolve(__dirname, "../.."),
    command: "python3 -m http.server 4173 --bind 127.0.0.1 --directory _site",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
  },
});
