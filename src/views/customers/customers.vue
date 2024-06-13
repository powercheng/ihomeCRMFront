<!-- src/components/CustomerList.vue -->
<template>
    <div>
        <div class="container">
            <TableCustom :columns="columns" :tableData="tableData" :total="page.total" :viewFunc="handleView"
                :delFunc="handleDelete" :page-change="changePage" :editFunc="handleEdit">
                <template #toolbarBtn>
                    <el-button type="warning" :icon="CirclePlusFilled" @click="handleSave">新增</el-button>
                </template>
            </TableCustom>
        </div>





        <el-dialog :title="isEdit ? '编辑' : '新增'" v-model="visible" width="900px" destroy-on-close
            :close-on-click-modal="false" @close="closeDialog">
            <TableEdit :form-data="rowData" :options="options" :edit="isEdit" :update="saveData"
                :updateWithStatus="submitData" />
        </el-dialog>
        <el-dialog title="查看详情" v-model="visible1" width="900px" destroy-on-close>
            <el-steps class="mb-4" style="max-width: 800px" :space="100" :active="1" simple>
                <el-step title="create" />
                <el-step title="measure" />
                <el-step title="design" />
                <el-step title="produce" />
                <el-step title="install" />
            </el-steps>
            <TableDetail :data="viewData"></TableDetail>
        </el-dialog>

    </div>
</template>


<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Customer, User } from '@/types/user';
import { ElMessage, FormInstance } from 'element-plus';
import { CirclePlusFilled } from '@element-plus/icons-vue';
import TableCustom from '@/components/table-custom.vue';
import TableDetail from '@/components/table-detail.vue';
import TableSearch from '@/components/table-search.vue';
import { FormOption, FormOptionList } from '@/types/form-option';
import axios from 'axios';
import { JwtPayload } from '@/types/JwtPayload';
import { jwtDecode } from 'jwt-decode';


const router = useRouter();
const isEdit = ref(false);
// 查询相关
const query = reactive({
    name: '',
});
const searchOpt = ref<FormOptionList[]>([
    { type: 'input', label: '用户名：', prop: 'name' }
])
const handleSearch = () => {
    changePage(1);
};
const coWorkers = localStorage.getItem('coworkers');
const usernmae = localStorage.getItem('vuems_name');

// 表格相关
let columns = ref([
    { type: 'index', label: 'id', width: 55, align: 'center' },
    { prop: 'name', label: 'name' },
    { prop: 'contact', label: 'contact' },
    { prop: 'address', label: 'address' },
    { prop: 'cac', label: 'Channels' },
    { prop: 'salesRep', label: 'sales Rep' },
    { prop: 'measurer', label: 'measurer' },
    { prop: 'designer', label: 'designer' },
    { prop: 'note', label: 'note', width: 250 },
    { prop: 'operator', label: '操作', width: 250 },

])

const page = reactive({
    index: 1,
    size: 10,
    total: 0,
})
const tableData = ref<Customer[]>([]);
// 获取所有用户
const getData = async () => {
    const res = await axios.get('/customer/list');
    console.log(res);
    tableData.value = res.data;
    page.total = res.data.pageTotal;
    console.log(tableData);
};
getData();

const changePage = (val: number) => {
    page.index = val;
    getData();
};
const opts = coWorkers.split(',').map(username => ({
    key: username,
    value: username,
    label: username
}));
// 初始化 options
let options = ref<FormOption>({
    labelWidth: '100px',
    span: 12,
    list: [
        { type: 'input', label: 'name', prop: 'name' },
        { type: 'input', label: 'contact', prop: 'contact' },
        { type: 'input', label: 'address', prop: 'address' },
        { type: 'input', label: 'Channels', prop: 'cac', placeholder: "Customer Acquisition Channels" },
        { type: 'select', label: 'sales Rep', prop: 'salesRep', opts: opts },
    ]
});




const visible = ref(false);
const rowData = ref({});
//save a customer
const saveData = async (formEl: FormInstance | undefined) => {
    console.log(formEl);
    try {
        const response = await axios.post('/customer/save', formEl);
        ElMessage.success('success');
    } catch (error) {
        ElMessage.error("save failed");
    }
    closeDialog();
    getData();
};
//save a customer with status++
const submitData = async (formEl: FormInstance | undefined) => {
    formEl.status++;
    try {
        const response = await axios.put('/customer/' + formEl.id, formEl);
        ElMessage.success('success');
    } catch (error) {
        ElMessage.error("save failed");
    }
    closeDialog();
    getData();
};

const closeDialog = () => {
    visible.value = false;
    isEdit.value = false;
};


// save open function
const handleSave = () => {
    visible.value = true;
};

// 编辑相关
const handleEdit = (row: Customer) => {
    if (row.status == 1) {
        options.value = {
            labelWidth: '100px',
            span: 12,
            list: [
                { type: 'input', label: 'name', prop: 'name' },
                { type: 'input', label: 'contact', prop: 'contact' },
                { type: 'input', label: 'Channels', prop: 'cac', placeholder: "Customer Acquisition Channels" },
                { type: 'select', label: 'sales Rep', prop: 'salesRep', opts: opts },
                { type: 'select', label: 'measurer', prop: 'measurer', opts: opts },
                { type: 'input', label: 'address', prop: 'address' },
                { type: 'datetime', label: 'measure date', prop: 'measuredAt' }
            ]
        };
    } else if (row.status == 2) {
        options.value = {
            labelWidth: '100px',
            span: 12,
            list: [
                { type: 'upload', label: 'original photos', prop: 'originalPhotos' },
                { type: 'upload', label: 'floor plan', prop: 'floorPlan' },
                { type: 'upload', label: 'ref image', prop: 'refImage' },
                { type: 'input', label: 'price range', prop: 'priceRange' },
                { type: 'select', label: 'designer', prop: 'designer', opts: opts },
            ]
        };
    } else if (row.status == 3) {

    } else if (row.status == 4) {

    }


    rowData.value = { ...row };
    isEdit.value = true;
    visible.value = true;
};







const viewCustomerDetail = (id: number) => {
    router.push(`/customer/${id}`);
};


// 查看详情弹窗相关
const visible1 = ref(false);
const viewData = ref({
    row: {},
    list: []
});
const handleView = (row: Customer) => {
    viewData.value.row = { ...row }
    viewData.value.list = [
        {
            prop: 'id',
            label: '用户ID',
        },
        {
            prop: 'name',
            label: '用户名',
        },
        {
            prop: 'password',
            label: '密码',
        },
        {
            prop: 'email',
            label: '邮箱',
        },
        {
            prop: 'phone',
            label: '电话',
        },
        {
            prop: 'role',
            label: '角色',
        },
        {
            prop: 'date',
            label: '注册日期',
        },
    ]
    visible1.value = true;
};

// 删除相关
const handleDelete = (row: Customer) => {
    ElMessage.success('删除成功');
}


</script>