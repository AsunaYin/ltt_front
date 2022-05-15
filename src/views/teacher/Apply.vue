<template>
    <div>
        <el-table
            class="table"
            :data="applyList"
            stripe
            style="width: 90%">
            <el-table-column
                type="index"
                label="序号"
                :index="indexMethod"
                width="80"
                align="center"
                fixed="left">
            </el-table-column>
            <el-table-column
                prop="realName"
                label="姓名"
                align="center"
                width="200">
            </el-table-column>
            <el-table-column
                prop="sex"
                label="性别"
                align="center"
                width="200">
            </el-table-column>
            <el-table-column
                prop="phone"
                label="联系电话"
                align="center"
                width="220">
            </el-table-column>
            <el-table-column
                prop="applyTime"
                label="申请日期"
                align="center"
                width="200">
            </el-table-column>
            <el-table-column label="操作" align="center" fixed="right" width="200">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="primary"
                        @click="agree(scope.row)">同意
                    </el-button>
                    <el-button
                        size="mini"
                        type="danger"
                        @click="refuse(scope.row)">拒绝
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>


<script>
export default {
    name: "Apply",
    data() {
        return {
            applyList: [],
            tid: localStorage.getItem('tid'),
            total: 0,
            pageSize: null,
            currentPage: null,
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
        this.getApply();
    },
    methods: {
        indexMethod(index) {
            index = (index + 1) + (this.currentPage - 1) * this.pageSize;
            return index
        },
        agree(row) {
            const _this = this;
            console.log(row);
            this.$axios.get('http://localhost:8081/apply/agree?sid=' + row.sid).then(response =>{
                if (response.data === 'success'){
                    _this.$message({
                        type: 'success',
                        message: '申请通过！',
                        offset: 80
                    })
                }
            })
        },
        refuse(row) {
            const _this = this;
            this.$axios.get('http://localhost:8081/apply/refuse?sid=' + row.sid).then(response => {
                if (response.data === 'success'){
                    _this.$message({
                        type: 'success',
                        message: '拒绝成功！',
                        offset: 80
                    })
                }
            })
        },
        getApply() {
            const _this = this;
            this.$axios.get('http://localhost:8081/apply/getApply?tid=' + _this.tid).then(response => {
                _this.applyList = response.data;
            })
        },
        changePage(){

        }
    }
}
</script>

<style scoped>
.table {
    position: relative;
    top: 20px;
    left: 65px;
}

</style>