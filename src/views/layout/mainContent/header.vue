<template>
    <el-header class="el-header">
        <h1 style="display: inline-block;float: left;margin:0 0 0 450px;">欢迎来到学习任务跟踪管理系统</h1>
        <div class="aside__top--right" style="display: inline-block;float: right;margin-right: 20px;width: 20%">
            <div class="user-msg" style="display: inline-block;float: left;">
                <span class="user-name">{{ account }}</span>
                <el-dropdown trigger="click" placement="top" @command="handleCommand">
                                <span class="el-dropdown-link">
                                    <i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="personalCenter">个人中心</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <el-button type="primary" @click="logOut()">退出登录</el-button>
        </div>
    </el-header>
</template>

<script>

export default {
    data() {
        return {
            account: localStorage.getItem('account')
        }
    },
    methods: {
        logOut() {
            const _this = this
            this.screenLoading()
            setTimeout(() => {
                localStorage.clear();
                _this.$router.push('/Login')
            }, 1000)
        },
        screenLoading() {
            const loading = this.$loading({
                lock: true,
                text: '正在退出...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            setTimeout(() => {
                loading.close()
            }, 1000)
        },
        handleCommand(command) {
            if (command === 'personalCenter') {
                this.$router.push({path: '/myInfo'})
            }
        },
    }
}
</script>

<style scoped>
.el-header {
    position: sticky;
    top: 0;
    z-index: 9999;
    background-color: #409EFF;
    color: #424040;
    text-align: center;
    line-height: 60px;
    width: 100%;
    border-bottom: #2c3e50 !important;
}

.user-name {
    color: #3c3e41;
    font-weight: 700;
}

a {
    text-decoration: none;
    color: #000;
}

a:hover {
    background-color: #c3e2ff;
}
</style>
