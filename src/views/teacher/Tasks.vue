<template>
    <div class="content">
        <el-card class="box-card">
            <el-form :inline="true" :model="searchForm" class="demo-form-inline" id="searchForm">
                <el-form-item label="查询任务" style="float: left">
                    <el-input v-model="searchForm.realName" placeholder="请输入任务名称"></el-input>
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
                    :data="taskList"
                    :cell-style="cellStyle"
                    border
                    style="width: 90%;margin: 0 auto;font-size: 16px"
                >
                    <el-table-column
                        fixed
                        prop="taskName"
                        label="任务名称"
                        align="center"
                        width="170">
                    </el-table-column>
                    <el-table-column
                        id="student"
                        prop="realName"
                        label="学生"
                        align="center"
                        sortable
                        width="150">
                    </el-table-column>
                    <el-table-column
                        prop="taskDes"
                        label="任务描述"
                        align="center"
                        width="200">
                    </el-table-column>
                    <el-table-column
                        prop="typename"
                        label="任务类型"
                        align="center"
                        sortable
                        width="120">
                    </el-table-column>
                    <el-table-column
                        prop="status"
                        label="任务状态"
                        align="center"
                        sortable
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="priority"
                        label="任务优先级"
                        align="center"
                        sortable
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="startTime"
                        :formatter="toDate"
                        label="开始日期"
                        align="center"
                        sortable
                        width="150">
                    </el-table-column>
                    <el-table-column
                        prop="deadline"
                        :formatter="toDate"
                        label="截至日期"
                        align="center"
                        sortable
                        width="150">
                    </el-table-column>
                    <el-table-column label="操作" align="center" fixed="right" width="260">
                        <template slot-scope="scope">
                            <el-button
                                size="mini" type="primary"
                                @click="addStudent(scope.row)">分配任务
                            </el-button>
                            <el-button
                                size="mini" type="primary"
                                @click="acceptance(scope.row)">验收任务
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <!-- 分配任务按钮 弹出对话框 默认不可见-->
            <el-dialog title="分配给学生" :visible.sync="studentFormVisible">
                <el-form :model="studentForm" ref="studentForm" :rules="rules">
                    <el-form-item label="选择学生" prop="realName">
                        <el-select v-model="studentForm.realName" clearable placeholder="请选择一位学生" @focus="getStudent">
                            <el-option
                                v-for="item in student"
                                :key="item.id"
                                :label="item.realName"
                                :value="item.realName">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="studentFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitForm('studentForm')">确 定</el-button>
                </div>
            </el-dialog>

            <div id="pagination" style="visibility: visible">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :page-size=pageSize
                    :total=total
                    @current-change="changePage">
                </el-pagination>
            </div>
        </el-card>
    </div>
</template>

<script>
import moment from "moment";

