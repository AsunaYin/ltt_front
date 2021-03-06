<template>
    <div class="content">
        <el-card class="box-card">
            <h1>学生列表</h1>
            <el-form :inline="true" :model="searchForm" class="demo-form-inline" id="searchForm">
                <el-form-item label="查询学生：" style="float: left">
                    <el-input v-model="searchForm.realName" placeholder="请输入真实姓名"></el-input>
                </el-form-item>
                <el-form-item style="float: left">
                    <el-button type="primary" @click="search">
                        <i class="el-icon-search"></i>
                        <span>查询</span>
                    </el-button>
                </el-form-item>
                <el-form-item class="totalNum">
                    <span>共{{ total }}条数据</span>
                </el-form-item>
            </el-form>
            <div class="table">
                <el-table
                    id="formTable"
                    :data="studentList"
                    stripe
                    style="width: 90%;margin: 0 auto"
                >
                    <el-table-column
                        type="index"
                        label="序号"
                        :index="indexMethod"
                        width="50"
                        align="center"
                        fixed="left">
                    </el-table-column>
                    <el-table-column
                        prop="account"
                        label="账号"
                        align="center"
                        width="170">
                    </el-table-column>
                    <el-table-column
                        prop="realName"
                        label="真实姓名"
                        sortable
                        align="center"
                        width="150">
                    </el-table-column>
                    <el-table-column
                        prop="sex"
                        label="性别"
                        sortable
                        align="center"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="phone"
                        label="电话"
                        align="center"
                        width="200">
                    </el-table-column>
                    <el-table-column
                        prop="birthDate"
                        :formatter="toDate"
                        label="出生日期"
                        sortable
                        align="center"
                        width="150">
                    </el-table-column>
                    <el-table-column
                        prop="registDate"
                        :formatter="toDate"
                        label="注册日期"
                        align="center"
                        width="150">
                    </el-table-column>
                    <el-table-column label="操作" align="center" fixed="right" width="200">
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                @click="dialogFormVisible = true, handleEdit(scope.row)">编辑
                            </el-button>
                            <el-button
                                size="mini"
                                type="danger"
                                @click="centerDialogVisible = true, handleDelete(scope.row)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div id="pagination" style="visibility: visible">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :page-size=pageSize
                    :total=total
                    @current-change="changePage">
                </el-pagination>
            </div>

            <!-- 编辑按钮 弹出对话框 默认不可见-->
            <el-dialog title="编辑学生信息" :visible.sync="dialogFormVisible">
                <el-form :model="form" :rules="rules" ref="form">
                    <el-form-item label="当前学生顺序编号" :label-width="formLabelWidth">
                        <el-input v-model="form.id" autocomplete="off" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="当前账号" :label-width="formLabelWidth" prop="account">
                        <el-input v-model="form.account" autocomplete="off" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="请输入真实姓名" :label-width="formLabelWidth" prop="realName">
                        <el-input v-model="form.realName" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="请输入性别" :label-width="formLabelWidth" prop="sex">
                        <el-radio v-model="form.sex" label="男">男</el-radio>
                        <el-radio v-model="form.sex" label="女">女</el-radio>
                    </el-form-item>
                    <el-form-item label="请输入联系电话" :label-width="formLabelWidth" prop="phone">
                        <el-input v-model="form.phone" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitForm('form')">确 定</el-button>
                </div>
            </el-dialog>

            <!-- 删除按钮 弹出对话框 默认不可见-->
            <el-dialog title="确定删除" :visible.sync="centerDialogVisible" width="30%" center>
                <span v-model="form">是否要删除“{{ form.account }}”用户</span>
                <span slot="footer" class="dialog-footer">
                <el-button @click="centerDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="centerDialogVisible = false,confirmDelete()">确 定</el-button>
            </span>
            </el-dialog>

        </el-card>
    </div>
</template>

<script>
import moment from 'moment'

