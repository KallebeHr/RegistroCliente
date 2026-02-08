
import { registerPlugins } from '@/plugins'
import App from './App.vue'
import VLibras from '@vue-a11y/vlibras'
import { createApp } from 'vue'

const app = createApp(App)

registerPlugins(app)

// Registrar VLibras ANTES do mount
app.use(VLibras)

app.mount('#app')
