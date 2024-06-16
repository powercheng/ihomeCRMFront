<template>
	<el-descriptions :title="title" column="1" border>
		<el-descriptions-item v-for="item in list" >
			<template #label> {{ item.label }} </template>
			<template v-if="item.type === 'images'">
				<el-image style="width: 100px; height: 100px" :src="firstImage(row[item.prop])" :zoom-rate="1.2" :preview-src-list="processedImages(row[item.prop])"
					:initial-index="4" fit="cover" />

			</template>
			<template v-else>
				{{ item.value || row[item.prop] }}
			</template>
		</el-descriptions-item>
	</el-descriptions>

</template>

<script lang="ts" setup>
const props = defineProps({
	data: {
		type: Object,
		required: true,
	}
});

const { row, title, list } = props.data;

const firstImage = (data) => {
	if (!data || data.length === 0) {
    return '';  // 或者返回一个默认图片的URL
  }
	console.log(data);
	return data[0].url;
}

const processedImages = (data) => {
	if (!data || data.length === 0) {
    return [];  // 返回空数组
  }
	console.log(data);
	return data.map(image => image.url);
}

</script>