export default {
    name: "tasks",
    data() {
        return {
            // 搜索框
            searchForm: {
                realName: '',
                account: localStorage.getItem('account')
            },
            taskList: [],
            total: 0,
            pageSize: null,

            tid: localStorage.getItem('tid'),
            account: localStorage.getItem('account'),

            studentFormVisible: false,

            studentForm: {
                taskName: '',
                realName: ''
            },
            rules: {
                sid: [
                    {required: true, message: '请选择学生！', trigger: blur}
                ]
            },
            student: [],
            formLabelWidth: '180px'
        }
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
            if (localStorage.getItem('role') !== '2') {
                _this.$message({
                    message: '老师才能进入此页面！',
                    type: 'error',
                    offset: '80'
                })
                _this.$router.push('/403');
            }
        }
    },
    created: function () {
        const _this = this;
        this.$axios.get('http://localhost:8081/tasks/getTasks/1?account=' + _this.account).then(function (response) {
            _this.taskList = response.data.records;
            _this.pageSize = response.data.size;
            _this.total = response.data.total;
            for (let i = 0; i < _this.taskList.length; i++) {
                if (_this.taskList[i].realName === null) {
                    _this.taskList[i].realName = "该任务尚未分配给学生！";
                }
            }
        })
    },
    methods: {
        search() {
            const _this = this
            /* 当输入空值时，执行 查询全部并分页操作 */
            if (_this.searchForm.realName === '') {
                _this.$axios.get('http://localhost:8081/tasks/getTasks/1?account=' + _this.account).then(function (res) {
                    _this.pageSize = res.data.size;
                    _this.taskList = res.data.records;
                    _this.total = res.data.total;
                    for (let i = 0; i < _this.taskList.length; i++) {
                        console.log(_this.taskList[i].realName);
                        if (_this.taskList[i].realName === null) {
                            _this.taskList[i].realName = "该任务尚未分配给学生！";
                        }
                    }
                })
            } else {
                _this.$axios.post('http://localhost:8081/tasks/searchTask/1', _this.searchForm).then(function (res) {
                    console.log(res)
                    _this.pageSize = res.data.size;
                    _this.taskList = res.data.records;
                    _this.total = res.data.total;
                    for (let i = 0; i < _this.taskList.length; i++) {
                        console.log(_this.taskList[i].realName);
                        if (_this.taskList[i].realName === null) {
                            _this.taskList[i].realName = "该任务尚未分配给学生！";
                        }
                    }
                })
            }
        },

        /* 翻页函数 */
        changePage(currentPage) {
            const _this = this
            _this.$axios.post('http://localhost:8081/tasks/searchTask/' + currentPage, _this.searchForm).then(function (response) {
                _this.taskList = response.data.records;
                _this.total = response.data.total;
                for (let i = 0; i < _this.taskList.length; i++) {
                    console.log(_this.taskList[i].realName);
                    if (_this.taskList[i].realName === null) {
                        _this.taskList[i].realName = "该任务尚未分配给学生！";
                    }
                }
            }, function (err) {
                console.log(err)
            })
        },

        addStudent(row) {
            const _this = this;
            console.log(row);
            if (row.realName !== '该任务尚未分配给学生！') {
                _this.$message({
                    message: '此任务已被分配！',
                    type: 'warning',
                    offset: 80
                })
            } else {
                _this.studentForm.taskName = row.taskName;
                _this.studentFormVisible = true;
            }
        },

        getStudent() {
            const _this = this;
            this.$axios.get('http://localhost:8081/tasks/getStudent?tid=' + _this.tid).then(function (response) {
                _this.student = response.data;
            })
        },

        submitForm(formName) {
            const _this = this;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    console.log(_this.studentForm)
                    _this.$axios.post('http://localhost:8081/tasks/addStudent', _this.studentForm).then(function (response) {
                        console.log(response);
                        if (response.data.code === 200) {
                            _this.$message({
                                type: 'success',
                                message: '分配成功！',
                                offset: 80
                            })
                            setTimeout(() => {
                                window.location.reload();
                            }, 3000)
                        } else if (response.data.msg === 'error') {
                            _this.$message({
                                type: 'error',
                                message: '分配失败！',
                                offset: 80
                            })
                        }
                    })
                } else {
                    return false;
                }
            });
        },

        /**
         * 验收任务
         * @param row
         */
        acceptance(row) {

        },

        cellStyle({row, column, rowIndex, columnIndex}) {
            const _this = this;
            let localDate = new Date().toLocaleDateString();
            // 状态列字体颜色
            if (row.realName === '该任务尚未分配给学生！' && columnIndex == 1) {
                return {color: '#EA0000'};
            } else {
                return {color: '#1a1a1b'};
            }
        },


        toDate(row, column, cellValue) {
            return cellValue
                ? moment(cellValue).format('YYYY-MM-DD')
                : ''
        },

        compareDate(dateTime1, dateTime2) {
            let formatDate1 = new Date(dateTime1);
            let formatDate2 = new Date(dateTime2);
            if (formatDate1 > formatDate2) {
                return formatDate1;
            } else {
                return formatDate2;
            }
        }

    }
}
</script>

<style scoped>
h1 {
    margin: 0 auto 20px;
}

.demo-form-inline {
    width: 90%;
    float: left;
    margin-left: 62px;
}

.el-form-item {
    right: 0;
}

.table {

    margin: 20px 0 20px;
}

#pagination {
    position: absolute;
    top: 550px;
    left: 550px;
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

.testColor {
    color: #ea0000;
}
</style>