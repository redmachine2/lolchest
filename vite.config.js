import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import * as secrets from './secrets.json';

const baseUrl = "https://na1.api.riotgames.com/lol"
const apiKey = secrets.apiKey


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vuetify({ autoImport: true })],
  server: {
    proxy: {
      "^/api/.*": {
        target: baseUrl,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
        headers: {
          "X-Riot-Token": apiKey
        }
      }
    }
  }
})
