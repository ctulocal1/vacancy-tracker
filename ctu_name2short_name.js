import schools from "./public/data/schools.json" with {type:"json"}
import depts from "./public/data/departments.json" with {type:"json"}

let schoolsMap = new Map();
let deptsMap = new Map();
let typeSet = new Set();

schools.map( (school) => schoolsMap.set(school.dept_id,school) )

depts.map( (dept) => {
  if ( schoolsMap.has(dept.dept_id) ) dept.shortName = schoolsMap.get(dept.dept_id).short_name;
  deptsMap.set(dept.dept_id,dept);
  typeSet.add(dept.type);
})

// console.log(typeSet);

let departments = {}
departments.district = depts.filter( (dept) => dept.type === "District")
departments.charter = depts.filter( (dept) => dept.type === "Charter")
departments.network = depts.filter( (dept) => dept.type === "Network Office")
departments.office = depts.filter( (dept) => dept.type === "CW Department")

departments.charter = sortObjectsByString(departments.charter,"ctu_name");
departments.network = sortObjectsByString(departments.network,"ctu_name");
departments.office = sortObjectsByString(departments.office,"ctu_name");
departments.district = sortObjectsByString(departments.district,"shortName")

console.log(departments)

function sortObjectsByString (items,key) {
  const sorted = items.sort((a, b) => {
    console.log(key, a, b);
    const nameA = a[key].toUpperCase(); // ignore upper and lowercase
    const nameB = b[key].toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    // names must be equal
    return 0;
  });
  // console.log(sorted)
  return sorted;
}

