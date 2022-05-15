<template>
    <div class="content">
        <el-card class="box-card">
            <h1>发布任务</h1>
            <el-form :rules="rules" ref="form" :model="form" label-width="200px" status-icon>
                <el-form-item label="任务名称" prop="taskName">
                    <el-input v-model="form.taskName" @change="confirmName(form.taskName)"></el-input>
                </el-form-item>
                <el-form-item label="任务描述" prop="taskDes">
                    <el-input type="textarea" v-model="form.taskDes"></el-input>
                </el-form-item>
                <el-form-item label="任务类型" prop="taskTypeId">
                    <el-select v-model="form.taskTypeId" clearable placeholder="请选择任务类型" @focus="getTypes">
                        <el-option
                            v-for="type in taskType"
                            :key="type.id"
                            :label="type.typeName"
                            :value="type.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="任务状态" prop="taskStatusId">
                    <el-select v-model="form.taskStatusId" clearable placeholder="请选择任务状态" @focus="getStatus">
                        <el-option
                            v-for="status in taskStatus"
                            :key="status.id"
                            :label="status.status"
                            :value="status.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="任务优先级" prop="priorityId">
                    <el-select v-model="form.priorityId" clearable placeholder="请选择任务优先级" @focus="getPriority">
                        <el-option
                            v-for="item in priority"
                            :key="item.id"
                            :label="item.priority"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开始日期" prop="startTime">
                    <el-date-picker type="date" placeholder="开始日期"
                                    v-model="form.startTime"
                                    value-format="yyyy-MM-dd"
                                    style="width: 20%;">

                    </el-date-picker>
                </el-form-item>
                <el-form-item label="截止日期" prop="deadline">
                    <el-date-picker type="date" placeholder="截至日期"
                                    v-model="form.deadline"
                                    value-format="yyyy-MM-dd"
                                    style="width: 20%;">

                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit('form')">立即创建</el-button>
                    <el-button>取消</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
export default {
    name: "AddTask",
    data: function () {
        /**
         * 检验截止日期是否在开始日期之前
         * @param rule
         * @param value
         * @param callback
         */
        const _this = this;
        const validateDate = (rule, value, callback) => {
            let startTime = _this.form.startTime;
            let d1 = new Date(startTime);
            let d2 = new Date(value);
            console.log(startTime)
            if (d1.getDate() > d2.getDate()) {
                callback(new Error('截止日期不能在开始日期之前！'))
            } else {
                callback()
            }
        }
        return {
            form: {
                id: null,
                taskName: '',
                taskDes: '',
                taskTypeId: '',
                taskStatusId: '',
                priorityId: '',
                startTime: '',
                deadline: '',
                account: localStorage.getItem('account')
            },
            taskType: [],
            taskStatus: [],
            priority: [],

            isRepeat: '',

            rules: {
                taskName: [
                    {required: true, message: '请输入任务名称！', trigger: blur},
                    {max: 20, message: '名称不能超过20个字！', trigger: blur}
                ],
                taskTypeId: [
                    {required: true, message: '请选择任务类型！', trigger: blur}
                ],
                taskStatusId: [
                    {required: true, message: '请选择任务状态！', trigger: blur}
                ],
                priorityId: [
                    {required: true, message: '请选择任务优先级！', trigger: blur}
                ],
                startTime: [
                    {required: true, message: '请选择开始日期！', trigger: blur}
                ],
                deadline: [
                    {required: true, message: '请选择截至日期！', trigger: blur},
                    {validator: validateDate}
                ]
            }
        }
    },
    methods: {

        /**
         * 判断任务名称是否已经存在
         * @param name
         */
        confirmName(name) {
            const _this = this
            this.$axios.get('http://localhost:8081/addTask/confirm?taskName=' + name).then(function (response) {
                if (response.data === 'error') {
                    _this.$message.error('任务名称已存在！请重新输入！')
                }
                _this.isRepeat = response.data
            }, function (err) {
                alert(err)
            })
        },
        /**
         * 获取任务类型
         */
        getTypes() {
            const _this = this;
            this.$axios.get('http://localhost:8081/addTask/getType').then(function (response) {
                _this.taskType = response.data;
            })
        },
        /**
         * 获取任务状态
         */
        getStatus() {
            const _this = this;
            this.$axios.get('http://localhost:8081/addTask/getStatus').then(function (response) {
                _this.taskStatus = response.data;
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
         * 提交
         */
        onSubmit(formName) {
            const _this = this;
            console.log(_this.form);
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (_this.isRepeat === 'success') {
                        _this.$axios.post('http://localhost:8081/addTask/submit', _this.form).then(function (response) {
                            console.log(response);
                            if (response.data.msg === 'success') {
                                _this.$message({
                                    type: 'success',
                                    message: '添加成功！',
                                    offset: 80
                                })
                                setTimeout(() => {
                                    window.location.reload();
                                }, 3000)
                            } else if (response.data.msg === 'error') {
                                _this.$message({
                                    type: 'error',
                                    message: '添加失败！',
                                    offset: 80
                                })
                            }
                        })
                    } else {
                        _this.$message.error('任务名称已存在！请重新输入！')
                    }
                } else {
                    return false;
                }
            });
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
            _this.$router.push('/login');
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
    created() {
        const _this = this;
        this.$axios.get('http://localhost:8081/addTask/getType').then(function (response) {
            _this.taskType = response.data;
        })
    }
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
</style>