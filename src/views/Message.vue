<template>
    <div class="content">
        <el-tabs type="border-card" class="tabs" @tab-click="handleClick" v-model="activeName">
            <el-tab-pane label="我接收的消息" name="receive">
                <div v-if="noMessage">暂无消息</div>
                <div v-else class="infinite-list-wrapper" style="overflow:auto;height: 600px">
                    <ul>
                        <li v-for="message in messages" class="list-item">
                            <el-descriptions column="2" :colon=false>
                                <el-descriptions-item label="来自:">{{message.realName}}</el-descriptions-item>
                                <el-descriptions-item label="">{{toDate(message.sendTime)}}</el-descriptions-item>
                                <el-descriptions-item label="">{{message.information}}</el-descriptions-item>
                                <el-descriptions-item label="">
                                    <el-button
                                        type="primary"
                                        icon="el-icon-edit"
                                        circle
                                        @click="toSendPage(message.realName)">
                                    </el-button>
                                </el-descriptions-item>
                            </el-descriptions>
                            <hr>
                        </li>
                    </ul>
                </div>
            </el-tab-pane>


            <el-tab-pane label="我发送的消息" name="send">
                <div v-if="noMessage">暂无消息</div>
                <div v-else class="infinite-list-wrapper" style="overflow:auto;height: 600px">
                    <ul>
                        <li v-for="message in messages" class="list-item">
                            <el-descriptions column="2" :colon=false>
                                <el-descriptions-item label="发送给:">{{message.realName}}</el-descriptions-item>
                                <el-descriptions-item label="">{{toDate(message.sendTime)}}</el-descriptions-item>
                                <el-descriptions-item label="">{{message.information}}</el-descriptions-item>
                            </el-descriptions>
                            <hr>
                        </li>
                    </ul>
                </div>
            </el-tab-pane>


            <el-tab-pane label="发送新消息" name="sendNew">
                <el-form :model="contentForm" :rules="rules" ref="contentForm"
                         label-width="250px" class="demo-ruleForm">
                    <el-form-item label="消息内容" prop="information">
                        <el-input type="textarea" v-model="contentForm.information"></el-input>
                    </el-form-item>
                    <el-form-item label="选择接收人" prop="receiver">
                        <el-select v-model="contentForm.receiver" clearable placeholder="请选择接收人" @focus="getReceiver">
                            <el-option
                                v-for="item in receivers"
                                :key="item.id"
                                :label="item.realName"
                                :value="item.realName">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('contentForm')">发送</el-button>
                        <el-button @click="resetForm('contentForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>

    </div>
</template>

<script>
import moment from "moment";

export default {
    name: "Message",
    data() {
        return {
            activeName: 'receive',
            messages: [],
            tabPosition: 'left',
            account: localStorage.getItem('account'),

            contentForm: {
                information: '',
                receiver: '',
                send: localStorage.getItem('account'),
                role: localStorage.getItem('role')
            },
            receivers: [],
            noMessage: true,
            role: localStorage.getItem('role'),
            rules: {
                information: [
                    {required: true, message: '请输入内容！', trigger: 'blur'},
                ],
                receiver: [
                    {required: true, message: '请选择接收人！', trigger: 'blur'}
                ],
            }
        }
    },
    beforeCreate() {
        const _this = this;
        if (localStorage.getItem('role') === null) {
            _this.$message({
                message: '请先登录！',
                type: 'error',
                offset: '80'
            })
            _this.$router.push('/login');
        }
    },
    created() {
        this.getReceiveMessage();
    },

    methods: {
        /**
         * 切换tabs时执行
         */
        handleClick(tab,event){
            if (tab.label === '我发送的消息'){
                this.getSendMessage();
            } else if (tab.label === '我接收的消息'){
                this.getReceiveMessage();
            }
        },

        /**
         * 获取我接收的消息
         */
        getReceiveMessage(){
            const _this = this;
            this.$axios.get('http://localhost:8081/message/getReceiveMessage?receiveAccount=' + _this.account + '&role=' + _this.role).then(response =>{
                _this.messages = response.data;
                if (response.data.length !== 0){
                    _this.noMessage = false;
                } else {
                    _this.noMessage = true;
                }
            })
        },

        /**
         * 去发送信息页面
         */
        toSendPage(receiveName){
            this.activeName = 'sendNew';
            this.contentForm.receiver = receiveName;
        },

        /**
         * 获取我发送的消息
         */
        getSendMessage(){
            const _this = this;
            this.$axios.get('http://localhost:8081/message/getSendMessage?sendAccount=' + _this.account + '&role=' + _this.role).then(response =>{
                _this.messages = response.data;
                if (response.data.length !== 0){
                    _this.noMessage = false;
                } else {
                    _this.noMessage = true;
                }
            })
        },

        getReceiver() {
            const _this = this;
            //如果是老师，则获取其学生名单
            if (this.role === '2') {
                let tid = localStorage.getItem('tid');
                _this.$axios.get('http://localhost:8081/message/getStudent?tid=' + tid).then(function (response) {
                    _this.receivers = response.data;
                })
            } else if (this.role === '3') {
                //如果是学生，则获取其老师
                let sid = localStorage.getItem('sid');
                _this.$axios.get('http://localhost:8081/message/getTeacher?sid=' + sid).then(function (response) {
                    _this.receivers = response.data;
                })
            }
        },
        submitForm(formName) {
            const _this = this;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    _this.screenLoading();
                    setTimeout(() => {
                        _this.$axios.post('http://localhost:8081/message/sendMessage', _this.contentForm).then(response => {
                            if (response.data === 'success') {
                                _this.$message({
                                    type: 'success',
                                    message: '发送成功！',
                                    offset: 80
                                });
                            }
                        });
                    }, 1000)
                } else {
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },

        screenLoading() {
            const loading = this.$loading({
                lock: true,
                text: '正在发送，请稍等...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            setTimeout(() => {
                loading.close()
            }, 1000)
        },

        toDate(cellValue) {
            return cellValue
                ? moment(cellValue).format('YYYY年MM月DD日 HH:mm:ss')
                : ''
        },
    }
}
</script>

<style scoped>
.content {
    position: relative;
    padding: 0;
    margin: 0;
}

.tabs {
    margin: 40px 20px 40px 20px;
}

li{
    list-style: none;
}


</style>