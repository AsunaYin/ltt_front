<template>
    <div class="main_Content">
        <topHeader></topHeader>
        <Main></Main>
    </div>
</template>

<script>

import topHeader from "@/views/layout/mainContent/header";
import Main from "@/views/layout/mainContent/content";

export default {
    data() {
        return {}
    },
    components: {
        topHeader,
        Main
    }
}
</script>

<style scoped>
    .main_Content{
        position: relative;
        float: left;
        width: 85%;
        height: 100%;
    }
</style>