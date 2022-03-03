<template>
    <el-card class="box-card">
        <el-form :model="loginForm" ref="loginForm" label-width="100px" class="demo-ruleForm">
            <h1>登&nbsp;&nbsp;&nbsp;&nbsp;录</h1>
            <br/>
            <el-form-item label="账号" prop="account">
                <el-input v-model="loginForm.account"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="loginForm.password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="login()">登录</el-button>
                <el-button type="primary" @click="toRegister">注册</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>

export default {
    name: "Login",
    data() {
        return {
            loginForm: {
                account: '',
                password: ''
            },
            alert: false
        };
    },
    methods: {
        toRegister() {
            this.$router.push("/register");
        },
        login() {
            const _this = this;
            if (this.loginForm.account == '') {
                this.$message.error('账号不能为空！');
            } else {
                this.$axios.post("http://localhost:8081/login", this.loginForm).then(function (response) {
                    console.log(response);
                    if (response.data == "OK") {
                        _this.$router.push("/index");
                    } else {
                        _this.$message.error('账号或密码错误！');
                    }
                })
            }
        }
    }
}
</script>

<style>
.box-card {

}
</style>
