import { parse, stringify } from "jsr:@std/csv";
import schools from "../public/data/schools.json" with {type: "json"};

let logged1 = 0;

const deptsMap = new Map();
//console.log("Schools[0]:",schools[0])

const cwDeptsByName = new Map ();
const schoolsByName = new Map ();

function addSchool (school) {
  delete school.school_id2;
  school.short_name = school.name_short;
  school.ctu_name = school.name_ctu;
  delete school.name_short;
  delete school.name_ctu;
  delete school.organizer;
  deptsMap.set(school.dept_id,school);
  initPositionsVacant(school)
}
function initPositionsVacant(dept) {
  dept.positionsVacant = new Map();
  dept.categoriesVacant = new Map();
  const v = dept.categoriesVacant;
    v.set("Clinician",0);
    v.set("Bilingual",0);
    v.set("Science",0);
    v.set("Math",0);
    v.set("Arts",0);
    v.set("Early Childhood",0);
    v.set("Physical Ed",0);
    v.set("Counselor",0);
    v.set("Special Ed",0);
    v.set("Library",0);
    v.set("World Language",0);
}

schools.forEach( (school) => {addSchool(school); 
  schoolsByName.set(school.short_name,school.dept_id)});
//console.log(deptsMap);
//console.log(deptsMap.get("66602"));
//console.log(schoolsByName)

const vacanciesCSV = Deno.readTextFileSync("../data/Vacancies-2024-08-21.csv");
const vacancies = parse (vacanciesCSV, {
  skipFirstRow: true,
  strip: true
})

const jobsMap = new Map();

for (const v of vacancies) {
  const deptID = v["Dept ID"];
  if (!jobsMap.has(v.JobCd)) {
    const jobObj = {jobCode:v.JobCd,type:v.Type,jobTitle: v["Job Title"],citywideVacancies:0}
    jobsMap.set(v.JobCd,jobObj)
  }
  jobsMap.get(v.JobCd).citywideVacancies++
  let dept = deptsMap.get(deptID);
  if (!dept) {
    deptsMap.set(deptID,{
      dept_id: deptID, 
      short_name: v.Dept,
      ctu_name: v.Department,
      cps_network: v.Network
    })
    dept = deptsMap.get(deptID);
    initPositionsVacant(dept);
    //console.log(v.Dept)
    cwDeptsByName.set(deptID,v.Dept);
  }
  delete v.PointInTimeDt;
  delete v["Pos #"];
  delete v["Dept ID"];
  delete v.Network2;
  delete v.Network;
  delete v.Zipcode;
  if (dept.positionsVacant.has(v.JobCd)) {
    dept.positionsVacant.set(v.JobCd,dept.positionsVacant.get(v.JobCd)+parseFloat(v.FTE)) ;
  } else {dept.positionsVacant.set(v.JobCd,parseFloat(v.FTE))}
  if (v["Special Ed"].length > 0)  dept.categoriesVacant.set("Special Ed",dept.categoriesVacant.get("Special Ed") + parseFloat(v.FTE));
 //console.log(v,v["Special Ed"],dept.categoriesVacant.get("Special Ed"));
  if (v.Bilingual.length > 0)  dept.categoriesVacant.set("Bilingual",dept.categoriesVacant.get("Bilingual") + parseFloat(v.FTE));
  if (v.Science.length > 0)  dept.categoriesVacant.set("Science",dept.categoriesVacant.get("Science") + parseFloat(v.FTE));
  if (v.Math.length > 0)  dept.categoriesVacant.set("Math",dept.categoriesVacant.get("Math") + parseFloat(v.FTE));
  if (v.Arts.length > 0)  dept.categoriesVacant.set("Arts",dept.categoriesVacant.get("Arts") + parseFloat(v.FTE));
  if (v["Early Childhood"].length > 0)  dept.categoriesVacant.set("Early Childhood",dept.categoriesVacant.get("Early Childhood") + parseFloat(v.FTE));
  if (v["Physical Ed"].length > 0)  dept.categoriesVacant.set("Physical Ed",dept.categoriesVacant.get("Physical Ed") + parseFloat(v.FTE));
  if (v.Counselor.length > 0)  dept.categoriesVacant.set("Counselor",dept.categoriesVacant.get("Counselor") + parseFloat(v.FTE));
  if (v.Clinician.length > 0)  dept.categoriesVacant.set("Clinician",dept.categoriesVacant.get("Clinician") + parseFloat(v.FTE));
  if (v.Library.length > 0)  dept.categoriesVacant.set("Library",dept.categoriesVacant.get("Library") + parseFloat(v.FTE));
  if (v["World Language"].length > 0)  dept.categoriesVacant.set("World Language",dept.categoriesVacant.get("World Language") + parseFloat(v.FTE));
}

