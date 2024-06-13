<template>
	        <el-steps
    class="mb-4"
    style="max-width: 800px; margin-bottom: 20px;"
    :space="100"
    :active="1"
    simple
	
  >
    <el-step title="create"  />
    <el-step title="measure"  />
    <el-step title="design"  />
    <el-step title="produce"  />
    <el-step title="install"  />
  </el-steps>
	<el-form ref="formRef" :model="form" :rules="rules" :label-width="options.labelWidth">
		<el-row>
			<el-col :span="options.span" v-for="item in options.list">
				<el-form-item :label="item.label" :prop="item.prop">
					<!-- 文本框、数字框、下拉框、日期框、开关、上传 -->
					<el-input v-if="item.type === 'input'" v-model="form[item.prop]" :disabled="item.disabled"
						:placeholder="item.placeholder" clearable></el-input>
					<el-input-number v-else-if="item.type === 'number'" v-model="form[item.prop]"
						:disabled="item.disabled" controls-position="right"></el-input-number>
					<el-select v-else-if="item.type === 'select'" v-model="form[item.prop]" :disabled="item.disabled"
						:placeholder="item.placeholder" clearable>
						<el-option v-for="opt in item.opts" :label="opt.label" :value="opt.value"></el-option>
					</el-select>
					<el-date-picker v-else-if="item.type === 'date'" type="date" v-model="form[item.prop]"
						:value-format="item.format"></el-date-picker>
					<el-date-picker
						v-else-if="item.type === 'datetime'" type="datetime" v-model="form[item.prop]"
						:value-format="item.format"
      				></el-date-picker>



					<el-switch v-else-if="item.type === 'switch'" v-model="form[item.prop]"
						:active-value="item.activeValue" :inactive-value="item.inactiveValue"
						:active-text="item.activeText" :inactive-text="item.inactiveText"></el-switch>


					<el-upload v-else-if="item.type === 'upload'" 
						class="avatar-uploader" 
						multiple 
						:show-file-list="true"
						:auto-upload="false"

						>

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
import { FormInstance, FormRules, UploadProps } from 'element-plus';
import { PropType, ref } from 'vue';
import axios from 'axios';

const { options, formData, edit, update, updateWithStatus } = defineProps({
	options: {
		type: Object as PropType<FormOption>,
		required: true
	},
	formData: {
		type: Object,
		required: true
	},
	edit: {
		type: Boolean,
		required: false
	},
	update: {
		type: Function,
		required: true
	},
	updateWithStatus: {
		type: Function,
		required: true
	}
});


const form = ref({ ...(edit ? formData : {}) });

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
