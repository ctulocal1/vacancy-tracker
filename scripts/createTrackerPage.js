// Snippets of HTML follow. These are layout bits.
let pageTop = `
<!DOCTYPE HTML>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Underfunded &amp; Understaffed Tracker</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <meta property="og:image" content="/images/share.png" />
    <link rel="shortcut icon" href="/images/ctu-seal.png" type="image/png">
    <link rel="stylesheet" type="text/css" href="/css/tracker.css" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@1,8..60,200..900&display=swap" rel="stylesheet">
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
        <p><strong>The Chicago Teachers Union is fighting for the schools Chicago’s students deserve.</strong> Chicago Public Schools CEO Pedro Martinez claims that the district has improved resources for our students by allocating new positions, but the reality is that many of these positions exist on paper only. Select a school in the dropdown or on the map below to see the number of clinicians, teachers, teacher assistants, librarians and all school staff <em>actually working</em> at any given school, network office or citywide department. Our members’ reports from the field provide an even clearer picture of the impact #UnderfundedUnderstaffed schools have on our students.</p>
<div class="quotebox">
  <blockquote class="offLeft"></blockquote>
  <blockquote class="centered"><p>Class sizes are too big. My largest class has 36 students. Students who legally require a one-on-one [aide] are not receiving support. Newcomers are not getting adequate language support and become easily frustrated or disengaged.</p><cite>Teacher, <span class="nobreak">Daley Elementary</span></cite></blockquote>
<blockquote class="offRight"></blockquote>
</div>
<h2>CTU Members: Share Your School’s Staffing Story</h2>
<p>Nobody knows better than CTU members what’s happening in our schools. Use our <a href="https://docs.google.com/forms/d/e/1FAIpQLSeSHguXxHgYvaO6vGBj1MCRBVcDLGVHWfcvwwLA0jnW9F3ieg/viewform">staffing report form</a> to tell us how many unfilled positions are at your school. And share the ways that those vacancies and other positions your school or department needs affect your students and your work.</p>
<p class="button"><a class="button" href="https://docs.google.com/forms/d/e/1FAIpQLSeSHguXxHgYvaO6vGBj1MCRBVcDLGVHWfcvwwLA0jnW9F3ieg/viewform">Share Your Story</a></p>
      </div>
`
let listBoxBefore = `
      <div id="text" class="text">
<p class="skiplink"><a href="#cpsmap">Go to Tracker Map</a></p>
<div class="sticker">
        <h2>By the Numbers</h2>
        <p>The information below is based on CPS vacancy data as of Aug. 27, 2024.</p>
        <label for="cb1-input">Display data for:</label>
        <div class="combobox combobox-list">
          <div class="group">
            <button class="clear" aria-label="clear input" type="button">
            X
            </button>
            <input list="departments" id="cb1-input" class="cb_edit" type="text" role="combobox" aria-autocomplete="both" aria-expanded="false" aria-controls="cb1-listbox" autocomplete="off" autocapitalize="off">
    <button type="button" id="cb1-button" aria-label="Schools and Departments" aria-expanded="false" aria-controls="cb1-listbox" tabindex="-1" class="arrow">
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
<h2>#UnderfundedUnderstaffed Map</h2>
<p>On the map below, each circle represents a CPS school or CPS office site. Citywide departments are represented in the upper right of the map. Circles are sized by the raw number of unfilled positions in the school or department. Circles that aren’t filled have no vacancies. Click or tap any circle to see its name and a list of vacant positions in that school or department.</p>
<div>
`
let svgString = Deno.readTextFileSync("../public/images/vacancies-map.svg");

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
<script src="js/quotes.js"></script>
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
import depts from "../public/data/schools.json" with {type: "json"};
import deptVacancies from "../public/data/vacancies-by-department.json" with {type: "json"};
import jobs from "../public/data/ctu-jobs.json" with {type: "json"};

function citywide () {

  let districtTotal = 0;
  const jobsMap = new Map();
  const jobsByAlpha = sortObjectsByString(jobs,"jobTitle");
  jobsByAlpha.map((job)=>jobsMap.set(parseInt(job.jobCode),job.jobTitle));
//console.log(jobsMap);

  let outputString = `
<table><caption><div>District Vacancies By Job</div></caption>
<thead class="thead">
<tr><td colspan="2" style="font-weight:bold">By Job Title</td></tr>
<tr><th scope="col">Job Title</th><th scope="col">Vacancies</th></tr>
</thead> <tbody>
`
  // let vacJobArray = [...vacanciesByJob];

  let dist = deptVacancies.find (dept => dept.dept_id="00000");
    //console.log(dist.positionsVacant)
  let pos = Object.entries(dist.positionsVacant);
  let cat = Object.entries(dist.categoriesVacant);
    //console.log(pos,cat)
  let posMap = new Map ();
    pos.map( vac => {
        //console.log(vac);
        posMap.set(parseInt(vac[0]),vac[1]);
})
  let catMap = new Map ();
    cat.map( vac => catMap.set(vac[0],vac[1]))
 //console.log(posMap,catMap);
  pos.map( (vac) => {
      let jobCode = parseInt(vac[0]);
      //console.log(jobCode);
    if ( posMap.has(jobCode) ) {
      outputString += `
<tr><th scope="row">${jobsMap.get(jobCode)}</th><td>${parseFloat( posMap.get(jobCode) ).toFixed(1)}</td></tr>`
    }
    districtTotal += posMap.get(jobCode);
  })
  outputString += `
</tbody> <tfoot>
<tr><th scope="row">District Total</th><td>${districtTotal.toLocaleString(undefined,{minimumFractionDigits: 1})}</td></tr>
</tfoot> </table>
<table> <thead class="thead">
<tr><td colspan="2" style="font-weight:bold">By Job Category*</td></tr>
<tr><th scope="col">Job Category</th><th scope="col">Vacancies</th></tr>
</thead> <tbody>
`;


  cat.map( ([category,vacancies]) => {
    outputString += `
<tr><th scope="row">${category}</th><td>${parseFloat(vacancies).toFixed(1)}</td></tr>`
  })
  outputString += `</tbody></table>
<p class="asterisk">Not every job fits one of these categories and some fit multiple categories.`;

  //console.log(outputString);
  return outputString;
}

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
//
//
// Generates the <li role="option"...> elements to populate the combobox.
//
function populateChoices () {

//console.log ("Option Object:",optionObj)
let datalistOpts = `
<li id="lb-district" role="option">District-wide Data</li>
`
  datalistOpts +=`<div>Citywide Departments</div>`
for (const ofc of optionObj.office) {
  datalistOpts += `<li id="lb-${ofc}" role="option">${ofc}</li>`
}
  datalistOpts +=`<div>District Schools</div>`
for (const dist of optionObj.district) {
  datalistOpts += `<li id="lb-${dist}" role="option">${dist}</li>`
}
  datalistOpts +=`<div>Charter Schools</div>`
for (const chrt of optionObj.charter) {
  datalistOpts += `<li id="lb-${chrt}" role="option">${chrt}</li>`
}
datalistOpts += `<div>Network Offices</div>`
for (const net of optionObj.network) {
  datalistOpts += `<li id="lb-${net}" role="option">${net}</li>`
}
return datalistOpts;
}



const pageString = render ();
Deno.writeTextFileSync("../public/index.html",pageString);
console.log("Site written to ./public/index.html")
