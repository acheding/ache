import { createApp } from 'vue'
import App from './App.vue'
import pinia from './store'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElIcons from '@element-plus/icons-vue'
import ICON from './components/common/icon.vue'

const app = createApp(App)
for (const name in ElIcons) {
  app.component(name, ElIcons[name])
}

app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.component('ICON', ICON)

app.mount('#app')
