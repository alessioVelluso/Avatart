<script setup lang="ts">
import axios from "axios";
import { onMounted, ref, Ref } from "vue";

const pictureHref:Ref<string | null> = ref(null);
const gridSize:Ref<number> = ref(5);

onMounted(() => getPicture());


const getPicture = async () => {
	try {
		const res = await axios.get("http://127.0.0.1:3000/avatar", {
			params: { gridSize: gridSize.value },
			responseType: "arraybuffer"
		});

		const buffer64 = new Blob([res.data], { type: "image/png" });
		const finalUrl = URL.createObjectURL(buffer64);
		pictureHref.value = finalUrl;
	}
	catch {
		pictureHref.value = null;
	}

};


const downloadFile = async (url:string) => {
	const link = document.createElement("a");
	link.href = url;
	link.download = `${new Date().toLocaleString()}.png`;
	document.body.appendChild(link);
	link.click();

	document.body.removeChild(link);
	URL.revokeObjectURL(url);

	await getPicture();
};
</script>

<template>
	<div class="pa-4 d-flex flex-column" style="min-height: 100vh; width: 100%;">
		<div class="w-100 d-flex justify-center pa-3 mb-3">
			<p class="text-h4">AVATART</p>
		</div>
		<div class="d-flex flex-grow-1 justify-center align-center">
			<div class="d-flex flex-column pb-10 mb-10">
				<v-btn
					v-if="pictureHref !== null"
					text="Save"
					class="mb-3"
					variant="outlined"
					color="success"
					@click="downloadFile(pictureHref)"
				/>
				<div v-if="pictureHref !== null" class="rounded mb-3" style="height:300px; width:300px; overflow: hidden;">
					<img :src="pictureHref" style="height: 100%; width: 100%;" />
				</div>
				<div v-else class="rounded bg-warning d-flex justify-center align-center mb-3" style="height:300px; width:300px;">
					<p class="text-h5 mb-0">Service not found</p>
				</div>
				<v-text-field
					hide-details
					v-model="gridSize"
					class="mb-3"
					label="Grid Size"
					density="compact"
					variant="outlined"
					type="number"
					@update:model-value="() => {
						if (gridSize < 3) gridSize = 3;
					}"
				/>
				<v-btn
					text="Generate"
					variant="outlined"
					@click="getPicture()"
				/>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>

</style>
