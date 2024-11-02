import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "@/assets/less/index.less";
import "vant/lib/index.css";
import "amfe-flexible";
import { Tabbar, TabbarItem, NoticeBar, Popup, Toast, Icon,Overlay,Field,Pagination} from "vant";
import { createI18n } from "vue-i18n";
import messages from "./locale"; // 导入国际化语言包
import { createPinia } from "pinia";

//import piniaPluginPersistedstate from "pinia-plugin-persistedstate"; // 大菠萝持久化


router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title || ""} | phyon`;
  next();
});
// 国际化配置
const i18n = createI18n({
  legacy: false, // 组合式api必须设置为false：官网说明:https://vue-i18n.intlify.dev/guide/advanced/composition.html
  locale: "zh",
  fallbackLocale: "zh",
  messages,
});

const app = createApp(App);

// 大菠萝配置
const pinia = createPinia();
// pinia.use(piniaPluginPersistedstate);
app.use(pinia);

// 设置token
app
  .use(i18n)
  .use(router)
  .use(Tabbar)
  .use(TabbarItem)
  .use(NoticeBar)
  .use(Popup)
  .use(Toast)
  .use(Icon)
  .use(Overlay)
  .use(Field)
  .use(Pagination)
  .mount("#app");
