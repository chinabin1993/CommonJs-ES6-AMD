// import {name, age} from './e2';
// console.log(name, age);


// import {name as wbin, age} from './e2';
// console.log(wbin, age);


// 整体引入
import * as circle from './circle';
console.log(circle.area(2),circle.circumference(2));

import name from './e3';
console.log(name());