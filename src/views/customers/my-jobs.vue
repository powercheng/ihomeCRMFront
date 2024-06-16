<!-- src/components/CustomerList.vue -->
<template>
    <div>
        <div class="container">
            <TableCustom :columns="columns" :tableData="tableData" :total="page.total" :current-page="page.index"
                :page-size="page.size" :viewFunc="handleView" :delFunc="handleDelete" :changePage="changePage"
                :editFunc="handleEdit">
                <template #toolbarBtn>
                    <el-button type="warning" :icon="CirclePlusFilled" @click="handleSave">New</el-button>
                </template>
            </TableCustom>
        </div>
        <el-dialog v-model="visible" width="900px" destroy-on-close :close-on-click-modal="false" @close="closeDialog">
            <TableEdit :form-data="rowData" :options="options" :update="saveData" :updateWithStatus="submitData"
                :changeVol="changeVol" />
        </el-dialog>
        <el-dialog v-model="visible1" width="900px" destroy-on-close>
            <el-steps class="mb-4" style=" margin-bottom: 20px;" :space="100" :active="viewData.row.status" simple>
                <el-step title="create" />
                <el-step title="measure" />
                <el-step title="design" />
                <el-step title="order" />
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
import { ElMessage, FormInstance, spaceProps } from 'element-plus';
import { CirclePlusFilled } from '@element-plus/icons-vue';
import TableCustom from '@/components/table-custom.vue';
import TableDetail from '@/components/table-detail.vue';
import TableSearch from '@/components/table-search.vue';
import { FormOption, FormOptionList } from '@/types/form-option';
import axios from 'axios';

const coWorkers = localStorage.getItem('coworkers');
const region = localStorage.getItem('region');
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
    { prop: 'createdAt', label: 'createdAt' },
    { prop: 'operator', label: 'operaton', width: 250 },

])
// 获取所有用户, 保存到tableData中，以及分页处理
const page = reactive({
    index: 1,
    size: 20,
    total: 0,
})
const tableData = ref<Customer[]>([]);
const getData = async () => {
    const res = await axios.get('/customer/list', {
        params: {
            page: page.index - 1,  // Spring Data JPA pages are 0-indexed
            size: page.size,
            salePlace: region,
        }
    });
    tableData.value = res.data.data.items.map(item => ({
        ...item,
        statusString: statusMapping[item.status as number] || item.status,
        vol: statusMapping[item.status as number] || item.status,
    }));
    page.total = res.data.data.total;
};
getData();

const changePage = (val: number) => {
    page.index = val;
    getData();
};

// dialog 里面内容

// coworker select process
const opts = JSON.parse(coWorkers).map(item => ({
    key: item.username,
    value: item.username,
    label: item.username
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
    if (formEl.status == 2) {
        formEl.measuredAt = new Date();
    } else if (formEl.status == 3) {
        formEl.designedAt = new Date();
    } else if (formEl.status == 4) {
        formEl.produced = new Date();
    } else if (formEl.status == 5) {
        formEl.installed = new Date();
    } else {
        formEl.finishedAt = new Date();
    }
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

const changeOption = (vol: number) => {
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
                { type: 'textarea', label: 'note', prop: 'note' }
            ]
        };
    } else if (vol == 4) {
        options.value = {
            labelWidth: '100px',
            span: 12,
            list: [
                { type: 'upload', label: 'order files', prop: 'orderFiles', opts: opts },
                { type: 'input', label: 'order note', prop: 'orderNote' },
                { type: 'textarea', label: 'note', prop: 'note' }

            ]
        };
    } else if (vol == 5) {
        options.value = {
            labelWidth: '100px',
            span: 12,
            list: [
                { type: 'upload', label: 'produce files', prop: 'producedFiles' },
                { type: 'textarea', label: 'note', prop: 'note' }
            ]
        }
    } else {
        options.value = {
            labelWidth: '100px',
            span: 12,
            list: [
                { type: 'upload', label: 'final files', prop: 'finalFiles' },
                { type: 'textarea', label: 'note', prop: 'note' }
            ]
        };
    }
}


const changeVol = (val: string) => {
    const vol = reverseStatusMapping[val]
    changeOption(vol);

};
//const initialFiles = ref({});
// open dialog by edit button
const handleEdit = (row: Customer) => {
    changeOption(row.status);
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
            type: 'string',
        },
        {
            prop: 'name',
            label: 'name',
            type: 'string',
        },
        {
            prop: 'contact',
            label: 'contact',
            type: 'string',

        },
        {
            prop: 'address',
            label: 'address',
            type: 'string',

        },
        {
            prop: 'cac',
            label: 'Channels',
            type: 'string',

        },
        {
            prop: 'salePlace',
            label: 'salePlace',
            type: 'string',

        },
        {
            prop: 'contact',
            label: 'contact',
            type: 'string',
        },
        {
            prop: 'address',
            label: 'address',
            type: 'string',
        },
        {
            prop: 'measureFiles',
            label: 'measure files',
            type: 'images'
        },
        {
            prop: 'priceRange',
            label: 'price range',
            type: 'string'
        },
        {
            prop: 'designer',
            label: 'designer',
            type: 'string'
        },
        {
            prop: 'designFiles',
            label: 'design files',
            type: 'images'
        },
        {
            prop: 'salePrice',
            label: 'sale price',
            type: 'string',
        },
        {
            prop: 'orderFiles',
            label: 'order files',
            type: 'images'
        },
        {
            prop: 'orderNote',
            label: 'order note',
            type: 'string'
        },
        {
            prop: 'finalFiles',
            label: 'final files',
            type: 'images'
        },
        {
            prop: 'note',
            label: 'note',
        },
        {
            prop: 'createdAt',
            label: 'created at',
            type: 'string',
        },
        {
            prop: 'measuredAt',
            label: 'measured at',
            type: 'string',
        },
        {
            prop: 'designedAt',
            label: 'designed at',
            type: 'string',
        },
        {
            prop: 'orderedAt',
            label: 'ordered at',
            type: 'string',
        },
        {
            prop: 'producedAt',
            label: 'produced at',
            type: 'string',
        },
        {
            prop: 'finishedAt',
            label: 'finished at',
            type: 'string',
        },

    ]
    visible1.value = true;
};

// 删除相关
const handleDelete = (row: Customer) => {

    ElMessage.success('删除成功');
}


</script>