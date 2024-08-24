import { DOMParser } from "npm:linkedom";
import depts from "../public/data/departments.json" with {type: "json"};
import deptVacancies from "../public/data/vacancies-by-department.json" with {type: "json"};
import jobs from "../public/data/ctu-jobs.json" with {type: "json"};

let pageTop = `
<!DOCTYPE HTML>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>CTU Vacancy Tracker</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <link rel="shortcut icon" href="/images/ctu-seal.png" type="image/png">
    <link rel="stylesheet" type="text/css" href="/css/tracker.css" />
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


<p>NOTE: Lookup functionality is temporarily off while I reconfigure the output to include all job categories. ~Nate</p>



        <h1>Vacancy Tracker</h1>
        <p><strong>The Chicago Teachers Union is fighting for the schools Chicago&rsquo;s students deserve.</strong> Chicago Public Schools CEO Pedro Martinez claims that the district has improved services by allocating new positions, but the reality is that many of these positions exist on paper only. See the difference between the staffing CPS <em>says</em> it is providing and the number of clinicians, teachers, teacher assistants and all school staff <em>actually working</em> at any given school, network office, citywide job category or throughout an elementary network region. These vacant position numbers were provided by CPS itself, so if you can either confirm or correct it, please click the appropriate button below the data table.</p>
      </div>
`
  let textFirst= `
      <div id="text" class="text">
        <label for="cb1-input">Display data for:</label>
        <div class="combobox combobox-list">
          <div class="group">
            <input id="cb1-input" class="cb_edit" type="text" role="combobox" aria-autocomplete="both" aria-expanded="false" aria-controls="cb1-listbox">
            <button type="button" id="cb1-button" aria-label="Schools" aria-expanded="false" aria-controls="cb1-listbox" tabindex="-1">
              <svg width="18" height="16" aria-hidden="true" focusable="false" style="forced-color-adjust: auto">
                <polygon class="arrow" stroke-width="0" fill-opacity="0.75" fill="currentcolor" points="3,6 15,6 9,14"></polygon>
              </svg>
            </button>
          </div>
`
let listBoxFirst = `
          <ul id="choiceList" role="listbox" aria-label="Schools">
`
let listBoxAfter = `
          </ul>
        </div>
`
let outputBefore = `
        <output for="cb1-input" id="dataOutput" class="dataOutput">
`
let outputAfter = `
        </output>
      </div>
`
let figureFirst = `
      <figure id="cpsmap" class="cpsmap">`

let figureLast = `</figure>`
let pageLast = `
  </div>
</div>
`;
let svgString = Deno.readTextFileSync("./public/images/vacancies-map.svg");

let choiceList = populateChoices()
function populateChoices () {
  return "<li>Placeholder</li>"
}

function render () {
  const pageArray = [
    pageTop,
    textFirst,
    listBoxFirst,
    choiceList,
    listBoxAfter,
    outputBefore,
    outputString,
    outputAfter,
    figureFirst,
    svgString,
    figureLast,
    pageLast,
  ]
  return pageArray.join("\n");
}

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
</thead>
<tbody>
`
// let vacJobArray = [...vacanciesByJob];

jobsByAlpha.map( ({jobCode}) => {
if ( vacanciesByJob.has(jobCode) ) {
    outputString += `
<tr><th scope="row">${jobsMap.get(jobCode)}</th><td>${vacanciesByJob.get(jobCode)}</td></tr>`
  }
})
outputString += `
</tbody>
<tfoot>
<tr><th scope="row">District Total</th><td>${vacanciesByJob.get("District").toLocaleString()}</td></tr>
</tfoot>
</table>
<table>
<thead class="thead">
<tr><td colspan="2" style="font-weight:bold">By Job Category*</td></tr>
<tr><th scope="col">Job Category</th><th scope="col">Vacancies</th></tr>
</thead>
<tbody>
`;

const catsByAlpha = sortObjectsByString([...vacanciesByCat.entries()],0)

catsByAlpha.map( ([category,vacancies]) => {
  outputString += `
<tr><th scope="row">${category}</th><td>${vacancies}</td></tr>`
})
outputString += `</tbody></table>
<p class="asterisk">Not every job fits one of these categories and some fit multiple categories.`;

//console.log(outputString);

const pageString = render ();
Deno.writeTextFileSync("./public/index.html",pageString);
