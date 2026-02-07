// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


// vite.config.ts

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  // Add this resolve configuration
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // This helps with Syncfusion CSS resolution
      '@syncfusion': path.resolve(__dirname, 'node_modules/@syncfusion'),
    },
  },
  // Pre-bundle Syncfusion CSS
  optimizeDeps: {
    include: ['@syncfusion/ej2-material.css']
  }
})