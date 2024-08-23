// import { parse, stringify } from "jsr:@std/csv";

// const schoolsCSV = Deno.readTextFileSync("./schools-represented.csv");
// const schools = parse (schoolsCSV, {
  // columns: ["school_id","dept_id",]
// })
//
const schoolsText = Deno.readTextFileSync("./schools-repped.json");
const schools = JSON.parse(schoolsText);

console.log(schools[0])
schools.map((school) => {
  if (school.scs === "0") { school.scs = false}
  else {school.scs = true};
  return school;
})
console.log(schools[0])

// const schoolsKv = await Deno.openKv();



