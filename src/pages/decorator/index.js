//https://github.com/rccoder/blog/issues/23#issue-208381273
import "./index.scss";

import Vue from 'vue';
import app from './app';


window.top.vue = new Vue({
    render: h => h(app)
  }).$mount('#app')
  






function readonly(target, key, descriptor) {
    console.log(target,key,descriptor);
    descriptor.writable = false
    return descriptor
}

function doge (target) {
    target.isDoge = true
}
  
@doge
class Dog {
    @readonly
    bark () {
      return 'wang!wang!'
    }
}

let dog = new Dog();
dog.bark();
console.log(Dog.isDoge)              