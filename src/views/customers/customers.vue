<!-- src/components/CustomerList.vue -->
<template>
    <div>
        <div class="container">
            <TableCustom :columns="columns" :tableData="tableData" :total="page.total" :viewFunc="handleView"
                :delFunc="handleDelete" :page-change="changePage" :editFunc="handleEdit">
                <template #toolbarBtn>
                    <el-button type="warning" :icon="CirclePlusFilled" @click="handleSave">New</el-button>
                </template>
            </TableCustom>
        </div>





        <el-dialog v-model="visible" width="900px" destroy-on-close :close-on-click-modal="false" @close="closeDialog">
            <TableEdit :form-data="rowData" :options="options" :update="saveData" :updateWithStatus="submitData"
                :changeVol="changeVol" />
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
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { Customer, statusMapping, reverseStatusMapping } from '@/types/user';
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



// 表格header相关
let columns = ref([
    { type: 'index', label: 'id', width: 50 },
    { prop: 'name', label: 'name' },
    { prop: 'contact', label: 'contact' },
    { prop: 'address', label: 'address' },
    { prop: 'cac', label: 'Channels' },
    { prop: 'salesRep', label: 'sales Rep' },
    { prop: 'measurer', label: 'measurer' },
    { prop: 'designer', label: 'designer' },
    { prop: 'statusString', label: 'status' },
    { prop: 'operator', label: 'operaton', width: 250 },

])
// 获取所有用户, 保存到tableData中，以及分页处理
const page = reactive({
    index: 1,
    size: 10,
    total: 0,
})
const tableData = ref<Customer[]>([]);
const getData = async () => {
    const res = await axios.get('/customer/list');
    tableData.value = res.data.data.map(item => ({
        ...item,
        statusString: statusMapping[item.status as number] || item.status,
        vol: statusMapping[item.status as number] || item.status,
    }));
    page.total = res.data.pageTotal;

};
getData();

const changePage = (val: number) => {
    page.index = val;
    getData();
};

// dialog 里面内容
const coWorkers = localStorage.getItem('coworkers');
const usernmae = localStorage.getItem('vuems_name');
// coworker select process
const opts = coWorkers.split(',').map(username => ({
    key: username,
    value: username,
    label: username
}));
// 初始化 options
let options = ref<FormOption>();

const visible = ref(false);
const rowData = ref({});
//save a customer
const saveData = async (formEl: FormInstance | undefined) => {
    const response = await axios.post('/customer/save', formEl);
    ElMessage.success('success');
    visible.value = false;
    getData();
};
//save a customer with status++
const submitData = async (formEl: FormInstance | undefined) => {
    formEl.status++;
    const response = await axios.post('/customer/save', formEl);
    ElMessage.success('success');
    visible.value = false;
    getData();
};

const closeDialog = () => {
    visible.value = false;
};

// open dialog by new button
const handleSave = () => {
    rowData.value = { id: 0, status: 1 };
    options.value = {
        labelWidth: '150px',
        span: 12,
        list: [
            { type: 'input', label: 'name', prop: 'name' },
            { type: 'input', label: 'contact', prop: 'contact' },
            { type: 'input', label: 'Channels', prop: 'cac', placeholder: "Customer Acquisition Channels" },
            { type: 'select', label: 'sales Rep', prop: 'salesRep', opts: opts },
            { type: 'select', label: 'measurer', prop: 'measurer', opts: opts },
            { type: 'input', label: 'address', prop: 'address' },
            { type: 'datetime', label: 'date', prop: 'measuredAt', placeholder: "measure time" },
            { type: 'textarea', label: 'note', prop: 'note' }
        ]
    };
    visible.value = true;
};

const changeVol = (val: string) => {
    console.log(val);
    const vol = reverseStatusMapping[val]
    if (vol == 1) {
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
                { type: 'datetime', label: 'date', prop: 'measuredAt', placeholder: "measure time" },
                { type: 'textarea', label: 'note', prop: 'note' }
            ]
        };
    } else if (vol == 2) {
        options.value = {
            labelWidth: '100px',
            span: 12,
            list: [
                { type: 'upload', label: 'measure files', prop: 'measureFiles' },
                { type: 'input', label: 'price range', prop: 'priceRange' },
                { type: 'select', label: 'designer', prop: 'designer', opts: opts },
                { type: 'textarea', label: 'note', prop: 'note' },
            ]
        };
    } else if (vol == 3) {
        options.value = {
            labelWidth: '100px',
            span: 12,
            list: [
                { type: 'upload', label: 'design files', prop: 'designFiles' },
                { type: 'input', label: 'sale price', prop: 'salePrice' },
                { type: 'upload', label: 'order files', prop: 'orderFiles', opts: opts },
                { type: 'input', label: 'order note', prop: 'orderNote' },
                { type: 'textarea', label: 'note', prop: 'note' }
            ]
        };
    } else if (vol == 4) {
        options.value = {
            labelWidth: '100px',
            span: 12,
            list: [
                { type: 'upload', label: 'final files', prop: 'finalFiles' },
                { type: 'textarea', label: 'note', prop: 'note' }
            ]
        };
    } else {
        options.value = {
            labelWidth: '100px',
            span: 12,
            list: [
                { type: 'textarea', label: 'note', prop: 'note' }
            ]
        }
    }
   
};
//const initialFiles = ref({});
// open dialog by edit button
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
                { type: 'datetime', label: 'date', prop: 'measuredAt', placeholder: "measure time" },
                { type: 'textarea', label: 'note', prop: 'note' }
            ]
        };
    } else if (row.status == 2) {
        options.value = {
            labelWidth: '100px',
            span: 12,
            list: [
                { type: 'upload', label: 'measure files', prop: 'measureFiles' },
                { type: 'input', label: 'price range', prop: 'priceRange' },
                { type: 'select', label: 'designer', prop: 'designer', opts: opts },
                { type: 'textarea', label: 'note', prop: 'note' },
            ]
        };
    } else if (row.status == 3) {
        options.value = {
            labelWidth: '100px',
            span: 12,
            list: [
                { type: 'upload', label: 'design files', prop: 'designFiles' },
                { type: 'input', label: 'sale price', prop: 'salePrice' },
                { type: 'upload', label: 'order files', prop: 'orderFiles', opts: opts },
                { type: 'input', label: 'order note', prop: 'orderNote' },
                { type: 'textarea', label: 'note', prop: 'note' }
            ]
        };
    } else if (row.status == 4) {
        options.value = {
            labelWidth: '100px',
            span: 12,
            list: [
                { type: 'upload', label: 'final files', prop: 'finalFiles' },
                { type: 'textarea', label: 'note', prop: 'note' }
            ]
        };
    } else {
        options.value = {
            labelWidth: '100px',
            span: 12,
            list: [
                { type: 'textarea', label: 'note', prop: 'note' }
            ]
        }
    }
    rowData.value = {
        ...row,
    };
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
            label: 'customer id',
        },
        {
            prop: 'name',
            label: 'name',
        },
        {
            prop: 'contact',
            label: 'contact',
        },
        {
            prop: 'address',
            label: 'address',
        },
        {
            prop: 'note',
            label: 'note',
        }
    ]
    visible1.value = true;
};

// 删除相关
const handleDelete = (row: Customer) => {
    ElMessage.success('删除成功');
}


</script>