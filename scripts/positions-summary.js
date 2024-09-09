import { parse, stringify } from "jsr:@std/csv";
import depts from "../public/data/depts.json" with {type: "json"};

const positionsCSV = Deno.readTextFileSync("../data/all-positions-2024-08-27.csv");
const positions = parse (positionsCSV, {
  skipFirstRow: true,
  strip: true
})

let data = summarize (depts,positions);
//console.log(data);
let dataObj = flatten (data)
let dataString = JSON.stringify(dataObj);
dataString = prettify(dataString)
Deno.writeTextFileSync("../public/data/positions.json",dataString);
console.log("Data written.")

function summarize (depts,positions) {
  const categories = ["SpecEd","Bilingual","Science","Math","Arts","EarlyChild","PhysEd","Counselor","Clinician","Library","WorldLang"] // All the categories that come in the position CSV file
  const cats = initCats(); // This maps CSV file category names to better names

  const index = {}; // The index object makes it easy to work with different mappings
  index.dept = new Map();

  for (let pos of positions) {
    if ( pos.Union === "CTU" ) {
      const dept_id = parseInt(pos["Dept ID"]); // Uniformly convert to integer
      const fte = parseFloat(pos.FTE); // uniformly convert to float to avoid concatenating strings
      let deptObj = {};
      if ( !index.dept.has(dept_id) ) { deptObj = initDept(depts,index,pos) }
      else { deptObj = index.dept.get(dept_id) }
      if ( !deptObj.job.has(pos.JobCd) )
        deptObj.job.set(pos.JobCd, {jobTitle: pos["Job Title"], staffed:0, vacant: 0});
      for (let category of categories) { // initial add of category if in position and not dept
        if ( pos[category].length > 0 && !deptObj.cat.has( cats.get(category) ) )
            deptObj.cat.set(cats.get(category), {staffed: 0, vacant: 0});
        }
      if ( pos.AdjStatus === "AdjVact" ) {
        deptObj.job.get(pos.JobCd).vacant += fte;
        for (let category of categories) {
          if ( pos[category].length > 0 ) {
            deptObj.cat.get(cats.get(category)).vacant += fte;
          }
        }
      } else {
        deptObj.job.get(pos.JobCd).staffed += fte;
        for (let category of categories) {
          if ( pos[category].length > 0 ) {
            deptObj.cat.get(cats.get(category)).staffed += fte;
          }
        }
      }
      //if (pos["Dept ID"] === "22041") {console.log(index.dept.get("22041"))}
      index.dept.set(dept_id,deptObj);
    }
  }
  return index;
}


function initDept (depts,index,pos) {
  let deptObj = depts.find( (dept) => parseInt(dept.dept_id) === parseInt(pos["Dept ID"]))
  if (!deptObj) deptObj = {dept_id: parseInt(pos["Dept ID"]),short_name:pos.Department,ctu_name:pos.Department,type:pos.DeptType,cps_network: pos.Network}
  // console.log("Position:",pos,"Matching Dept Object:",deptObj)
  deptObj.job = new Map(); // Jobs by Job code (e.g. 42 Regular Teacher)
  deptObj.cat = new Map(); // Categories of job (e.g. Library, World Language, Special Ed)
  index.dept.set(parseInt(pos["Dept ID"]),deptObj);
  return deptObj;
}

function initCats () {
  const cats = new Map();
  cats.set("SpecEd","Special Ed");
  cats.set("Bilingual","Bilingual");
  cats.set("Science","Science");
  cats.set("Math","Math");
  cats.set("Arts","Arts");
  cats.set("EarlyChild","Early Childhood");
  cats.set("PhysEd","Physical Ed");
  cats.set("Counselor","Counselor");
  cats.set("Clinician","Clinician");
  cats.set("Library","Librarian");
  cats.set("WorldLang","World Language");
  return cats;
}


function flatten (data) {
  let deptMaps = data.dept;
  let deptEntries = Array.from(deptMaps.values());
  for (let dept of deptEntries) {
    //console.log(++count,dept.short_name)
    dept.jobs = [];
    dept.cats = [];
    for (const code of dept.job.keys()) {
      let jobObj = dept.job.get(code);
      jobObj.jobCode = parseInt(code);
      dept.jobs.push(jobObj)
    }
    for (const cat of dept.cat.keys()) {
      let catObj = {};
      catObj.category = cat;
      catObj.staffed = dept.cat.get(cat).staffed;
      catObj.vacant = dept.cat.get(cat).vacant;
      dept.cats.push(catObj)
    }
    delete dept.job;
    delete dept.cat;
    //console.log(dept);
  }
  return deptEntries;
}


function prettify (dataString) {
  dataString = dataString.replaceAll("},","},\n")
  dataString = dataString.replaceAll(`,"jobs":[`,`,\n  "jobs":[\n`)
  dataString = dataString.replaceAll(`],"cats":[`,`\n  ],\n  "cats":[\n`)
  dataString = dataString.replaceAll(`{"jobTitle"`,`    {"jobTitle"`)
  dataString = dataString.replaceAll(`{"category"`,`    {"category"`)
  dataString = dataString.replaceAll(`]},`,`\n]},`)
  return dataString;
}
