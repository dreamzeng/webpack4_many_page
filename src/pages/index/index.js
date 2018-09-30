
import Vue from 'vue';
import app from './app';


window.top.vue = new Vue({
    el:'#app',
    render: h => h(app)
})
  