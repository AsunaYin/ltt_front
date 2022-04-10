import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import Register from '../views/Register.vue'

import Layout from '@/views/layout/index'

/* 主页 */
import Home from '@/views/Home'

/* 个人中心 */
import MyInfo from '@/views/MyInfo'

/* manager 页面 */
import StudentList from '@/views/manager/StudentList'
import TeacherList from '@/views/manager/TeacherList'

/* student 页面 */
import ChoseTeacher from '@/views/student/ChoseTeacher'
import MyTeacher from '@/views/student/MyTeacher'
import MyTask from '@/views/student/MyTask'

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
      },
      {
        path: '/choseTeacher',
        name: '选择老师',
        component: ChoseTeacher
      },
      {
        path: '/myTeacher',
        name: '我的老师',
        component: MyTeacher
      },
      {
        path: '/myTask',
        name: '我的任务',
        component: MyTask
      },
      {
        path: '/myInfo',
        name: '个人中心',
        component: MyInfo
      }
    ]
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
