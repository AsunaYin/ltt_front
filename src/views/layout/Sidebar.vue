<template>
    <div class="sidebar">
        <el-aside>
            <el-menu
                default-active="this.$router.path"
                class="el-menu-vertical-demo"
                :router="true"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b"
            >
                <el-menu-item index="/home" style="padding: 0">
                    <i class="el-icon-star-off"></i>
                    <span>主页</span>
                </el-menu-item>

                <el-submenu index="2">
                    <template slot="title">
                        <i class="el-icon-eleme"></i>
                        <span slot="title">系统管理</span>
                    </template>
                    <el-submenu index="2-1">
                        <template slot="title"><i class="el-icon-user"></i>用户管理</template>
                        <el-menu-item-group>
                            <el-menu-item index="/studentList" style="padding: 0">
                                <i class="el-icon-s-check"></i>
                                <span>学生列表</span>
                            </el-menu-item>
                            <el-menu-item index="/teacherList" style="padding: 0">
                                <i class="el-icon-s-custom"></i>
                                <span>老师列表</span>
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-menu-item index="/taskClassify" style="padding: 0">
                        <i class="el-icon-more-outline"></i>
                        <span>任务分类</span>
                    </el-menu-item>

                </el-submenu>

                <el-submenu index="3">
                    <template slot="title">
                        <i class="el-icon-edit-outline"></i>
                        <span slot="title">任务管理(学生)</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="/choseTeacher" style="padding: 0">
                            <i class="el-icon-refresh"></i>
                            <span>选择老师</span>
                        </el-menu-item>
                        <el-menu-item index="/myTeacher" style="padding: 0">
                            <i class="el-icon-s-custom"></i>
                            <span>我的老师</span>
                        </el-menu-item>
                        <el-menu-item index="/myTask" style="padding: 0">
                            <i class="el-icon-date"></i>
                            <span>我的任务</span>
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>

                <el-submenu index="4">
                    <template slot="title">
                        <i class="el-icon-edit-outline"></i>
                        <span slot="title">任务管理(老师)</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="/apply" style="padding: 0">
                            <i class="el-icon-document-add"></i>
                            <span>申请列表</span>
                        </el-menu-item>
                        <el-menu-item index="/myStudent" style="padding: 0">
                            <i class="el-icon-s-check"></i>
                            <span>我的学生</span>
                        </el-menu-item>
                        <el-menu-item index="/addTask" style="padding: 0">
                            <i class="el-icon-document-checked"></i>
                            <span>发布任务</span>
                        </el-menu-item>
                        <el-menu-item index="/tasks" style="padding: 0">
                            <i class="el-icon-upload2"></i>
                            <span>已发布的任务</span>
                        </el-menu-item>

                    </el-menu-item-group>
                </el-submenu>

                <!------------------------------------------------------------------------->

                <el-menu-item index="/message" style="padding: 0">
                    <i class="el-icon-chat-dot-square"></i>
                    <span>消息中心</span>
                </el-menu-item>

                <el-menu-item index="/myInfo" style="padding: 0">
                    <i class="el-icon-setting"></i>
                    <span>个人中心</span>
                </el-menu-item>

                <el-menu-item index="/statistical" style="padding: 0">
                    <i class="el-icon-discover"></i>
                    <span>统计中心</span>
                </el-menu-item>

            </el-menu>
        </el-aside>
    </div>
</template>

<script>
export default {
  name: 'Sidebar'
}
</script>

<style scoped>

.sidebar {
    float: left;
    position: fixed;
    top: 0;
    width: 15%;
    height: 100%;
}

.el-aside {
    background-color: #000;
    color: #333;
    text-align: center;
    line-height: 200px;
    width: 100% !important;
    height: 100%;
}

body > .el-container {
    margin-bottom: 40px;
}

html, body, .homeBox, #app, .el-container {
    height: 100%;
    margin: 0;
    padding: 0;
}

/*aside*/
.el-menu-vertical-demo {
    /*width: 100%;*/
    height: 100%;
}

a {
    text-decoration: none;
    color: #000;
}

a:hover {
    background-color: #c3e2ff;
}
</style>
