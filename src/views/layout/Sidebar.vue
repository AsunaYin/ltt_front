<template>
    <div class="sidebar">
        <el-aside>
            <el-menu
                default-active="1"
                class="el-menu-vertical-demo"
                :router="true"
            >
                <el-menu-item index="./home" style="padding: 0">
                    <i class="el-icon-star-off"></i>
                    <span>主页</span>
                </el-menu-item>

                <el-submenu index="2">
                    <template slot="title">
                        <i class="el-icon-user"></i>
                        <span slot="title">用户管理</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="./studentList" style="padding: 0">
                            <i class="el-icon-s-check"></i>
                            <span>学生列表</span>
                        </el-menu-item>
                        <el-menu-item index="./teacherList" style="padding: 0">
                            <i class="el-icon-s-custom"></i>
                            <span>老师列表</span>
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
            </el-menu>
        </el-aside>
    </div>
</template>

<script>
export default {
    name: "Sidebar"
}
</script>

<style scoped>

.sidebar {
    float: left;
    position: sticky;
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