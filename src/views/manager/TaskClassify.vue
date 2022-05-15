<template>
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
                        @click="hasTypeEdit(scope.row), handleEdit(scope.row)">编辑
                    </el-button>
                    <el-button
                        size="mini"
                        type="danger"
                        @click="hasTypeDelete(scope.row), handleDelete(scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 是否强制更改提示框-->
        <el-dialog
            title="提示"
            :visible.sync="ensureEditDialog"
            width="30%"
            center>
            <span>当前有任务是此类别，是否强制更改？</span>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="ensureEditDialog = false">取 消</el-button>
                    <el-button type="primary" @click="ensureEditDialog = false,editFormVisible = true">确 定</el-button>
                </span>
        </el-dialog>

        <!-- 编辑按钮 弹出对话框 默认不可见-->
        <el-dialog title="编辑类别" :visible.sync="editFormVisible">
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

        <!-- 是否强制删除提示框-->
        <el-dialog
            title="提示"
            :visible.sync="ensureDeleteDialog"
            width="30%"
            center>
            <span>当前有任务是此类别，是否强制删除？</span>
            <br>
            <span style="color: red"><i class="el-icon-warning"></i>删除后，当前类别的任务也会删除！！！</span>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="ensureDeleteDialog = false">取 消</el-button>
                    <el-button type="primary"
                               @click="ensureDeleteDialog = false,deleteDialogVisible = true">确 定</el-button>
                </span>
        </el-dialog>

        <!-- 删除按钮 弹出对话框 默认不可见-->
        <el-dialog title="确定删除" :visible.sync="deleteDialogVisible" width="30%" center>
            <span v-model="dialogForm">是否要删除&nbsp;"{{ dialogForm.typeName }}"&nbsp;类别</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteDialogVisible = false,confirmDelete()">确 定</el-button>
            </span>
        </el-dialog>

        <div id="pagination" style="visibility: visible">
            <el-pagination
                background
                layout="prev, pager, next"
                :page-size=pageSize
                :total=total
                :current-page=currentPage
                @current-change="changePage">
            </el-pagination>
        </div>
    </el-card>
</template>

<script>
export default {
    name: "TaskClassify",
    data() {
        return {
            typeTable: [],
            total: 0,
            pageSize: null,
            currentPage: null,
            addForm: {
                typeName: ''
            },
            /*判断 任务名 是否重复的返回值*/
            isRepeat: '',

            rules: {
                typeName: [
                    {required: true, message: '请输入任务类别名称！', trigger: 'change'}
                ]
            },

            ensureEditDialog: false,
            editFormVisible: false,
            dialogForm: {
                id: '',
                typeName: ''
            },
            ensureDeleteDialog: false,
            deleteDialogVisible: false,

            /* 设置input框前面文字长度 */
            formLabelWidth: '180px'
        }
    },
    methods: {
        changePage(currentPage) {
            const _this = this
            _this.$axios.get('http://localhost:8081/type/getAllTypes/' + currentPage).then(function (response) {
                _this.typeTable = response.data.records;
                _this.total = response.data.total;
                _this.currentPage = response.data.current;
            }, function (err) {
                console.log(err)
            })
        },
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
                                    message: '任务类别名重复！请重新输入！',
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
            index = (index + 1) + (this.currentPage - 1) * this.pageSize;
            return index
        },

        /**
         * 判断是否有当前类别的任务
         */
        hasTypeEdit(row) {
            const _this = this;
            this.$axios.get('http://localhost:8081/type/hasType?typeName=' + row.typeName).then(function (response) {
                if (response.data === 'success') {
                    _this.editFormVisible = true;
                } else if (response.data === 'error') {
                    _this.ensureEditDialog = true;
                }
            })
        },
        /**
         * 给编辑框赋值
         * @param row
         */
        handleEdit(row) {
            this.dialogForm.id = row.id;
            this.dialogForm.typeName = row.typeName;
        },
        /**
         * 更改任务类别名
         * @param formName
         */
        submitEditForm(formName) {
            const _this = this;
            _this.screenLoading2();
            setTimeout(() => {
                this.$axios.post('http://localhost:8081/type/editType', _this.dialogForm).then(function (response) {
                    if (response.data === 'success') {
                        _this.$message({
                            type: 'success',
                            message: '更改成功！',
                            offset: 80
                        })
                    } else {
                        _this.$message({
                            type: 'error',
                            message: '更改失败！',
                            offset: 80
                        })
                    }
                })
            }, 1000);
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        },

        /**
         * 判断是否有当前类别的任务
         */
        hasTypeDelete(row) {
            const _this = this;
            this.$axios.get('http://localhost:8081/type/hasType?typeName=' + row.typeName).then(function (response) {
                if (response.data === 'success') {
                    _this.deleteDialogVisible = true;
                } else if (response.data === 'error') {
                    _this.ensureDeleteDialog = true;
                }
            })
        },
        // 点击删除按钮取所选学生的 id 值
        handleDelete(row) {
            this.dialogForm.id = row.id;
            this.dialogForm.typeName = row.typeName;
        },

        /**
         * 删除任务类别
         */
        confirmDelete() {
            const _this = this;
            _this.screenLoading3();
            setTimeout(() => {
                this.$axios.post('http://localhost:8081/type/deleteType', _this.dialogForm).then(function (response) {
                    console.log(response);
                    if (response.data === 'success') {
                        _this.$message({
                            type: 'success',
                            message: '删除成功！',
                            offset: 80
                        })
                    } else {
                        _this.$message({
                            type: 'error',
                            message: '删除失败！',
                            offset: 80
                        })
                    }
                })
            }, 1000);
            setTimeout(() => {
                window.location.reload();
            }, 3000);
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
        screenLoading2() {
            const loading = this.$loading({
                lock: true,
                text: '正在修改，请稍等...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            setTimeout(() => {
                loading.close()
            }, 1000)
        },
        screenLoading3() {
            const loading = this.$loading({
                lock: true,
                text: '正在删除，请稍等...',
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
            console.log(response);
            _this.typeTable = response.data.records;
            _this.total = response.data.total;
            _this.pageSize = response.data.size;
            _this.currentPage = response.data.current;
        })
    },
}
</script>

<style scoped>

h1 {
    margin: 0 auto 20px;
}

.box-card {
    width: 95%;
    position: absolute;
    left: 30px;
    top: 30px;
    padding: 0;
    margin: 0;
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