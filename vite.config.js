import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return defineConfig({
    base: env.VITE_BASE_URL || '/',
    plugins: [react()],
    server: {
      proxy: {
        '/tb-api': {
          target: 'https://thingsboard.cloud',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/tb-api/, ''),
          // RPC oneway bisa menunggu device; hindari 504 prematur dari proxy dev
          timeout: 120_000,
          proxyTimeout: 120_000,
        },
      },
    },
  })
}
