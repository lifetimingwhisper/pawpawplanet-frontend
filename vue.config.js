const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    open: true,
    port: 4200,
    hot: true,
  },
});
