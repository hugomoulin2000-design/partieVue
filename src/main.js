import { createApp } from 'vue'
import App from './App.vue'
import './assets/global.css'
import { useAuthStore } from './stores/authStore'

import router from './router'
import { createPinia } from 'pinia'


const app = createApp(App)

app.use(createPinia())
app.use(router)



const auth = useAuthStore()
auth.loadToken()

app.mount('#app')
