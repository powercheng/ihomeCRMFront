<template>
	<el-select v-model="form.vol" placeholder="change page" style="text-align: right; width: 150px; margin-bottom: 20px;" @change="changeVol">
		<el-option label="create" value="create"></el-option>
		<el-option label="measure" value="measure"></el-option>
		<el-option label="design" value="design"></el-option>
		<el-option label="produce & install" value="produce & install"></el-option>
		<el-option label="finish" value="finish"></el-option>
	</el-select>
	<el-steps class="mb-4" style="margin-bottom: 20px;" :space="200" :active="form.status" simple>
		<el-step title="create" />
		<el-step title="measure" />
		<el-step title="design" />
		<el-step title="produce & install" />
		<el-step title="finish" />
	</el-steps>
	<el-form ref="formRef" :model="form" :rules="rules" :label-width="options.labelWidth">
		<el-row>
			<el-col :span="options.span" v-for="item in options.list">
				<el-form-item :label="item.label" :prop="item.prop">
					<!-- 文本框、数字框、下拉框、日期框、开关、上传 -->
					<el-input v-if="item.type === 'input'" v-model="form[item.prop]" :disabled="item.disabled"
						:placeholder="item.placeholder" clearable></el-input>
					<el-input v-else-if="item.type === 'textarea'" type ="textarea" :autosize="{ minRows: 3}"  v-model="form[item.prop]" 
						:placeholder="item.placeholder" clearable></el-input>
					<el-input-number v-else-if="item.type === 'number'" v-model="form[item.prop]" :disabled="item.disabled"
						controls-position="right"></el-input-number>
					<el-select v-else-if="item.type === 'select'" v-model="form[item.prop]" :disabled="item.disabled"
						:placeholder="item.placeholder" clearable>
						<el-option v-for="opt in item.opts" :label="opt.label" :value="opt.value"></el-option>
					</el-select>
					<el-date-picker v-else-if="item.type === 'date'" type="date" v-model="form[item.prop]"
						:value-format="item.format"></el-date-picker>
					<el-date-picker v-else-if="item.type === 'datetime'" type="datetime" v-model="form[item.prop]" :placeholder="item.placeholder"
						:value-format="item.format"></el-date-picker>
					<el-switch v-else-if="item.type === 'switch'" v-model="form[item.prop]" :active-value="item.activeValue"
						:inactive-value="item.inactiveValue" :active-text="item.activeText"
						:inactive-text="item.inactiveText"></el-switch>

					<el-upload v-else-if="item.type === 'upload'" class="avatar-uploader" multiple :show-file-list="true"
						:http-request="uploadRequest(item.prop)" v-model:file-list="form[item.prop]" list-type="picture-card"
						:on-success="handleUploadSuccess(item.prop)">
						<el-icon class="avatar-uploader-icon">
							<Plus />
						</el-icon>
					</el-upload>



					<slot :name="item.prop" v-else>

					</slot>
				</el-form-item>
			</el-col>
		</el-row>

		<el-form-item>
			<el-button type="primary" @click="saveEdit(formRef)" style="margin-right: 20px;">save</el-button>
			<el-button type="primary" @click="submitEdit(formRef)">submit to next</el-button>
		</el-form-item>
	</el-form>
</template>

<script lang="ts" setup>
import { FormOption } from '@/types/form-option';
import { FormInstance, FormRules, UploadUserFile } from 'element-plus';
import { PropType, ref } from 'vue';
import axios from 'axios';
import { tr } from 'element-plus/es/locale';

const { options, formData, update, updateWithStatus, changeVol } = defineProps({
	options: {
		type: Object as PropType<FormOption>,
		required: true
	},
	formData: {
		type: Object,
		required: true
	},
	update: {
		type: Function,
		required: true
	},
	updateWithStatus: {
		type: Function,
		required: true
	},
	changeVol: {
		type: Function,
		required: true
	}




});


const form = ref({ ...formData });

const rules: FormRules = options.list.map(item => {
	if (item.required) {
		return { [item.prop]: [{ required: true, message: `${item.label}不能为空`, trigger: 'blur' }] };
	}
	return {};
}).reduce((acc, cur) => ({ ...acc, ...cur }), {});


const formRef = ref<FormInstance>();
const saveEdit = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(valid => {
		if (!valid) return false;
		update(form.value);
	});
};

const submitEdit = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(valid => {
		if (!valid) return false;
		updateWithStatus(form.value);
	});
};



//const fileList = ref({...initialFiles});

const uploadRequest = (prop) => async ({ file, onProgress, onSuccess, onError }) => {
	const formData = new FormData();
	formData.append('file', file);

	try {
		const response = await axios.post('http://localhost:8080/upload/' + form.value.id + "/" + prop, formData, {
			onUploadProgress: (progressEvent) => {
				const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
				onProgress({ percent: percentCompleted });
			},
		});

	} catch (error) {
		onError(error);
	}
};

const handleUploadSuccess = (prop: String) => (response: any, file: File, fileList: File[]) => {
	// response 是上传成功后服务器返回的数据
	// file 是当前上传的文件对象
	// fileList 是当前文件列表数组


	console.log(222);
	// 更新 form[prop] 中的文件列表
	//form.value[prop].push(uploadedFile);
	console.log(fileList);
	const seenNames = {};
	const uniqueFiles = [];

	fileList.forEach(file => {
		if (!seenNames[file.name]) {
			seenNames[file.name] = true;
			uniqueFiles.push({
				name:file.name,
				url: "http://localhost:8080/" + form.value.id + "/" + prop + "/" + file.name});
		}
	});

	form.value[prop] = uniqueFiles;
	// 如果需要处理同名文件的逻辑，可以在这里进行处理
	// 例如移除旧文件等操作
};




</script>

<style>
.avatar-uploader .el-upload {
	border: 1px dashed var(--el-border-color);
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
	border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	text-align: center;
}
</style>
