import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@", replacement: "/src" },
    ],
  },
  server: {
    proxy: {
      // 프론트에서 '/api'로 시작하는 요청을 보내면, 아래 target 주소로
      '/api': {
        target: 'http://192.168.0.60', // 실제 백엔드 주소
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') 
      }
    }
  }
})