import "./index.scss";

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