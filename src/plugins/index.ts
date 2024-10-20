/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from './vuetify'
import router from '../router'
import { DataLoaderPlugin } from 'unplugin-vue-router/data-loaders'
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { createPinia } from 'pinia'

// Types
import type { App } from 'vue'

// Firebase
const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASECONFIG)

const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app);

// Pinia
const pinia = createPinia()

export function registerPlugins (app: App) {
  app
    .use(vuetify)
    .use(DataLoaderPlugin, { router })
    .use(router)
    .use(pinia)
}