export default {
    data() {
        return {
            // 搜索框
            searchForm: {
                realName: ''
            },

            studentList: [],
            total: 0,
            pageSize: null,
            currentPage: null,

            // 校验规则
            rules: {
                realName: [
                    {required: true, message: '姓名不能为空', trigger: 'blur'},
                    {min: 2, max: 10, message: '姓名长度为2~10', trigger: 'blur'}
                ],
                phone: [
                    {required: true, message: '请输入联系电话', trigger: 'blur'},
                    {pattern: /^1[3456789]\d{9}$/, message: '手机格式不正确', trigger: 'blur'}
                ]
            },

            /* 默认对话框和表单不可见 */
            dialogTableVisible: false,
            dialogFormVisible: false,
            centerDialogVisible: false,
            form: {
                id: '',
                account: '',
                realName: '',
                sex: '',
                phone: ''
            },

            /* 设置input框前面文字长度 */
            formLabelWidth: '180px'

        }
    },
    // 判断是否登录 与 权限是否足够
    beforeCreate() {
        const _this = this
        if (localStorage.getItem('role') === null) {
            _this.$message({
                message: '请先登录！',
                type: 'error',
                offset: '80'
            })
            _this.$router.push('/login')
        } else {
            if (localStorage.getItem('role') !== '1') {
                _this.$message({
                    message: '您的权限不足！',
                    type: 'error',
                    offset: '80'
                })
                _this.$router.push('/401')
            }
        }
    },
    created() {
        const _this = this;
        this.$axios.get('http://localhost:8081/user/student/getAllStudents/1').then(function (response) {
            // console.log(response);
            _this.pageSize = response.data.size
            _this.studentList = response.data.records
            _this.total = response.data.total
            _this.currentPage = response.data.current;
        }), function (err) {
            console.log(err)
        }
    },
    mounted() {
        const formWidth = document.getElementById('formTable').style.width
        document.getElementById('searchForm').style.width = formWidth
    },
    methods: {
        indexMethod(index) {
            index = (index + 1) + (this.currentPage - 1) * this.pageSize;
            return index
        },
        // 查询学生
        search() {
            const _this = this
            /* 当输入空值时，执行 查询全部并分页操作 */
            if (_this.searchForm.realName === '') {
                _this.$axios.get('http://localhost:8081/user/student/getAllStudents/1').then(function (res) {
                    // console.log(res);
                    _this.pageSize = res.data.size
                    _this.studentList = res.data.records
                    _this.total = res.data.total
                    _this.currentPage = response.data.current;
                })
            } else {
                _this.$axios.post('http://localhost:8081/user/student/searchStudent/1', _this.searchForm).then(function (res) {
                    console.log(res)
                    _this.pageSize = res.data.size
                    _this.studentList = res.data.records
                    _this.total = res.data.total
                    _this.currentPage = response.data.current;
                })
            }
        },

        // 点击编辑按钮弹出对话框内赋值
        handleEdit(row) {
            this.form.id = row.id
            this.form.account = row.account
            this.form.realName = row.realName
            this.form.sex = row.sex
            this.form.phone = row.phone
        },

        // 修改→提交
        submitForm(formName) {
            const _this = this
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    _this.$axios.post('http://localhost:8081/user/student/updateStudentInfo', _this.form).then(function (response) {
                        if (response.data === 'success') {
                            window.location.reload()
                            _this.$message({
                                message: '更改成功',
                                type: 'success',
                                offset: 80
                            })
                            _this.dialogFormVisible = false
                        } else if (response.data === 'phone_duplicate') {
                            _this.$message({
                                message: '手机号已重复！请重新输入！',
                                type: 'error',
                                offset: 80
                            })
                        } else {
                            _this.$message({
                                message: '更改失败',
                                type: 'error',
                                offset: 80
                            })
                        }
                    })
                } else {
                    _this.$message({
                        message: '请确保全部字段符合规则！',
                        type: 'error',
                        offset: 80
                    })
                    return false
                }
            })
        },

        // 点击删除按钮取所选学生的 id 值
        handleDelete(row) {
            // console.log(row.id)
            this.form.id = row.id
            this.form.account = row.account
        },
        // 点击确认删除
        confirmDelete() {
            const _this = this
            this.$axios.post('http://localhost:8081/user/student/deleteStudentById', _this.form).then(function (response) {
                window.location.reload()
            })
        },

        /* 翻页函数 */
        changePage(currentPage) {
            const _this = this
            _this.$axios.post('http://localhost:8081/user/student/searchStudent/' + currentPage, _this.searchForm).then(function (response) {
                _this.studentList = response.data.records
                _this.total = response.data.total
                _this.currentPage = response.data.current;
            }, function (err) {
                console.log(err)
            })
        },

        toDate(row, column, cellValue) {
            return cellValue
                ? moment(cellValue).format('YYYY-MM-DD')
                : ''
        },

        screenLoading() {
            const loading = this.$loading({
                lock: true,
                text: '正在验证账号与密码，请稍等...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            setTimeout(() => {
                loading.close()
            }, 1000)
        },

    }

}
</script>

<style scoped>

h1 {
    margin: 0 auto 20px;
}

.demo-form-inline {
    float: left;
    margin-left: 62px;
}

.el-form-item {
    right: 0;
}

.table {
    height: 450px;
    margin: 20px 0 20px;
}

#pagination {
    padding-top: 60px;
}

.content {
    position: relative;
    padding: 0;
    margin: 0;
}

.totalNum {
    float: right;
    color: #747981;
    font-weight: 600;
}

.box-card {
    width: 95%;
    height: 700px;
    position: absolute;
    left: 30px;
    top: 30px;
}
</style>
