import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import Register from '../views/Register.vue'

import Layout from "@/views/layout/index";

import Home from "@/views/Home";
import TeacherMain from "@/views/teacher/TeacherMain";

/* manager 页面 */
import StudentList from "@/views/manager/StudentList";
import TeacherList from "@/views/manager/TeacherList";

/* student 页面 */
import MyTeacher from "@/views/student/MyTeacher";

/* teacher 页面 */

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: '登录',
        component: Login
    },
    {
        path: '/login',
        name: '登录',
        component: Login
    },
    {
        path: '/register',
        name: '注册',
        component: Register
    },
    {
        path: '/home',
        name: '主页',
        component: Layout,
        redirect: 'toHome',
        children: [
            {
                path: '/toHome',
                name: '主页',
                component: Home
            },
            {
                path: '/studentList',
                name: '学生列表',
                component: StudentList
            },
            {
                path: '/teacherList',
                name: '老师列表',
                component: TeacherList
            }
        ]
    },

]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
