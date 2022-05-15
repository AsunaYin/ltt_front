<template>
    <div class="block">
        <el-image :src="src"></el-image>
    </div>
</template>

<script>
export default {
    name: 'Home',
    data() {
        return {
            src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'
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
