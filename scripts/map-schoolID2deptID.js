import schools from "./schools.json" with {type: "json"};
import { DOMParser } from "npm:linkedom";
import { assert } from "jsr:@std/assert@1";

const mapString = Deno.readTextFileSync("./cps-map.svg");
const map = new DOMParser().parseFromString(mapString, "image/svg+xml" );
assert(map);

console.log(schools[0].school_id);
assert(schools);

// let laneObject = schools.find( (school) => parseInt(school.school_id) === parseInt(laneID));

let schoolCircles = map.querySelectorAll("#schools g");
console.log("circle[1] short_name:",schoolCircles[1].querySelector("circle").dataset.short_name,"circle[1] school_id:",schoolCircles[1].id)
for (let circle of schoolCircles) {
  const schoolObject = schools.find( (school) => parseInt(school.school_id) === parseInt(circle.id)); 
  circle.id = schoolObject.dept_id;
}

console.log("circle[1] short_name:",schoolCircles[1].querySelector("circle").dataset.short_name,"circle[1] dept_id:",schoolCircles[1].id);

let mapFileString = map.toString();
Deno.writeTextFileSync("./dept-map.svg",mapFileString);

