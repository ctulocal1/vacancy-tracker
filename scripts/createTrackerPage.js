// Snippets of HTML follow. These are layout bits.
let pageTop = `
<!DOCTYPE HTML>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Underfunded &amp; Understaffed Tracker</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <link rel="shortcut icon" href="/images/ctu-seal.png" type="image/png">
    <link rel="stylesheet" type="text/css" href="/css/tracker.css" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300..800&display=swap" rel="stylesheet">
  </head>
  <body>
    <dialog id="modal" class="modal">
      <div class="modal-inner">
        <form id="modal-form">
          <button type="button" aria-label="close" formmethod="dialog" class="modal-close" formnovalidate="">×</button>
          <div id="modal-content"></div>
        </form>
      </div>
    </dialog>
    <div class="grid-container">
      <header class="header">
        <img src="/images/ctu-logo.png" alt="Chicago Teachers Union" style="height: 100px;">
      </header>
      <div class="intro">


        <h1>Underfunded &amp; Understaffed Tracker</h1>
        <p><strong>The Chicago Teachers Union is fighting for the schools Chicago’s students deserve.</strong> Chicago Public Schools CEO Pedro Martinez claims that the district has improved resources for our students by allocating new positions, but the reality is that many of these positions exist on paper only. Select a school in the dropdown or on the map below to see the difference between the staffing CPS <em>says</em> it provides and the number of clinicians, teachers, teacher assistants and all school staff <em>actually working</em> at any given school, network office or citywide department.</p>
<h2>CTU Members: Share Your School’s Staffing Story</h2>
<p>Nobody knows better than CTU members what’s happening in our schools. Use our <a href="https://docs.google.com/forms/d/e/1FAIpQLSeSHguXxHgYvaO6vGBj1MCRBVcDLGVHWfcvwwLA0jnW9F3ieg/viewform">staffing report form</a> to tell us how many unfilled positions are at your school and, and the ways that those vacancies and other positions that <em>should</em> be budgeted in your school or department affect your students and your work.</p>
<p><a class="button" href="https://docs.google.com/forms/d/e/1FAIpQLSeSHguXxHgYvaO6vGBj1MCRBVcDLGVHWfcvwwLA0jnW9F3ieg/viewform">Share Your Story</a></p>
      </div>
`
let listBoxBefore = `
      <div id="text" class="text">
<div class="sticker">
        <h2>By the Numbers</h2>
        <label for="cb1-input">Display data for:</label>
        <div class="combobox combobox-list">
          <div class="group">
            <input list="departments" id="cb1-input" class="cb_edit" type="text" role="combobox" aria-autocomplete="both" aria-expanded="false" aria-controls="cb1-listbox">
    <button type="button" id="cb1-button" aria-label="Schools and Departments" aria-expanded="false" aria-controls="cb1-listbox" tabindex="-1">
      <svg width="18" height="16" aria-hidden="true" focusable="false" style="forced-color-adjust: auto">
        <polygon class="arrow" stroke-width="0" fill-opacity="0.75" fill="currentcolor" points="3,6 15,6 9,14"></polygon>
      </svg>
    </button>
<ul role="listbox" id="departments" aria-label="Schools and Departments">
`
//
// A series of <li role="option"...> elements will be generated and inserted here as choiceList.
// The populateChoices function is after the render and before the citywide.
//

import optionObj from "../public/data/deptnames.json" with {type: "json"};
let choiceList = populateChoices()

let listBoxAfter = `
</ul>
          </div>
      </div> <!-- closes out the listBox section -->
`
  


let outputBefore = ` <div id="dataOutput" class="dataOutput"> `
//
// On load, this includes the citywide data calculated below.
// Content of "output" will dynamically change when a school is picked in either the combobox or map.
let outputString = citywide();

let outputAfter = `
        </div>
      </div>
        </div>
`


//
// The actual text of the SVG file will be inserted here so it is all loaded along with the page and 
// its elements are accessible for DOM manipulation.
let figureBefore = `
      <figure id="cpsmap" class="cpsmap">
<h2>Underfunded and Understaffed Map</h2>
<p>On the map below, each circle represents a CPS school or CPS office site. Citywide departments are represented in the upper right of the map. Circles are sized by the raw number of unfilled positions in the school or department. Circles that aren’t filled have no vacancies. Click or tap any circle to see its name and a list of vacant positions in that school or department.</p>
<div>
`
let svgString = Deno.readTextFileSync("./public/images/vacancies-map.svg");

let figureLast = `</div></figure>`



let pageLast = `
  </div>
<footer>
<div>
<p>Copyright 2024 Chicago Teachers Union, all rights reserved.</p>
<p>For more information, visit the <a href="https://www.ctulocal1.org/">Chicago Teachers Union</a> website.</p>
</div>
</footer>
<script src="js/vacancy-output.js"></script>
<script src="js/combobox.js"></script>
</body>
</html>
`;

// <script src="js/combobox.js"></script>

