<template>
    <div class="content">
        <el-card class="box-card">
            <h1>任务分类</h1>
            <el-form :inline="true" :model="addForm" :rules="rules" ref="ruleForm" class="demo-form-inline"
                     id="addForm">
                <el-form-item label="添加类别" prop="typeName" style="float: left">
                    <el-input v-model="addForm.typeName" placeholder="请输入新增的任务类型名称"
                    ></el-input>
                </el-form-item>
                <el-form-item style="float: left">
                    <el-button type="primary" @click="addSubmit('ruleForm')">
                        <i class="el-icon-circle-plus-outline"></i>
                        <span>点击添加</span>
                    </el-button>
                </el-form-item>
                <el-form-item class="totalNum">
                    <span>共{{ total }}条数据</span>
                </el-form-item>
            </el-form>
            <el-table
                :data="typeTable"
                style="width: 100%">
                <el-table-column
                    type="index"
                    :index="indexMethod"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="typeName"
                    label="类别名"
                    width="180"
                    align="center">
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            @click="editFormVisible = true, handleEdit(scope.row)">编辑
                        </el-button>
                        <el-button
                            size="mini"
                            type="danger"
                            @click="deleteDialogVisible = true, handleDelete(scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 编辑按钮 弹出对话框 默认不可见-->
            <el-dialog title="编辑学生信息" :visible.sync="editFormVisible">
                <el-form :model="dialogForm" :rules="rules" ref="editForm">
                    <el-form-item label="类别id" :label-width="formLabelWidth">
                        <el-input v-model="dialogForm.id" autocomplete="off" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="类别名称" :label-width="formLabelWidth" prop="typeName">
                        <el-input v-model="dialogForm.typeName" autocomplete="off" :disabled="false"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="editFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitEditForm('editForm')">确 定</el-button>
                </div>
            </el-dialog>

            <!-- 删除按钮 弹出对话框 默认不可见-->
            <el-dialog title="确定删除" :visible.sync="deleteDialogVisible" width="30%" center>
                <span v-model="dialogForm">是否要删除&nbsp;"{{ dialogForm.typeName }}"&nbsp;类别</span>
                <span slot="footer" class="dialog-footer">
                <el-button @click="deleteDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteDialogVisible = false,confirmDelete()">确 定</el-button>
            </span>
            </el-dialog>

        </el-card>
    </div>
</template>

<script>
export default {
    name: "TaskClassify",
    data() {
        return {
            typeTable: [],
            total: 0,
            addForm: {
                typeName: ''
            },
            /*判断 任务名 是否重复的返回值*/
            isRepeat: '',

            rules: {
                typeName: [
                    {required: true, message: '请输入任务名称！', trigger: 'change'}
                ]
            },
            editFormVisible: false,
            dialogForm: {
                id: '',
                typeName: ''
            },
            deleteDialogVisible: false,

            /* 设置input框前面文字长度 */
            formLabelWidth: '180px'
        }
    },
    methods: {
        /**
         * 添加类别
         * @param formName
         */
        addSubmit(formName) {
            const _this = this;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    //校验通过
                    _this.screenLoading();
                    //延时
                    setTimeout(() => {
                        _this.$axios.get('http://localhost:8081/type/confirmName?typeName=' + _this.addForm.typeName).then(function (response) {
                            console.log(response);
                            _this.isRepeat = response.data;
                            if (_this.isRepeat === 'success') {
                                //任务名不重复执行以下请求
                                _this.$axios.post('http://localhost:8081/type/addType', _this.addForm).then(function (response) {
                                    if (response.data === 'success') {
                                        _this.$message({
                                            message: '添加成功！',
                                            type: 'success',
                                            offset: 80
                                        })
                                        window.location.reload();
                                    } else {
                                        _this.$message({
                                            message: '添加失败！',
                                            type: 'error',
                                            offset: 80
                                        })
                                    }
                                })
                            } else {
                                _this.$message({
                                    message: '任务名重复！请重新输入！',
                                    type: 'error',
                                    offset: 80
                                });
                            }
                        });
                    }, 1000);
                } else {
                    return false;
                }
            })
        },
        indexMethod(index) {
            return (index + 1) * 1;
        },
        // 点击编辑按钮弹出对话框内赋值
        handleEdit(row) {
            this.dialogForm.id = row.id;
            this.dialogForm.typeName = row.typeName;
        },
        /**
         * TODO 等添加完一个任务后，修改任务类别名称时，会提示“当前有任务是此类别，是否强制修改？”
         * @param formName
         */
        submitEditForm(formName) {

        },
        // 点击删除按钮取所选学生的 id 值
        handleDelete(row) {
            this.dialogForm.id = row.id;
            this.dialogForm.typeName = row.typeName;
        },
        // 点击确认删除
        confirmDelete() {

        },

        /**
         * 延时
         */
        screenLoading() {
            const loading = this.$loading({
                lock: true,
                text: '正在添加，请稍等...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            setTimeout(() => {
                loading.close()
            }, 1000)
        },
    },
    beforeCreate() {
        const _this = this;
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
        this.$axios.get('http://localhost:8081/type/getAllTypes/1').then(function (response) {
            _this.typeTable = response.data.records;
            _this.total = response.data.total;

        })
    },
}
</script>

<style scoped>
.content {
    position: relative;
    padding: 0;
    margin: 0;
}

h1 {
    margin: 0 auto 20px;
}

.box-card {
    width: 95%;
    position: absolute;
    left: 30px;
    top: 30px;
}

.demo-form-inline {
    width: 90%;
    float: left;
    margin-left: 62px;
}

.totalNum {
    float: right;
    color: #747981;
    font-weight: 600;
}

</style>