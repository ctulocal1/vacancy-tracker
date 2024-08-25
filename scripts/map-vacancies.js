import depts from "../public/data/vacancies-by-department.json" with {type: "json"};
import jobObj from "../public/data/ctu-jobs.json" with {type: "json"};
import { DOMParser } from "npm:linkedom";
import { assert } from "jsr:@std/assert@1";

const mapString = Deno.readTextFileSync("./public/images/dept-map.svg");
const map = new DOMParser().parseFromString(mapString, "image/svg+xml" );
assert(map);

console.log(depts[0].dept_id);
assert(depts);

// let laneObject = depts.find( (dept) => parseInt(dept.dept_id) === parseInt(laneID));

let vacancies = new Map();
depts.map( (dept) => {
  vacancies.set(dept.dept_id,dept)
})

let jobs = new Map();
jobObj.map( (job) => {
  jobs.set(job.jobCode,job)
})

//console.log(jobs)
//console.log(vacancies);

let officeGroups = map.querySelectorAll("#offices g");
for (let group of officeGroups) {
  const circle = group.querySelector("circle");
  const vacancy = vacancies.get(group.id);
  console.log(vacancy)
  if (vacancy) {
    console.log(vacancy.short_name,"Job Title with Vacancies:",Object.entries(vacancy.positionsVacant).length);
    if (Object.entries(vacancy.positionsVacant).length > 0) {
      let vacantPositions = Object.values(vacancy.positionsVacant);
      //console.log(vacantPositions);
      let totalVacancies = vacantPositions.reduce( (total,job) =>  total + job ,0)
      //console.log(vacancy.short_name,"Total Vacancies:",totalVacancies);
      //console.log(vacancy.short_name,"Square Root of Total:",Math.sqrt(totalVacancies));
      circle.setAttributeNS(null,"r",Math.sqrt(totalVacancies)*3);
      circle.style.fill = "#ed1b2f"
    } else circle.style.fill = "#cccccc"
  }
}

let schoolGroups = map.querySelectorAll("#schools g");
for (let group of schoolGroups) {
  const circle = group.querySelector("circle");
  const vacancy = vacancies.get(group.id);
  if (vacancy) {
    console.log(vacancy.short_name,"Job Title with Vacancies:",Object.entries(vacancy.positionsVacant).length);
    if (Object.entries(vacancy.positionsVacant).length > 0) {
      let vacantPositions = Object.values(vacancy.positionsVacant);
      //console.log(vacantPositions);
      let totalVacancies = vacantPositions.reduce( (total,job) =>  total + job ,0)
      //console.log(vacancy.short_name,"Total Vacancies:",totalVacancies);
      //console.log(vacancy.short_name,"Square Root of Total:",Math.sqrt(totalVacancies));
      circle.setAttributeNS(null,"r",Math.sqrt(totalVacancies)*3);
      circle.style.fill = "#ed1b2f"
    } else circle.style.fill = "#cccccc"
  }
}

let mapOut = map.toString();

Deno.writeTextFileSync("./public/images/vacancies-map.svg",mapOut);

/*
let officeCircles = map.querySelectorAll("#offices g");
console.log("circle[1] short_name:",officeCircles[1].querySelector("circle").dataset.short_name,"circle[1] dept_id:",officeCircles[1].id)
for (let circle of officeCircles) {
  const officeObject = offices.find( (office) => parseInt(office.dept_id) === parseInt(circle.id)); 
  circle.id = officeObject.dept_id;
}

console.log("circle[1] short_name:",deptCircles[1].querySelector("circle").dataset.short_name,"circle[1] dept_id:",deptCircles[1].id);


// let mapFileString = map.toString();
// Deno.writeTextFileSync("./vacancies-map.svg",mapFileString);

*/
