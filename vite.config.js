import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      // 💡 일반 API 요청 프록시 (필요시 사용)
      '/api': {
        target: import.meta.env.VITE_API_URL,
        changeOrigin: true,
      },
      // 💡 순수 웹소켓(ws) 요청 프록시 설정 (맨 앞 '/' 준수!)
      '/ws-stomp': {
        target: import.meta.env.VITE_API_URL,
        ws: true,
        changeOrigin: true,
      }
    }
  }
})