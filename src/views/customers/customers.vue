<!-- src/components/CustomerList.vue -->
<template>
    <div>
        <div class="container">
            <TableCustom :columns="columns" :tableData="tableData" :total="page.total" :viewFunc="handleView"
                :delFunc="handleDelete" :page-change="changePage" :editFunc="handleEdit">
                <template #toolbarBtn>
                    <el-button type="warning" :icon="CirclePlusFilled" @click="visible = true">新增</el-button>
                </template>
            </TableCustom>
        </div>
        <el-dialog title="新增" v-model="visible" width="900px" destroy-on-close :close-on-click-modal="false"
            @close="closeDialog">
            <TableEdit :form-data="rowData" :options="options" :update="saveData" />
        </el-dialog>
        <el-dialog title="查看详情" v-model="visible1" width="700px" destroy-on-close>
            <TableDetail :data="viewData"></TableDetail>
        </el-dialog>

    </div>
</template>
  

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { Customer } from '@/types/user';
import { ElMessage, FormInstance } from 'element-plus';
import { CirclePlusFilled } from '@element-plus/icons-vue';
import TableCustom from '@/components/table-custom.vue';
import TableDetail from '@/components/table-detail.vue';
import TableSearch from '@/components/table-search.vue';
import { FormOption, FormOptionList } from '@/types/form-option';
import axios from 'axios';


const router = useRouter();

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

// 表格相关
let columns = ref([
    { type: 'index', label: 'id', width: 55, align: 'center' },
    { prop: 'name', label: 'name' },
    { prop: 'contact', label: 'contact' },
    { prop: 'address', label: 'address' },
    { prop: 'status', label: 'status', width: 250 },
    { prop: 'assignee', label: 'assignee', width: 250 },
    { prop: 'operation', label: 'operation', width: 250 },
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
    tableData.value = res.data.list;
    page.total = res.data.pageTotal;
};
getData();

const changePage = (val: number) => {
    page.index = val;
    getData();
};

// 新增弹窗相关
let options = ref<FormOption>({
    labelWidth: '100px',
    span: 12,
    list: [
        { type: 'input', label: 'name', prop: 'name' },
        { type: 'input', label: 'contact', prop: 'contact' },
        { type: 'input', label: 'address', prop: 'address' },
        { type: 'input', label: 'Channels', prop: 'cac', placeholder: "Customer Acquisition Channels" },
        { type: 'input', label: 'sales Rep', prop: 'salesRep' },
    ]
})
const visible = ref(false);
const rowData = ref({});
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

const closeDialog = () => {
    visible.value = false;
};


// 编辑相关
const handleEdit = (row: Customer) => {
    rowData.value = { ...row };
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