import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	css: {
		modules: {
			localsConvention: "camelCase"
		}
	},
	resolve: {
		alias: {
			"@": "/src"
		}
	},
	build: {
		outDir: "../back/client"
	},
});
