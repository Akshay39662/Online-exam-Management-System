import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // We'll run the frontend on port 3000
    proxy: {
      // This will proxy any request starting with /api to our backend server
      '/api': {
        target: 'http://localhost:5000', // Your backend server address
        changeOrigin: true,
      },
    },
  },
})
