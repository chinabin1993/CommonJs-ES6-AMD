var firstName = 'w';
var lastName = 'bin';
var year = 1993;

export {firstName, lastName ,year};


export function mul(a, b){
  return a * b;
}


// 使用as关键字重命名
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