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
  data () {
    /**
         * 校验密码是否输入
         * @param rule
         * @param value
         * @param callback
         */
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.registerForm.checkPass !== '') {
          this.$refs.registerForm.validateField('checkPass')
        }
        callback()
      }
    }

    /**
         * 二次校验密码是否相同
         * @param rule
         * @param value
         * @param callback
         */
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    /**
         * 检验账号是否存在特殊字符
         * @param rule
         * @param value
         * @param callback
         */
    const validateSpecialChar = (rule, value, callback) => {
      const reg = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]")
      if (reg.test(value)) {
        callback(new Error('不能包含特殊字符！'))
      } else {
        callback()
      }
    }

    return {
      registerForm: {
        account: '',
        password: '',
        checkPass: '',
        auth_id: '3' // 默认选中学生
      },
      rules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { validator: validateSpecialChar, trigger: 'blur' },
          { min: 5, max: 16, message: '账号必须为5~16位', trigger: 'blur' }

        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' },
          { min: 5, max: 16, message: '密码必须为5~16位', trigger: 'blur' }
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ],
        auth_id: [
          { required: true, message: '请选择身份', trigger: 'blur' }
        ]
      },
      isRepeat: '' // 判断账号是否重复的返回值
    }
  },
  methods: {
    /**
         * 去登录页
         */
    toLoginPage () {
      this.$router.push('/')
    },

    /**
         * 判断账号是否已经存在
         * @param account
         */
    confirmAcc (account) {
      const _this = this
      this.$axios.get('http://localhost:8081/register/confirmAcc?account=' + account).then(function (response) {
        // console.log(response);
        if (response.data === 'error') {
          _this.$message.error('账号已存在！请重新输入！')
        }
        _this.isRepeat = response.data
      }, function (err) {
        alert(err)
      })
    },

    /**
         * 提交信息
         * 在提交之前会判断输入的账号是否已存在，若存在则不会提交请求
         * @param formName
         */
    submitForm (formName) {
      const _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 字段验证成功，执行以下内容
          if (_this.isRepeat === 'success') {
            // 若账号不存在，则提交请求
            _this.$axios.post('http://localhost:8081/register/submit', _this.registerForm).then(function (response) {
              // console.log(response)
              if (response.data === 'success') {
                // 后台注册成功，回到登录页
                _this.toLoginPage()
                _this.$message({
                  message: '注册成功！',
                  type: 'success'
                })
              }
            }), function (err) {
              console.log(err)
            }
          } else {
            // 若账号已存在，弹出错误信息
            _this.$message.error('账号已存在！请重新输入！')
          }
        } else {
          // 验证失败
          return false
        }
      })
    },

    /**
         * 重置输入框内容
         * @param formName
         */
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  },
  created () {
    localStorage.removeItem('account')
    localStorage.removeItem('role')
  }
}
</script>

<style>
@import "/src/css/login.css";
</style>
