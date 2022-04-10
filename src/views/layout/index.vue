<template>
    <div class="index">
        <sidebar></sidebar>
        <mainContent></mainContent>
    </div>
</template>

<script>

import mainContent from '@/views/layout/mainContent/index'
import Sidebar from '@/views/layout/Sidebar'

export default {
  data () {
    return {}
  },
  components: {
    Sidebar,
    mainContent
  }
}
</script>

<style scoped>
    .index {
        position: relative;
        height: 100%;
        width: 100%;
    }
</style>
