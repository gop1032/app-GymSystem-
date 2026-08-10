import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@styles': path.resolve(__dirname, './src/styles')
    }
  }
  ,
  server: {
    // Allow requests when the app is accessed through localtunnel hosts.
    // Include wildcard for loca.lt subdomains used by localtunnel.
    allowedHosts: ['localhost', '*.loca.lt', 'busy-kids-poke.loca.lt', 'shaky-boxes-rush.loca.lt', 'wicked-chefs-marry.loca.lt', 'lazy-parks-juggle.loca.lt']
  },
  preview: {
    allowedHosts: ['localhost', '*.loca.lt', 'busy-kids-poke.loca.lt', 'shaky-boxes-rush.loca.lt', 'wicked-chefs-marry.loca.lt', 'lazy-parks-juggle.loca.lt']
  }
})
