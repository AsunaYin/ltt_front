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
                    stripe
                    style="width: 90%;margin: 0 auto;font-size: 16px"
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
                        fixed
                        prop="taskName"
                        label="任务名称"
                        align="center"
                        width="200">
                    </el-table-column>
                    <el-table-column
                        id="student"
                        prop="realName"
                        label="学生"
                        align="center"
                        sortable
                        width="200">
                        <template slot-scope="scope">
                            <div v-if="scope.row.realName === null" slot="reference" class="name-wrapper">
                                <el-tag type="danger">未分配给学生！</el-tag>
                            </div>
                            <div v-else>
                                {{scope.row.realName}}
                            </div>
                        </template>
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
                        <template slot-scope="scope">
                            <div slot="reference" class="name-wrapper">
                                <el-tag>{{ scope.row.typename }}</el-tag>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="status"
                        label="任务状态"
                        align="center"
                        sortable
                        width="120">
                        <template slot-scope="scope">
                            <div slot="reference" class="name-wrapper">
                                <el-tag :type="scope.row.status === '未开始' ? 'info' : scope.row.status === '已开始' ? 'primary' : scope.row.status === '待审核' ? 'warning' : scope.row.status === '已完成' ? 'success' : 'danger'">
                                    {{ scope.row.status }}
                                </el-tag>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="priority"
                        label="任务优先级"
                        align="center"
                        sortable
                        width="130">
                        <template slot-scope="scope">
                            <div slot="reference" class="name-wrapper">
                                <el-tag :type="scope.row.priority === '低' ? 'info' : scope.row.priority === '中' ? 'warning' : 'danger'">
                                    {{ scope.row.priority }}
                                </el-tag>
                            </div>
                        </template>
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
                    <el-table-column label="操作" align="center" fixed="right" width="300">
                        <template slot-scope="scope">
                            <el-button
                                size="mini" type="primary"
                                @click="addStudent(scope.row)">分配任务
                            </el-button>
                            <el-button
                                size="mini" type="primary"
                                @click="acceptance(scope.row)">验收任务
                            </el-button>
                            <el-button
                                size="mini" type="primary"
                                @click="editTaskForm = true,editTask(scope.row)">编辑任务
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

            <!-- 验收任务按钮 弹出对话框 默认不可见-->
            <el-dialog title="验收当前任务" :visible.sync="acceptanceFormVisible">
                <el-descriptions title="详细信息" :column="3" border>
                    <el-descriptions-item label="任务名称">
                        {{ taskInfo.taskName }}
                    </el-descriptions-item>
                    <el-descriptions-item label="任务描述">{{ taskInfo.taskDes }}</el-descriptions-item>
                    <el-descriptions-item label="学生姓名">{{ taskInfo.realName }}</el-descriptions-item>
                    <el-descriptions-item label="所属老师">{{ taskInfo.teacherName }}</el-descriptions-item>
                    <el-descriptions-item label="任务类型">
                        <el-tag>{{ taskInfo.typeName }}</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="任务状态">
                        <el-tag
                            :type="taskInfo.status === '未开始' ? 'info' : taskInfo.status === '已开始' ? 'primary' : taskInfo.status === '待审核' ? 'warning' : taskInfo.status === '已完成' ? 'success' : 'danger'">
                            {{ taskInfo.status }}
                        </el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="优先级">
                        <el-tag
                            :type="taskInfo.priority === '低' ? 'info' : taskInfo.priority === '中' ? 'warning' : 'danger'">
                            {{ taskInfo.priority }}
                        </el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="开始日期" content-style="background:#c5efd6">{{ taskInfo.startTime }}
                    </el-descriptions-item>
                    <el-descriptions-item label="截至日期" content-style="background:#c5efd6">{{ taskInfo.deadline }}
                    </el-descriptions-item>
                </el-descriptions>

                <div slot="footer" class="dialog-footer">
                    <el-button @click="acceptanceFormVisible = false">取 消</el-button>
                    <el-button type="danger" @click="fail">不 通 过</el-button>
                    <el-button type="success" @click="success">通 过</el-button>
                </div>
            </el-dialog>

            <!-- 编辑任务按钮 弹出对话框 默认不可见-->
            <el-dialog title="编辑当前任务" :visible.sync="editTaskForm">
                <el-form :model="taskForm" ref="taskForm" :rules="rules">
                    <el-form-item label="更改任务描述" prop="taskDes">
                        <el-input type="textarea" v-model="taskForm.taskDes"></el-input>
                    </el-form-item>
                    <el-form-item label="更改优先级" prop="priorityId">
                        <el-select v-model="taskForm.priorityId" clearable placeholder="请选择优先级" @focus="getPriority">
                            <el-option
                                v-for="item in priority"
                                :key="item.id"
                                :label="item.priority"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="editTaskForm = false">取 消</el-button>
                    <el-button type="primary" @click="submitEditForm('taskForm')">确 定</el-button>
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
            currentPage: null,

            tid: localStorage.getItem('tid'),
            account: localStorage.getItem('account'),

            studentFormVisible: false,

            studentForm: {
                taskName: '',
                realName: ''
            },
            rules: {
                realName: [
                    {required: true, message: '请选择学生！', trigger: blur}
                ],
                priorityId: [
                    {required: true, message: '请选择优先级！', trigger: blur}
                ],
                taskName: [
                    {required: true, message: '请输入任务名！', trigger: blur}
                ]
            },
            student: [],
            formLabelWidth: '180px',

            acceptanceFormVisible: false,
            taskInfo: {
                realName: '',
                taskName: '',
                taskDes: '',
                status: '',
                typeName: '',
                priority: '',
                teacherName: '',
                startTime: '',
                deadline: ''
            },

            editTaskForm: false,
            taskForm: {
                taskName: '',
                taskDes: '',
                priorityId: '',
            },
            priority: []
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
            _this.currentPage = response.data.current;

        })
    },
    methods: {
        indexMethod(index) {
            index = (index + 1) + (this.currentPage - 1) * this.pageSize;
            return index
        },
        search() {
            const _this = this
            /* 当输入空值时，执行 查询全部并分页操作 */
            if (_this.searchForm.realName === '') {
                _this.$axios.get('http://localhost:8081/tasks/getTasks/1?account=' + _this.account).then(function (res) {
                    _this.pageSize = res.data.size;
                    _this.taskList = res.data.records;
                    _this.total = res.data.total;
                    _this.currentPage = response.data.current;

                })
            } else {
                _this.$axios.post('http://localhost:8081/tasks/searchTask/1', _this.searchForm).then(function (res) {
                    console.log(res)
                    _this.pageSize = res.data.size;
                    _this.taskList = res.data.records;
                    _this.total = res.data.total;
                    _this.currentPage = response.data.current;

                })
            }
        },

        /* 翻页函数 */
        changePage(currentPage) {
            const _this = this
            _this.$axios.post('http://localhost:8081/tasks/searchTask/' + currentPage, _this.searchForm).then(function (response) {
                _this.taskList = response.data.records;
                _this.total = response.data.total;
                _this.currentPage = response.data.current;
            }, function (err) {
                console.log(err)
            })
        },

        addStudent(row) {
            const _this = this;
            console.log(row);
            if (row.realName !== null) {
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
            const _this = this;
            if (row.realName === null) {
                _this.$message({
                    message: '该任务还没有被分配！',
                    type: 'warning',
                    offset: 80
                })
            } else if (row.status !== '待审核') {
                _this.$message({
                    message: '该任务还未到达审核阶段！',
                    type: 'warning',
                    offset: 80
                })
            } else {
                this.acceptanceFormVisible = true;
                this.$axios.get('http://localhost:8081/myTask/getTeacher?taskName=' + row.taskName).then(function (response) {
                    _this.taskInfo.teacherName = response.data;
                    _this.taskInfo.realName = row.realName;
                    _this.taskInfo.taskName = row.taskName;
                    _this.taskInfo.taskDes = row.taskDes;
                    _this.taskInfo.status = row.status;
                    _this.taskInfo.typeName = row.typename;
                    _this.taskInfo.priority = row.priority;
                    _this.taskInfo.startTime = row.startTime;
                    _this.taskInfo.deadline = row.deadline;
                })
            }
        },

        success() {
            const _this = this;
            this.$axios.post('http://localhost:8081/tasks/success', _this.taskInfo).then(function (response) {
                console.log(response);
                if (response.data === 'success') {
                    _this.$message({
                        message: '验收完成！已通过！',
                        type: 'success',
                        offset: 80
                    })
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    _this.$message({
                        message: '验收失败！请重试！',
                        type: 'error',
                        offset: 80
                    })
                }
            })
        },

        fail() {
            const _this = this;
            this.$axios.post('http://localhost:8081/tasks/fail', _this.taskInfo).then(function (response) {
                console.log(response);
                if (response.data === 'success') {
                    _this.$message({
                        message: '验收完成！未通过！',
                        type: 'success',
                        offset: 80
                    })
                } else {
                    _this.$message({
                        message: '验收失败！请重试！',
                        type: 'error',
                        offset: 80
                    })
                }
            })
        },

        /**
         * 获取任务优先级
         */
        getPriority() {
            const _this = this;
            this.$axios.get('http://localhost:8081/addTask/getPriority').then(function (response) {
                _this.priority = response.data;
            })
        },
        /**
         * 编辑任务
         */
        editTask(row) {
            const _this = this;
            this.$axios.get('http://localhost:8081/myTask/getTeacher?taskName=' + row.taskName).then(function (response) {
                _this.taskForm.taskName = row.taskName;
                _this.taskForm.taskDes = row.taskDes;
                _this.taskForm.priorityId = row.priority;
            })
        },
        submitEditForm(formName) {
            const _this = this;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    _this.$axios.post('http://localhost:8081/tasks/editTask', _this.taskForm).then(response => {
                        if (response.data === 'success') {
                            _this.$message({
                                type: 'success',
                                message: '更改成功！',
                                offset: 80
                            });
                            _this.editTaskForm = false;
                        }
                    })
                } else {
                    return false;
                }
            });
        },

        toDate(row, column, cellValue) {
            return cellValue
                ? moment(cellValue).format('YYYY-MM-DD')
                : ''
        },

    },
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
    color: #509ff8;
}
</style>