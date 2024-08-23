import { parse, stringify } from "jsr:@std/csv";
import schools from "../data/schools.json" with {type: "json"};

const deptsMap = new Map();
// console.log("Schools[0]:",schools[0])

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
  const v = dept.positionsVacant;
    v.set("SpecEd",0);
    v.set("Bilingual",0);
    v.set("Science",0);
    v.set("Math",0);
    v.set("Arts",0);
    v.set("EarlyChild",0);
    v.set("PhysEd",0);
    v.set("Counselor",0);
    v.set("SpecEd",0);
    v.set("Library",0);
    v.set("WorldLang",0);
}

schools.forEach( (school) => {addSchool(school); 
  schoolsByName.set(school.short_name,school.dept_id)});
// console.log(deptsMap);
// console.log(deptsMap.get("66602"));


const vacanciesCSV = Deno.readTextFileSync("../data/Vacancies-2024-08-21.csv");
const vacancies = parse (vacanciesCSV, {
  skipFirstRow: true,
  strip: true
})

const jobsMap = new Map();

for (const v of vacancies) {
  const deptID = v["Dept ID"];
  if (!jobsMap.get(v.JobCd)) {
    const jobObj = {jobCode:v.JobCd,type:v.Type,jobTitle: v["Job Title"]}
    jobsMap.set(v.JobCd,jobObj)
  }
  let dept = deptsMap.get(deptID);
  if (!dept) {
    deptsMap.set(deptID,{
      deptId: deptID, 
      short_name: v.Dept,
      ctu_name: v.Department,
      cps_network: v.Network
    })
    dept = deptsMap.get(deptID);
    initPositionsVacant(dept);
    // console.log(v.Dept)
    cwDeptsByName.set(deptID,v.Dept);
  }
  delete v.PointInTimeDt;
  delete v["Pos #"];
  delete v.FTE;
  delete v["Dept ID"];
  delete v.Network2;
  delete v.Network;
  delete v.Zipcode;
  if (dept.positionsVacant.get(v.JobCd)) {
    dept.positionsVacant.set(v.JobCd,dept.positionsVacant.get(v.JobCd)+1) ;
  } else {dept.positionsVacant.set(v.JobCd,1)}
  if (v.SpecEd.length > 0)  dept.positionsVacant.set("SpecEd",dept.positionsVacant.get("SpecEd")+1);
  if (v.Bilingual.length > 0)  dept.positionsVacant.set("Bilingual",dept.positionsVacant.get("Bilingual")+1);
  if (v.Science.length > 0)  dept.positionsVacant.set("Science",dept.positionsVacant.get("Science")+1);
  if (v.Math.length > 0)  dept.positionsVacant.set("Math",dept.positionsVacant.get("Math")+1);
  if (v.Arts.length > 0)  dept.positionsVacant.set("Arts",dept.positionsVacant.get("Arts")+1);
  if (v.EarlyChild.length > 0)  dept.positionsVacant.set("EarlyChild",dept.positionsVacant.get("EarlyChild")+1);
  if (v.PhysEd.length > 0)  dept.positionsVacant.set("PhysEd",dept.positionsVacant.get("PhysEd")+1);
  if (v.Counselor.length > 0)  dept.positionsVacant.set("Counselor",dept.positionsVacant.get("Counselor")+1);
  if (v.Clinician.length > 0)  dept.positionsVacant.set("SpecEd",dept.positionsVacant.get("SpecEd")+1);
  if (v.Library.length > 0)  dept.positionsVacant.set("Library",dept.positionsVacant.get("Library")+1);
  if (v.WorldLang.length > 0)  dept.positionsVacant.set("WorldLang",dept.positionsVacant.get("WorldLang")+1);
}

let schoolsAlphabeticalByName = Array.from(schoolsByName)
// console.log(schoolsAlphabeticalByName);
let tableStrings = schoolsAlphabeticalByName.map( (schoolName) => {
  let htmlString = `<table><thead><caption>${schoolName[0]}</caption></thead><tbody>`
  let school = deptsMap.get(schoolName[1]);
  // if (!school) console.log(schoolName)
  let vacantJobs = Array.from(school.positionsVacant);
  let totalVacancies = 0;
  for (const job of vacantJobs) {
    if ( !job[0].match(/[A-Za-z]/) ) {
      totalVacancies += job[1];
      // console.log("Job Title Code:",job[0],"Running Total:",totalVacancies);
      let jobObj = jobsMap.get(job[0])
      // console.log(jobObj.jobTitle,":",job[1],"vacancies");
      htmlString = htmlString.concat(`<tr><th scope="row">${job[0]} ${jobObj.jobTitle}</th><td>${job[1]} vacancies</td></tr>` )
  // console.log(job[0],htmlString);
    }// else console.log("Job Code?",job[0]);
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


// console.log(deptsMap);
// console.log(jobsMap);
// console.log("Jobs Count:",jobsMap.size);
// console.log("CW Depts:",cwDepts);
// console.log(vacancies) :;
// console.log("Schools",cwDeptsByName);
// console.log("Citywide:",schoolsByName);
