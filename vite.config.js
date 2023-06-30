const path = require("path");
const { defineConfig } = require("vite");

module.exports = defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, "src/index.ts"),
            name: "eslint-plugin-import-path-enforce",
            fileName: (format) => `index.${format}.js`,
        },
    },
});