function render () {
  const pageArray = [    pageTop,
    listBoxBefore,
    choiceList,
    listBoxAfter,
    outputBefore,
    outputString,
    outputAfter,
    figureBefore,
    svgString,
    figureLast,
    pageLast,
  ]
  return pageArray.join("\n");
}


// The code in the next section creates the initial outputString inserted between outputBefore and outputAfter.
// This will appear on first load.
// These functions will be slightly altered to dynamically insert data in the output element when 
// a user selects a school or department.
// 
import depts from "../public/data/departments.json" with {type: "json"};
import deptVacancies from "../public/data/vacancies-by-department.json" with {type: "json"};
import jobs from "../public/data/ctu-jobs.json" with {type: "json"};

function citywide () {
  const vacanciesByJob = new Map();
  vacanciesByJob.set("District",0);

  const vacanciesByCat = new Map();

  for (const dept of deptVacancies) {
    const posArray = Object.entries(dept.positionsVacant);
    posArray.map ( (posVac) => {
      //console.log(posVac)
      const [jobCode,jobVacs] = posVac;
      //console.log("Position Code:",jobCode,"Position Vacancies:",jobVacs)
      const acc = vacanciesByJob.get("District")
      vacanciesByJob.set("District",acc+jobVacs)
      if (vacanciesByJob.has(jobCode)) {
        const acc = vacanciesByJob.get(jobCode)
        vacanciesByJob.set(jobCode, acc + jobVacs)
      } else vacanciesByJob.set(jobCode,jobVacs);
    })


    const catArray = Object.entries(dept.categoriesVacant);
    catArray.map ( (catVac) => {
      const [catCode,catVacs] = catVac;
      if (vacanciesByCat.has(catCode)) {
        const acc = vacanciesByCat.get(catCode)
        vacanciesByCat.set(catCode, acc + catVacs)
      } else vacanciesByCat.set(catCode,catVacs);
    })
  }
  // console.log(vacanciesByJob)
  // console.log(vacanciesByCat)
  function sortObjectsByString (items,key) {
    //console.log(items[0][key])
    const sorted = items.sort((a, b) => {
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

  const jobsMap = new Map();
  const jobsByAlpha = sortObjectsByString(jobs,"jobTitle");
  jobsByAlpha.map((job)=>jobsMap.set(job.jobCode,job.jobTitle));

  let outputString = `
<table><caption><div>District Vacancies By Job</div></caption>
<thead class="thead">
<tr><td colspan="2" style="font-weight:bold">By Job Title</td></tr>
<tr><th scope="col">Job Title</th><th scope="col">Vacancies</th></tr>
</thead> <tbody>
`
  // let vacJobArray = [...vacanciesByJob];

  jobsByAlpha.map( ({jobCode}) => {

    if ( vacanciesByJob.has(jobCode) ) {
      outputString += `
<tr><th scope="row">${jobsMap.get(jobCode)}</th><td>${parseFloat( vacanciesByJob.get(jobCode) ).toFixed(1)}</td></tr>`
    }
  })
  outputString += `
</tbody> <tfoot>
<tr><th scope="row">District Total</th><td>${vacanciesByJob.get("District").toLocaleString(undefined,{minimumFractionDigits: 1})}</td></tr>
</tfoot> </table>
<table> <thead class="thead">
<tr><td colspan="2" style="font-weight:bold">By Job Category*</td></tr>
<tr><th scope="col">Job Category</th><th scope="col">Vacancies</th></tr>
</thead> <tbody>
`;

  const catsByAlpha = sortObjectsByString([...vacanciesByCat.entries()],0)

  catsByAlpha.map( ([category,vacancies]) => {
    outputString += `
<tr><th scope="row">${category}</th><td>${parseFloat(vacancies).toFixed(1)}</td></tr>`
  })
  outputString += `</tbody></table>
<p class="asterisk">Not every job fits one of these categories and some fit multiple categories.`;

  //console.log(outputString);
  return outputString;
}

//
//
// Generates the <li role="option"...> elements to populate the combobox.
//
function populateChoices () {

//console.log ("Option Object:",optionObj)
let datalistOpts = `
<li id="lb-district" role="option">District-wide Data</li>
`
datalistOpts += `<div>Network Office</div>`
for (const net of optionObj.network) {
  datalistOpts += `<li id="lb-${net}" role="option">${net}</li>`
}
for (const ofc of optionObj.office) {
  datalistOpts += `<li id="lb-${ofc}" role="option">${ofc}</li>`
}
for (const dist of optionObj.district) {
  datalistOpts += `<li id="lb-${dist}" role="option">${dist}</li>`
}
for (const chrt of optionObj.charter) {
  datalistOpts += `<li id="lb-${chrt}" role="option">${chrt}</li>`
}
return datalistOpts;
}



const pageString = render ();
Deno.writeTextFileSync("./public/index.html",pageString);
console.log("Site written to ./public/index.html")
