<template>
    <div class="content">
        <el-card class="box-card">
            <h1>我的学生</h1>
            <el-form :inline="true" :model="searchForm" class="demo-form-inline" id="searchForm">
                <el-form-item label="查询学生" style="float: left">
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
                    border
                    style="width: 90%;margin: 0 auto"
                >
                    <el-table-column
                        prop="account"
                        label="账号"
                        align="center"
                        width="170">
                    </el-table-column>
                    <el-table-column
                        prop="realName"
                        label="真实姓名"
                        align="center"
                        width="150">
                    </el-table-column>
                    <el-table-column
                        prop="sex"
                        label="性别"
                        align="center"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        prop="phone"
                        label="联系电话"
                        align="center"
                        width="200">
                    </el-table-column>
                    <el-table-column
                        prop="birthDate"
                        :formatter="toDate"
                        label="出生日期"
                        align="center"
                        width="150">
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
        </el-card>
    </div>
</template>

<script>
import moment from "moment";

export default {
    name: "MyStudent",
    data () {
        return {
            // 搜索框
            searchForm: {
                realName: '',
                tid: localStorage.getItem('tid')
            },
            studentList: [],
            total: 0,
            pageSize: null,

            tid: localStorage.getItem('tid')
        }
    },
    beforeCreate() {
        const _this = this;
        if (localStorage.getItem('role') !== '2'){
            _this.$message({
                message: '老师才能进入此页面！',
                type: 'error',
                offset: '80'
            })
            _this.$router.push('/403');
        }
    },
    created() {
        const _this = this;
        this.$axios.get('http://localhost:8081/teacher/getStudent/1?tid=' + _this.tid).then(function (response) {
            console.log(response);
            _this.studentList = response.data.records;
            _this.pageSize = response.data.size;
            _this.total = response.data.total;
        })
    },
    methods: {
        search () {
            const _this = this
            /* 当输入空值时，执行 查询全部并分页操作 */
            if (_this.searchForm.realName === '') {
                _this.$axios.get('http://localhost:8081/teacher/getStudent/1?tid=' + _this.tid).then(function (res) {
                    // console.log(res);
                    _this.pageSize = res.data.size;
                    _this.studentList = res.data.records;
                    _this.total = res.data.total;
                })
            } else {
                _this.$axios.post('http://localhost:8081/teacher/searchMyStudent/1', _this.searchForm).then(function (res) {
                    console.log(res)
                    _this.pageSize = res.data.size;
                    _this.studentList = res.data.records;
                    _this.total = res.data.total;
                })
            }
        },

        /* 翻页函数 */
        changePage (currentPage) {
            const _this = this
            _this.$axios.post('http://localhost:8081/teacher/searchMyStudent/' + currentPage, _this.searchForm).then(function (response) {
                console.log(_this.form)
                _this.studentList = response.data.records
                _this.total = response.data.total
            }, function (err) {
                console.log(err)
            })
        },

        toDate (row, column, cellValue) {
            return cellValue
                ? moment(cellValue).format('YYYY-MM-DD')
                : ''
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