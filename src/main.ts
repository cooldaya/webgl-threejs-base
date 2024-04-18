import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router/index.js";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import myComp from "./components/my-comp/index.js";
createApp(App).use(ElementPlus).use(myComp).use(router).mount("#app");
