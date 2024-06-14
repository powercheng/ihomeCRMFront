<template>
    <div class="login-bg">
        <div class="login-container">
            <div class="login-header">
                <img class="logo mr10" src="../../assets/img/logo.svg" alt="" />
                <div class="login-title">Customer Management</div>
            </div>
            <el-form :model="param" :rules="rules" ref="register" size="large">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="username">
                        <template #prepend>
                            <el-icon>
                                <User />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="password"
                        v-model="param.password"
                        @keyup.enter="submitForm(register)"
                    >
                        <template #prepend>
                            <el-icon>
                                <Lock />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="email">
                    <el-input v-model="param.email" placeholder="email">
                        <template #prepend>
                            <el-icon>
                                <User />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="region" prop="region">
                        <el-select v-model="param.region" placeholder="please choose">
                            <el-option key="1" label="san francisco" value="1"></el-option>
                            <el-option key="2" label="san jose" value="2"></el-option>
                            <el-option key="3" label="sacramento" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                <el-button class="login-btn" type="primary" size="large" @click="submitForm(register)">Create an Account</el-button>
                <p class="login-text">
                    Already have an account<el-link type="primary" @click="$router.push('/login')">Sign in</el-link>
                </p>
            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { Register } from '@/types/user';
import axios from 'axios';
const router = useRouter();
const param = reactive<Register>({
    username: '',
    password: '',
    email:'',
    region: '',
});

const rules: FormRules = {
    username: [
        {
            required: true,
            message: 'please input username',
            trigger: 'blur',
        },
    ],
    password: [{ required: true, message: 'please input password', trigger: 'blur' }],
    name: [{ required: true, message: 'please input name', trigger: 'blur' }],
    region: [{ required: true, message: 'please choose region', trigger: 'blur' }],
};
const register = ref<FormInstance>();
const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate(async (valid: boolean) => {
        if (valid) {
                const { username, password, email, region } = param;                
                const response = await axios.post('/register', {
                    username: username,
                    password: password,
                    email: email,
                    region: region
                });
                ElMessage.success('success');
                router.push('/login');
        }
    });
};
</script>

<style scoped>
.login-bg {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
    background: url(../../assets/img/login-bg.jpg) center/cover no-repeat;
}

.login-header {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 40px;
}

.logo {
    width: 35px;
}

.login-title {
    font-size: 22px;
    color: #333;
    font-weight: bold;
}

.login-container {
    width: 450px;
    border-radius: 5px;
    background: #fff;
    padding: 40px 50px 50px;
    box-sizing: border-box;
}

.login-btn {
    display: block;
    width: 100%;
}

.login-text {
    display: flex;
    align-items: center;
    margin-top: 20px;
    font-size: 14px;
    color: #787878;
}
</style>