let schoolsAlphabeticalByName = Array.from(schoolsByName)
//console.log(schoolsAlphabeticalByName);
let tableStrings = schoolsAlphabeticalByName.map( (schoolName) => {
  let htmlString = `<table><thead><caption>${schoolName[0]}</caption></thead><tbody>`
  let school = deptsMap.get(schoolName[1]);
  let vacantJobs = Array.from(school.positionsVacant);
  let totalVacancies = 0;
  for (const job of vacantJobs) {
    if ( !job[0].match(/[A-Za-z]/) ) {
      totalVacancies += job[1];
      //console.log("Job Title Code:",job[0],"Running Total:",totalVacancies);
      let jobObj = jobsMap.get(job[0])
      //console.log(jobObj.jobTitle,":",job[1],"vacancies");
      htmlString = htmlString.concat(`<tr><th scope="row">${job[0]} ${jobObj.jobTitle}</th><td>${job[1]} vacancies</td></tr>` )
  //console.log(job[0],htmlString);
    }
  }
  htmlString = htmlString.concat( `</tbody><tfoot><th scope="row">Total</th><td>${totalVacancies} vacancies</td></tr></tfoot></table>` )
  return htmlString;
})
let htmlDoc = `<!doctype html><html lang="en-US" prefix="og: https://ogp.me/ns#"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>
body * {font-family: "Open Sans", sans-serif; box-sizing: border-box;}
table {margin: 40px 5px; width: calc(100vw - 10px); max-width: 500px; padding:0; border-collapse: collapse;}
caption {font-size: 1.3em; font-weight: bold; line-height: 1.3; text-align: left; border-bottom: 1px solid #333; width: 100%; max-width: 500px;}
tr {max-width: 500px;}
th,td {font-weight: normal; text-align:right; max-width: 300px; padding-right: 1em;}
tfoot td, tfoot th {border-top: 1px solid #333; border-bottom: 2px solid #333;}
</style></head><body>`
htmlDoc = htmlDoc.concat( tableStrings.join("\n"), `</body></html>` );

Deno.writeTextFileSync("../public/school-vacancies.html",htmlDoc);

let deptsString = "";
let deptsArray = []

deptsMap.forEach(logMapElements);
function logMapElements(value,key,map) {
  let dept = {};
  dept = value;
  dept.positionsVacant = Object.fromEntries(value.positionsVacant);
  dept.categoriesVacant = Object.fromEntries(value.categoriesVacant);
  const deptString = ",\n" + JSON.stringify(dept);
  if (!dept.type && dept.short_name.match("Network")) dept.type = "Network Office"
  else if (!dept.type) dept.type = "CW Department";
  const type = dept.type;
  //console.log(dept.short_name,type)
  deptsString += deptString;
}
deptsString = deptsString.slice(2) // Get rid of initial ,\n so JSON will be valid.
deptsString = "[\n" + deptsString + "\n]"

//const deptsArray = deptsMap.values()
//for (const dept of deptsArray) {
  //console.log(dept.short_name)
//}
//console.log(deptsArray)

//Deno.writeTextFileSync("./public/data/vacancies-by-department.json",deptsString);
console.log("Updated vacancy info in ./public/data/vacancies-by-department.json.")

//console.log(deptsMap);
//console.log(jobsMap);
//console.log("Jobs Count:",jobsMap.size);
//console.log("CW Depts:",cwDepts);
//console.log(vacancies) :;
//console.log("Schools",cwDeptsByName);
//console.log("Citywide:",schoolsByName);
