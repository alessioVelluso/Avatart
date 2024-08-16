import { RouteRecordRaw } from "vue-router";
import Index from "@/pages/Index.vue";


const routes:RouteRecordRaw[] = [
	{
		path: "/",
		name: "Avatar Generator",
		component: Index,
	}
];


export default routes;
