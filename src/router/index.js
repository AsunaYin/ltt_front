import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import Register from '../views/Register.vue'
import Index from '../views/Index'

import ManagerMain from "@/views/manager/ManagerMain";
import StudentMain from "@/views/student/StudentMain";
import TeacherMain from "@/views/teacher/TeacherMain";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        component: Login
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/register',
        component: Register
    },
    {
        path: '/managerMain',
        component: ManagerMain
    },
    {
        path: '/teacherMain',
        component: TeacherMain
    },
    {
        path: '/studentMain',
        component: StudentMain
    }

]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
