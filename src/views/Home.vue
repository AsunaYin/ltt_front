<template>
    <div class="block">
        <el-carousel height="750px">
            <el-carousel-item v-for="item in src" :key="item">
                <el-image :src="item"></el-image>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script>
export default {
    name: 'Home',
    data() {
        return {
            src: [
                'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
                'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
                'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
            ]
        }
    },
    // 判断是否登录 与 权限是否足够
    beforeCreate() {
        const _this = this
        if (localStorage.getItem('role') === null) {
            _this.$message({
                message: '请先登录！',
                type: 'error',
                offset: '80'
            })
            _this.$router.push('/login')
        }
    }
}

</script>

<style scoped>
.block {
    padding: 20px;
}
</style>
