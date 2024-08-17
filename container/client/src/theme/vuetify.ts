import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import theme from "./theme";

const vuetify = createVuetify({
	components,
	directives,
	icons: { defaultSet: "mdi" },
	theme,
});

export default vuetify;
