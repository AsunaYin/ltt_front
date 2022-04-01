<template>
    <div class="background">
        <el-card class="box-card" shadow="always">
            <el-form :model="loginForm" ref="loginForm" label-width="100px" class="demo-ruleForm">
                <h1>登&nbsp;&nbsp;&nbsp;&nbsp;录</h1>
                <br/>
                <el-form-item label="账号" prop="account" class="el-form-item">
                    <el-input prefix-icon="el-icon-user" v-model="loginForm.account"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password" class="el-form-item">
                    <el-input prefix-icon="el-icon-key" type="password" v-model="loginForm.password"></el-input>
                </el-form-item>
                <!--                <el-form-item label="验证码" prop="code" class="el-form-item">-->
                <!--                    <el-input prefix-icon="el-icon-copy-document" v-model="loginForm.code"-->
                <!--                              style="width: 172px;float: left"></el-input>-->
                <!--                    <el-image :src="captchaImg" class="captchaImg" @click="getCaptcha"></el-image>-->
                <!--                </el-form-item>-->
                <el-form-item class="el-form-item-button-login">
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
                password: '',
                // code: '',
                // token: ''
            },
            // captchaImg: '',
            alert: false,
        };
    },
    methods: {
        // getCaptcha() {
        //     const _this = this;
        //     this.$axios.get('http://localhost:8081/captcha').then(function (response) {
        //         console.log(response);
        //         _this.loginForm.token = response.data.data.key;
        //         _this.captchaImg = response.data.data.captchaImg;
        //     })
        // },
        toRegister() {
            this.$router.push("/register");
        },
        login() {
            const _this = this;
            this.screenLoading();
            //设置延时
            setTimeout(() => {
                if (_this.loginForm.account === '') {
                    _this.$message.error('账号不能为空！');
                } else {
                    _this.$axios.post("http://localhost:8081/login", _this.loginForm).then(function (response) {
                        console.log(response);
                        if (response.data.msg === '认证成功') {
                            //把用户名存入 localStorage
                            localStorage.setItem('account', _this.loginForm.account);
                            _this.loginSuccess();
                            _this.$router.push("/home");
                        } else {
                            _this.loginError();
                        }

                    })
                }
            }, 1000)
        },
        screenLoading() {
            const loading = this.$loading({
                lock: true,
                text: '正在验证账号与密码，请稍等...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            setTimeout(() => {
                loading.close();
            }, 1000);
        },
        loginSuccess() {
            this.$message({
                message: '登录成功！',
                type: 'success',
                offset: '80'
            })
        },
        loginError() {
            this.$message({
                message: '登录失败！请检查您的账号或密码！',
                type: 'error'
            })
        }
    }
//     created() {
//         this.getCaptcha();
//     }
}
</script>

<style>
@import "/src/css/login.css";
</style>
