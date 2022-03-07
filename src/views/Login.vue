<template>
    <div class="background">
        <el-card class="box-card" shadow="always">
            <el-form :model="loginForm" ref="loginForm" label-width="100px" class="demo-ruleForm">
                <h1>登&nbsp;&nbsp;&nbsp;&nbsp;录</h1>
                <br/>
                <el-form-item prop="account" class="el-form-item">
                    <el-input prefix-icon="el-icon-user" v-model="loginForm.account"></el-input>
                </el-form-item>
                <el-form-item prop="password" class="el-form-item">
                    <el-input prefix-icon="el-icon-key" type="password" v-model="loginForm.password"></el-input>
                </el-form-item>
                <el-form-item class="el-form-item-button">
                    <el-button type="primary" @click="login()">登录</el-button>
                    <el-button type="primary" @click="toRegister">注册</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
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
            if (this.loginForm.account === '') {
                this.$message.error('账号不能为空！');
            } else {
                this.$axios.post("http://localhost:8081/login", this.loginForm).then(function (response) {
                    if (response.data === "manager") {
                        _this.$router.push("/managerMain");
                    } else if (response.data === "teacher") {
                        _this.$router.push("/teacherMain");
                    } else if (response.data === "student") {
                        _this.$router.push("/studentMain");
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
@import "/src/css/login.css";
</style>