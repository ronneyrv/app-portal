import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React separado
          react: ['react', 'react-dom'],

          // Material UI e Emotion
          mui: [
            '@mui/material',
            '@mui/icons-material',
            '@emotion/react',
            '@emotion/styled'
          ],

          // Bibliotecas de gráficos
          charts: [
            'recharts',
            'echarts',
            '@mui/x-charts'
          ],

          // Outras libs importantes
          utils: [
            'axios',
            'html2pdf.js',
            'react-router-dom'
          ]
        }
      }
    }
  }
})
