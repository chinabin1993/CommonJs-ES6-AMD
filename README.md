一直以来对CommonJs/AMD/CMD/ES6的文件模块加载一直懵懵懂懂。甚至有时会将CommonJs的exports和ES6的export.default搞混。趁着学习webpack，先搞懂这些模块加载方式再说！！！

> 随着前端的发展，我们日常开发的功能越来越复杂，文件越来越多。随后前端社区衍生出了CommonJs/AMD/CMD/ES6的几种模块加载方式。

### 模块加载方式
1. [CommonJs](#01-CommonJs)
2. [ES6](#02-ES6)
3. [AMD](#03-AMD)
4. [CMD](#04-CMD)


## 01: CommonJs
参考地址：[阮一峰老师讲解的CommonJs规范](http://javascript.ruanyifeng.com/nodejs/module.html#toc0)
每个文件都是一个单独的模块，有自己的作用域。在一个文件里面定义的变量、函数、类，都是私有的，对其他文件不可见。
**`CommonJS`规范规定，每个模块内部，`module`变量代表当前模块。这个变量是一个对象，它的`exports`属性（即`module.exports`）是对外的接口。加载某个模块，其实是加载该模块的`module.exports`属性。**

###### CommonJs的特点
1. 所有的代码都运行在模块作用域，不会污染全局作用域；
2. 模块可以多次加载，但是只会在第一次加载时运行一次，然后运行的结果就会被缓存了，以后再加载就直接读取缓存结果。要想让模块继续运行，必须清空缓存；
3. 模块加载顺序，按照其在代码中出现的顺序；
4. CommonJs加载模块是同步的；

###### Module对象
我们在demo01中创建两个js文件，名为`c1.js`,`main.js`
**c1.js**
每个模块内部都有一个`module`对象，代表当前模块。它有以下属性：
> * `module.id` 模块的识别符，通常是带有绝对路径的模块文件名。
> * `module.filename` 模块的文件名，带有绝对路径。
> * `module.loaded` 返回一个布尔值，表示模块是否已经完成加载。
> * `module.parent` 返回一个对象，表示调用该模块的模块。
> * `module.children` 返回一个数组，表示该模块要用到的其他模块。
> * `module.exports` 表示模块对外输出的值。

```javascript
console.log(module);
```
在命令行中执行
```dash
node c1.js
```
输出结果为
```javascript
 Module {
  id: '.',
  exports: {},
  parent: null,
  filename: '/Users/Desktop/demo01/c1.js',
  loaded: false,
  children: [],
  paths:
   [] }
```
其中主要关注的是`module.exports`这个属性，它表示当前模块对外输出的接口，其他文件加载该模块，实际上就是读取module.exports变量。

***注意：一下都在node环境中执行，也就是使用命令行`node xxx.js` 来执行的*因为CommonJs是在node环境中运行的。**


**创建一个`c2.js`**文件

**`c2.js`**
创建一个对象`c2`，通过`module.exports`把该对象暴露，在`main.js`中，使用`require`进行接收。
```javascript
let c2 = {
  num: 5,
  sum: function(a,b){
    return a+ b
  },
  person: {
    name: 'wbin',
    age: '25'
  }
}
module.exports = c2;
```
**`main.js`**
```javascript
let c2 = require('./c2');
console.log(c2); // { num: 5,sum: [Function: sum],person: { name: 'wbin', age: '25' } }
```
如果要暴露具体内容
**创建c3.js**

**c3.js**
```javascript
let c3 = {
  num: 5,
  sum: function(a,b){
    return a+ b
  },
  person: {
    name: 'wbin',
    age: '25'
  }
}

module.exports.num = c3.num;
module.exports.person = c3.person;
```
**main.js**
```javascript
let {num, person} = require('./c3');
console.log(num, person); // 5 { name: 'wbin', age: '25' }
```
在`c3.js`中，我暴露出`c3`对象的两个属性，`num`和`person`，在`main.js`中使用了ES6的对象扩展来接收对应的值。

###### `module.exports`和`exports`（这点只需要了解即可，在开发过程中，**建议使用`module.exports`**）
为了方便，`Node`为每个模块提供一个`exports`变量，指向`module.exports`。这等同在每个模块头部，有一行这样的命令
```javascript
var exports = module.exports;
```
*但是需要注意的是，不能直接将`exports`变量指向一个值，这种行为相当于切断了`exports`和`module.exports`的关系*

在demo01中创建c4.js
c4.js
```javascript
let c4 = {
  num: 5,
  sum: function(a,b){
    return a+ b
  },
  person: {
    name: 'wbin',
    age: '25'
  }
}
exports = c4;
```
main.js
```javascript
let c4  = require('./c4');
console.log(c4); // {}
```
以上输出结果是无效的，是一个空对象。
正确的写法是
c4.js
```javascript
let c4 = {
  num: 5,
  sum: function(a,b){
    return a+ b
  },
  person: {
    name: 'wbin',
    age: '25'
  }
}
exports.c4 = c4;
```
***为了防止这种不必要的错误，建议使用`module.exports`***


## 02: ES6
参考地址：[《ES6入门》第22和23章](http://es6.ruanyifeng.com/#docs/module)

ES6模块的设计是尽可能的静态化，使得编辑时就能确定模块之间的依赖关系，以及输入和输出变量。而CommonJs和AMD则是在运行时才能实现以上结果。
例如CommonJs模块就是一个对象，输入时必须查找对象属性，而ES6模块则可以暴露出任何变量、函数等。

所以说ES6模块的加载方式是“编译时“加载或者是静态加载。

ES6模块功能主要由两个命令构成：export和import。export用来规定模块的对外接口，import用来输入其他模块提供的功能。

**demo02`e1.js`**
可以使用export暴露变量
```javascript
var firstName = 'w';
var lastName = 'bin';
var year = 1993;

export {firstName, lastName ,year};

```
也可以暴露fun
```javascript
export function mul(a, b){
  return a * b;
}
```
一般情况下，export输出的变量就是本来的名字，但是可以使用as进行重命名。进行重命名之后我们可以给某个变量（可能是fun）这些进行多次输出。
```javascript
function add(a, b){
  return a + b;
}
function reduce(a, b){
  return a - b;
}
export {
  add as sum,
  reduce as mius,
  reduce as jian
}
```
***需要注意的是：ES6模块的`import/export`目前不支持在node环境中直接使用，可以使用webpack打包之后在浏览器中查看效果***

使用import来加载某个模块
*`e2.js`*
```javascript
export let name = 'wbin';
export let age = 26;
```
*`main.js`*
```javascript
import {name, age} from './e2';
console.log(name, age);
```
import命令接收一个大括号{}，里面指定要从其他模块加载的变量名。需要注意的是加载的变量名必须和export输出的变量名一致。但是我们可以在improt中给该名称重新命名。
```javascript
import {name as wbin, age} from './e2';
console.log(wbin, age);
```
*有时我们需要整体加载所需要的模块，可以使用\*号来加载*

*`circle.js`*
```javascript
export function area(radius) {
  return (Math.PI * radius * radius);
}
export function circumference(radius){
  return 2 * Math.PI * radius;
}
```
*`main.js`*
```javascript
// 整体引入
import * as circle from './circle';
console.log(circle.area(2),circle.circumference(2));
```

###### 默认输出 export default
*`e3.js`*
```javascript
export default function(){
  return '123'
}
```
*`main.js`*
```javascript
import name from './e3';
console.log(name()); // 123
```
***注意：使用默认输出时，import不使用{}，使用正常输出时，import需要使用{}!!!***


## 03: AMD
> AMD是"Asynchronous Module Definition"的缩写，意思就是"异步模块定义"。它采用异步方式加载模块，模块的加载不影响它后面语句的运行。所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行。

>AMD也采用require()语句加载模块，它要求两个参数：
```javascript
require([module], callback);
```
在demo03文件夹中创建几个文件 index.html,main.js,sum.js,all.js以及简单的webpack配置 webpack.config.js

**webpack.config.js**
```javascript
module.exports = {
  entry: {
    bundle: './main.js'
  },
  output: {
    filename: '[name].js'
  },
  mode: 'development'
}
```
**sum.js**
```javascript
define(function(){
  return {
    sum: function(a, b){
      return a + b;
    }
  }
})
```
**main.js**
```JavaScript
require(['./sum'],function(sum){
  console.log(sum.sum(1,2));
})
```