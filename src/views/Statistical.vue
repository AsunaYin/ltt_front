<template>
    <div style="position: absolute;top: 10px">
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

        <div id="taskType"
             :style="{
        width: '600px',
        height: '500px',
        margin: '20px 0 20px 40px',
        display: 'inline-block'
        }">
        </div>

        <div id="taskPriority"
             :style="{
        width: '600px',
        height: '500px',
        margin: '20px 0 20px 40px',
        display: 'inline-block'
        }">
        </div>

        <div id="taskStatus"
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
        return {}
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
            let taskType = this.$echarts.init(document.getElementById('taskType'));
            let priority = this.$echarts.init(document.getElementById('taskPriority'));
            let taskStatus = this.$echarts.init(document.getElementById('taskStatus'));

            //学生和老师的数量比
            this.$axios.get('http://localhost:8081/statistical/getUser').then(response => {
                user.setOption({
                    title: {
                        text: '学生与老师数量比',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{b}: {c}({d}%)'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left'
                    },
                    color: ['#ea7735','#7bda75'],
                    series: [{
                        name: '数量',
                        type: 'pie',
                        radius: '60%',
                        data: [
                            {value: response.data.student, name: '学生'},
                            {value: response.data.teacher, name: '老师'},
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
                studentSex.setOption({
                    title: {
                        text: '学生男女比例',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{b}: {c}({d}%)'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left'
                    },
                    color: ['#fff82c','#7c93fd'],
                    series: [{
                        name: '数量',
                        type: 'pie',
                        radius: '60%',
                        data: [
                            {value: response.data.man, name: '男'},
                            {value: response.data.woman, name: '女'}
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

            //任务类型数量分布
            this.$axios.get('http://localhost:8081/statistical/getType').then(response => {
                let getData = [];
                for (let i = 0; i < response.data.length; i++){
                    getData[i] = {value: response.data[i].count,name: response.data[i].typename};
                }
                taskType.setOption({
                    title: {
                        text: '任务类型分布',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                    },
                    color: ['#fc8251','#5470c6','#91cd77','#ef6567',
                        '#f9c956','#75bedc'],
                    series: [{
                        name: '数量',
                        type: 'pie',
                        radius: '60%',
                        data: getData,
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

            //任务优先度分布
            this.$axios.get('http://localhost:8081/statistical/getPriority').then(response =>{
                let getData = [];
                for (let i = 0; i < response.data.length; i++){
                    getData[i] = {value: response.data[i].count,name: response.data[i].priority};
                }
                priority.setOption({
                    title: {
                        text: '任务优先度分布',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                    },
                    color: ['#5168fc',
                        '#c6c054',
                        '#5ff81e',
                        '#96391d',
                        '#f9c956',
                        '#75bedc'],
                    series: [{
                        name: '数量',
                        type: 'pie',
                        radius: '60%',
                        data: getData,
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

            //任务进度分布
            this.$axios.get('http://localhost:8081/statistical/getStatus').then(response =>{
                console.log(response);
                let getData = [];
                for (let i = 0; i < response.data.length; i++){
                    getData[i] = {value: response.data[i].count,name: response.data[i].status};
                }
                console.log(getData)
                taskStatus.setOption({
                    title: {
                        text: '任务进度分布',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                    },
                    color: [
                        '#51fcf6',
                        '#aa54c6',
                        '#fff200',
                        '#96391d',
                        'rgba(217,129,97,0.63)',
                        '#26b658'
                    ],
                    series: [{
                        name: '数量',
                        type: 'pie',
                        radius: '60%',
                        data: getData,
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
.color{
    color: #ea7735;
}
</style>