import Vue from 'vue'
import App from './App.vue'
import Home from "./pages/home.vue";
import { registerMicroApps, start } from 'qiankun';
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import VueRouter from "vue-router";
import store from "../store";

console.log(true);

Vue.use(VueRouter);
Vue.use(Antd)
Vue.config.productionTip = false

window.isInContainer = true;
window.store = store;

registerMicroApps(
    [{
            name: 'react app', // app name registered
            entry: '//react.micro-front.com',
            render: ({ appContent, loading }) => {
                if (loading) {
                    const frame = document.getElementById("frame");
                    frame.innerHTML = appContent;
                }
            },
            activeRule: location => location.pathname.startsWith('/react')
        },
        {
            name: 'vue app',
            entry: '//vue.micro-front.com',
            render: ({ appContent, loading }) => {
                if (loading) {
                    const frame = document.getElementById("frame");
                    frame.innerHTML = appContent;
                }
            },
            activeRule: location => location.pathname.startsWith('/vue')
        },
        {
            name: 'jquery app', // app name registered
            entry: '//jquery.micro-front.com/jquery/status.html',
            render: ({ appContent, loading }) => {
                if (loading) {
                    const frame = document.getElementById("frame");
                    frame.innerHTML = appContent;
                }
            },
            activeRule: location => location.pathname === '/jquery/status'
        },
        {
            name: 'jquery app2', // app name registered
            entry: '//jquery.micro-front.com/jquery/index.html',
            render: ({ appContent, loading }) => {
                if (loading) {
                    const frame = document.getElementById("frame");
                    frame.innerHTML = appContent;
                }
            },
            activeRule: location => location.pathname === '/ery'
        },
        {
            name: 'ssr1 app', // app name registered
            entry: '//jquery.micro-front.com/jquery/combineA.html',
            render: ({ appContent, loading }) => {
                if (loading) {
                    const frame = document.getElementById("combineA");
                    frame.innerHTML = appContent;
                }
            },
            activeRule: location => location.pathname === '/combine'
        },
        {
            name: 'ssr2 app', // app name registered
            entry: '//jquery.micro-front.com/jquery/combineB.html',
            render: ({ appContent, loading }) => {
                if (loading) {
                    const frame = document.getElementById("combineB");
                    frame.innerHTML = appContent;
                }
            },
            activeRule: location => location.pathname === '/combine'
        },
    ], {
        beforeLoad: app => console.log('before load', app.name),
        beforeMount: [
            app => console.log('before mount', app.name),
        ],
    }
);

start();

new Vue({
    router: new VueRouter({
        mode: "history",
        routes: [{
            path: "/",
            component: Home
        }]
    }),
    render: h => h(App),
}).$mount('#main-app')