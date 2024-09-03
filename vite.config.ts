import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default defineConfig({
  build:{
    target:"esnext",
    rollupOptions:{
      input:{
        popup: "./popup.html",
        background: "./src/background/main.ts",
        content: "./src/content/main.ts",
      },
      output:{
        entryFileNames: "[name].js"
      }
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'manifest.json',
          dest: ''
        },
      ]
    })
  ],
  base: "./"
});