import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return defineConfig({
    plugins: [
      react(),
    
    ],
    server: {
      proxy: {
        // 일반 API 요청 프록시
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
        },

        // 웹소켓 프록시
        '/ws-stomp': {
          target: env.VITE_API_URL,
          ws: true,
          changeOrigin: true,
        }
      }
    }
  })
}