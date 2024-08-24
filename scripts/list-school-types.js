import depts from "./public/data/vacancies-by-department.json" with {type: "json"};

let types = new Set();

depts.map( (dept) => types.add(dept.type))

console.log(types);
