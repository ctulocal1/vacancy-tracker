import ersb from "../data/schools-ersb.json" with {type:"json"}
import depts from "../public/data/depts.json" with {type:"json"}

depts.map( (dept) => {
    const school = ersb.find( (school) => parseInt(school.finance_id) === parseInt(dept.dept_id ) )
    if (school) {
        dept.home_district = school.home_district.toString();
        dept.subdistrict = school.subdistrict;
    }
})

let deptsString = JSON.stringify(depts);

Deno.writeTextFileSync("data/depts-ersb.json",deptsString,{create:true})
