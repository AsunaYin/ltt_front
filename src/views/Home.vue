<template>
    <div>
        <router-view/>
        <div class="block">
            <el-image :src="src"></el-image>
        </div>
    </div>
</template>

<script>
export default {
    name: "Home",
    data() {
        return {
            src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'
        }
    }
}

</script>

<style scoped>
    .block {
        margin: 20px;
    }
</style>