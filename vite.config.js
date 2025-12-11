import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Bundle analysis plugin (enabled in analyze mode)
    process.env.ANALYZE && visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  ],
  server: {
    historyApiFallback: {
      index: '/index.html'
    },
  },
  // GitHub Pages configuration
  base: '/biblestory/', // Your repository name
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Increase chunk size warning limit temporarily (aim to reduce this)
    chunkSizeWarningLimit: 800,
    // Optimized rollup configuration for better chunking
    rollupOptions: {
      output: {
        // Manual chunks for better code splitting
        manualChunks: {
          // React and related libraries
          react: ['react', 'react-dom', 'react-router-dom'],
          // Leaflet mapping library (large dependency)
          leaflet: ['leaflet', 'react-leaflet'],
          // Country/phone utilities
          country: ['country-state-city', 'react-phone-number-input']
          // Note: Removed axios since it's not installed or used
        },
        // Enable better compression
        compact: true,
        // Preserve module names for better debugging
        preserveModules: false,
      },
    },
    // Enable minification and compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Enable CSS code splitting
    cssCodeSplit: true,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'leaflet',
      'react-leaflet'
      // Removed axios since it's not installed or used
    ],
  },
})