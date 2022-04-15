<template>
    <div class="errPage-container">
        <el-button icon="el-icon-arrow-left" class="pan-back-btn" @click="back">
            首页
        </el-button>
        <el-row>
            <el-col :span="12">
                <h1>
                    Oops!
                </h1>
                <h2>您的权限无法进入此页面</h2>
            </el-col>
            <el-col :span="12">
                <img :src="errGif" width="313" height="428" alt="Girl has dropped her ice cream.">
            </el-col>
        </el-row>

    </div>
</template>

<script>
import errGif from '@/img/401.gif'

export default {
    name: 'Page403',
    data() {
        return {
            errGif: errGif + '?' + +new Date(),
        }
    },
    methods: {
        back() {
            this.$router.push({path: '/toHome'})
        }
    }
}
</script>

<style scoped>
.errPage-container {
    position: relative;
    width: 800px;
    max-width: 100%;
    margin: 100px auto;
}

.pan-back-btn {
    position: absolute;
    background: #008489;
    color: #fff;
    border: none !important;
    left: -100px;

}

.pan-back-btn:hover {
    background: #008489;
    color: #fff;
    border: none !important;
}

h1 {
    font-size: 60px;
    font-weight: 700;
    color: #484848;
}

a {
    color: #008489;
    text-decoration: none;
}


</style>
