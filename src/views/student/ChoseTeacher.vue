<template>
    <div class="content">
        <h1>请选择一位老师</h1>
        <el-table
            :data="teacherList"
            stripe
            style="width: 100%">
            <el-table-column
                prop="avatarUrl"
                label="头像"
                width="180"
                align="center">
                <template slot-scope="scope">
                    <img :src="scope.row.avatarUrl" style="width: 100px;height: 100px;border-radius: 50%">
                </template>
            </el-table-column>
            <el-table-column
                prop="realName"
                label="姓名"
                width="180"
                align="center">
            </el-table-column>
            <el-table-column
                prop="sex"
                label="性别"
                align="center">
            </el-table-column>
            <el-table-column
                prop="phone"
                label="联系电话"
                align="center">
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="primary"
                        plain
                        @click="handleSure(scope.row)">选择
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div id="pagination" style="visibility: visible">
            <el-pagination
                background
                layout="prev, pager, next"
                :page-size=pageSize
                :total=total
                @current-change="changePage">
            </el-pagination>
        </div>

        <!-- 选择按钮 弹出对话框 默认不可见-->
        <el-dialog title="确定选择此老师吗" :visible.sync="centerDialogVisible" width="30%" center>
            <span v-model="form">是否要选择“{{ form.realName }}”老师？</span>
            <br>
            <span>选择后需等待老师审核</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="centerDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="centerDialogVisible = false,confirmChose()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'ChoseTeacher',
    data() {
        return {
            teacherList: [{
                avatarUrl: '',
                realName: '',
                sex: '',
                phone: ''
            }],
            total: null,
            pageSize: null,

            centerDialogVisible: false,

            form: [{
                realName: ''
            }],

            relationForm: {
                sid: localStorage.getItem('sid'),
                tid: ''
            },

            searchForm: {
                realName: ''
            },
        }
    },
    //只能学生进入此页面
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
            if (localStorage.getItem('role') !== '3') {
                _this.$message({
                    message: '只有学生才能进入此页面！',
                    type: 'error',
                    offset: '80'
                })
                _this.$router.push('/403')
            } else {
                if (localStorage.getItem('tid') !== 'null'){
                    _this.$message({
                        message: '您已经选好老师了！',
                        type: 'warning',
                        offset: '80'
                    })
                    _this.$router.push('/myTeacher')
                }
            }
        }
    },
    created() {
        const _this = this;
        this.$axios.get('http://localhost:8081/student/ct/getTeachers/1').then(function (response) {
            _this.pageSize = response.data.size;
            _this.teacherList = response.data.records;
            _this.total = response.data.total;
        }), function (err) {
            console.log(err)
        }
    },
    methods: {
        /* 翻页函数 */
        changePage (currentPage) {
            const _this = this;
            _this.$axios.post('http://localhost:8081/user/teacher/searchTeacher/' + currentPage, _this.searchForm, {headers:{'Content-Type':'application/json'}}).then(function (response) {
                _this.teacherList = response.data.records;
                _this.total = response.data.total;
            }, function (err) {
                console.log(err);
            })
        },
        handleSure(row) {
            if (localStorage.getItem('result') === '0'){
                this.$message({
                    message: '您已经选择了一位老师！请等待申请结果！',
                    type: 'warning',
                    offset: 80
                })
            } else {
                this.centerDialogVisible = true;
                this.form.realName = row.realName;
                this.relationForm.tid = row.id;
            }
        },
        confirmChose() {
            const _this = this;
            this.$axios.post('http://localhost:8081/student/ct/confirm/', _this.relationForm).then(function (response) {
                console.log(response)
                if (response.data.type === 'success'){
                    localStorage.setItem('result',response.data.result);
                    _this.$message({
                        message: '选择成功！等待老师审核！',
                        type: 'success',
                        offset: 80
                    })
                } else {
                    _this.$message({
                        message: '选择失败！',
                        type: 'error',
                        offset: 80
                    })
                }
            })
        }
    }
}
</script>

<style scoped>
.content {
    position: relative;
    padding: 0;
    margin: 0;
}
</style>
