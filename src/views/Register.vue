<template>
    <div class="background">
        <el-card class="box-card" shadow="always">
            <el-form :model="registerForm" status-icon :rules="rules" ref="registerForm" label-width="100px"
                     class="demo-ruleForm">
                <h1>注&nbsp;&nbsp;&nbsp;&nbsp;册</h1>
                <el-link :underline="false" style="margin-bottom: 10px" @click="toLoginPage">
                    点我回登录页噢~
                </el-link>
                <el-form-item label="账号" prop="account">
                    <el-input prefix-icon="el-icon-user" type="text" v-model="registerForm.account"
                              autocomplete="off" @change="confirmAcc(registerForm.account)"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input prefix-icon="el-icon-key" type="password" v-model="registerForm.password"
                              autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                    <el-input prefix-icon="el-icon-key" type="password" v-model="registerForm.checkPass"
                              autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="选择身份">
                    <el-radio-group v-model="registerForm.auth_id">
                        <el-radio label="3" border>学生</el-radio>
                        <el-radio label="2" border>老师</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item class="el-form-item-button-register">
                    <el-button type="primary" @click="submitForm('registerForm')">提交</el-button>
                    <el-button type="primary" @click="resetForm('registerForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.registerForm.checkPass !== '') {
                    this.$refs.registerForm.validateField('checkPass');
                }
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.registerForm.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            registerForm: {
                account: '',
                password: '',
                checkPass: '',
                auth_id: ''
            },
            rules: {
                pass: [
                    {validator: validatePass, trigger: 'blur'}
                ],
                checkPass: [
                    {validator: validatePass2, trigger: 'blur'}
                ]
            }
        };
    },
    methods: {
        /*去登录页*/
        toLoginPage() {
            this.$router.push("/");
        },
        confirmAcc(account){
            this.$axios.get("http://localhost:8081/register/confirmAcc?account="+account).then(function (response) {
                console.log(response);
                if (response.data === 'OK'){

                }
            },function (err) {
                alert(err);
            })
        },
        /*提交*/
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    alert('submit!');
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        /*重置*/
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }
}
</script>

<style>
@import "/src/css/login.css";
</style>