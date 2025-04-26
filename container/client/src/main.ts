import axios from "axios";
import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/_init.ts";
import vuetify from "./theme/vuetify.ts";

const pinia = createPinia();

axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
createApp(App)
	.use(pinia)
	.use(router)
	.use(vuetify)
	.mount("#app");
