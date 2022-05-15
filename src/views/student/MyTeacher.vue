<template>
    <div class="content">
        <div class="title"><h4>我的老师</h4></div>
        <div class="des">
            <div class="avatar">
                <el-image :src="avatarUrl" class="avatar_image"></el-image>
            </div>
            <div class="avatar-font">头像</div>
            <el-card class="box-card">
                <el-row :gutter="20">
                    <el-col :span="6" class="bgc">
                        <div style="text-align:right;"><span>姓名：</span></div>
                    </el-col>
                    <el-col :span="6" class="bgc">
                        <span>{{ realName }}</span>
                    </el-col>
                    <el-col :span="6" class="bgc">
                        <div style="text-align:right;"><span>性别：</span></div>
                    </el-col>
                    <el-col :span="6" class="bgc">
                        <span>{{ sex }}</span>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="6" class="bgc">
                        <div style="text-align:right;"><span>联系电话：</span></div>
                    </el-col>
                    <el-col :span="6" class="bgc">
                        <span>{{ phone }}</span>
                    </el-col>
                    <el-col :span="6" class="bgc">
                        <div style="text-align:right;"><span>出生日期：</span></div>
                    </el-col>
                    <el-col :span="6" class="bgc">
                        <span>{{ birthDate }}</span>
                    </el-col>
                </el-row>
            </el-card>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MyTeacher',
    data() {
        return {
            avatarUrl: '',
            realName: '',
            sex: '',
            phone: '',
            birthDate: '',

            account: localStorage.getItem('account'),
            tid: localStorage.getItem('tid')

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
        } else if (localStorage.getItem('role') !== '3') {
            _this.$message({
                message: '您不是学生！',
                type: 'error',
                offset: '80'
            })
            _this.$router.push('/403');
        }

    },
    created() {
        const _this = this;
        _this.getTid();
    },
    methods: {
        getTid() {
            const _this = this;
            this.$axios.get('http://localhost:8081/student/getTid?account=' + _this.account).then(response => {
                _this.tid = response.data;
                console.log("getTid----" + _this.tid);
            }).then(function (){
                console.log("getT----" + _this.tid);
                if (_this.tid === 'null' || _this.tid === '') {
                    _this.$message({
                        message: '请先选择老师！',
                        type: 'warning',
                        offset: '80'
                    })
                    _this.$router.push('/choseTeacher');
                } else {
                    _this.$axios.get('http://localhost:8081/student/myTeacher?tid=' + _this.tid).then(function (response) {
                        _this.avatarUrl = response.data.avatarUrl;
                        _this.realName = response.data.realName;
                        _this.sex = response.data.sex;
                        _this.phone = response.data.phone;
                        _this.birthDate = response.data.birthDate;
                    })
                }
            })
        },
        getTeacherInfo() {
            const _this = this;
            console.log("getT----" + _this.tid);
            if (_this.tid === 'null') {
                _this.$message({
                    message: '请先选择老师！',
                    type: 'warning',
                    offset: '80'
                })
                _this.$router.push('/choseTeacher');
            } else {
                _this.$axios.get('http://localhost:8081/student/myTeacher?tid=' + _this.tid).then(function (response) {
                    _this.avatarUrl = response.data.avatarUrl;
                    _this.realName = response.data.realName;
                    _this.sex = response.data.sex;
                    _this.phone = response.data.phone;
                    _this.birthDate = response.data.birthDate;
                })
            }
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

.title {
    position: relative;
    height: 40px;
    width: 100%;
    font-size: 18px;
    line-height: 40px;
    background-color: #f6f6f6;
}

.title h4 {
    position: absolute;
    left: 15px;
    margin: 0;
}

.des {
    position: relative;
}

.avatar {
    /*display: inline-block;*/
    overflow: hidden;
    position: absolute;
    left: 150px;
    top: 100px;
    width: 150px;
    height: 150px;
    border-radius: 50%;
}

.avatar_image {
    width: 150px;
    height: 150px;
}

.avatar-font {
    position: absolute;
    left: 210px;
    top: 270px;
    font-weight: 800;
}

.box-card {
    position: absolute;
    margin-top: 30px;
    width: 800px;
}

.el-row {
    margin-bottom: 20px;
}

.el-row:last-child {
    margin-bottom: 0;
}


.bgc {
    background-color: #fff;
}
</style>
