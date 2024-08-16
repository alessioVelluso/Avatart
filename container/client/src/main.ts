import { createApp } from "vue";
import { createPinia } from "pinia";
import axios from "axios";
import router from "./router/_init.ts";
import vuetify from "./theme/vuetify.ts";
import App from "./App.vue";

const pinia = createPinia();

axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
createApp(App)
	.use(pinia)
	.use(router)
	.use(vuetify)
	.mount("#app");
