<template>
    <div style="position: absolute">
        <div id="user"
             :style="{
        width: '600px',
        height: '500px',
        margin: '20px 0 20px 40px',
        display: 'inline-block'
        }">
        </div>

        <div id="studentSex"
             :style="{
        width: '600px',
        height: '500px',
        margin: '20px 0 20px 40px',
        display: 'inline-block'
        }">
        </div>
    </div>
</template>

<script>
export default {
    name: "Statistical",
    data() {
        return {
            man: 0,
            woman: 0,
            student: '0',
            teacher: '0',
        }
    },
    mounted() {
        this.drawLine();
    },
    methods: {
        drawLine() {
            const _this = this;

            // 基于刚刚准备好的 DOM 容器，初始化 EChart 实例
            let studentSex = this.$echarts.init(document.getElementById('studentSex'));
            let user = this.$echarts.init(document.getElementById('user'));

            //学生和老师的数量比
            this.$axios.get('http://localhost:8081/statistical/getUser').then(response => {
                _this.student = response.data.student;
                _this.teacher = response.data.teacher;

                user.setOption({
                    title: {
                        text: '学生老师数量',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left'
                    },
                    series: [{
                        name: '数量',
                        type: 'pie',
                        radius: '60%',
                        data: [
                            {value: _this.student, name: '学生'},
                            {value: _this.teacher, name: '老师'},
                        ],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }],
                });
            })

            //学生的男女比例
            this.$axios.get('http://localhost:8081/statistical/getSex').then(response => {
                _this.man = response.data.man;
                _this.woman = response.data.woman;

                studentSex.setOption({
                    title: {
                        text: '学生男女比例',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left'
                    },
                    series: [{
                        name: '数量',
                        type: 'pie',
                        radius: '60%',
                        data: [
                            {value: _this.man, name: '男'},
                            {value: _this.woman, name: '女'}
                        ],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }],
                });
            })
        }
    }
}
</script>

<style scoped>

</style>