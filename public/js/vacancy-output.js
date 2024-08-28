const output = document.querySelector("#dataOutput")
const input = document.querySelector("#cb1-input")
const options = document.querySelectorAll("option");

async function getData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error.message);
  }
}

let circles = new Map();
let schools = document.querySelectorAll("#cpsmap #schools g")
let offices = document.querySelectorAll("#cpsmap #offices g")
for (const school of schools) {
  const circle = school.querySelector("circle");
  if (circle.dataset.short_name) circles.set(school.id,circle.dataset.short_name);
  school.addEventListener("click",outputSchoolData)
}
for (const office of offices) {
  const circle = office.querySelector("circle");
  if (circle.dataset.short_name) circles.set(office.id,circle.dataset.short_name);
  office.addEventListener("click",outputSchoolData)
}
//console.log("Circles:",circles)

let jobsMap = new Map();
const index = {}
const names = {}
names.network = new Set()
names.office = new Set()
names.district = new Set()
names.charter = new Set()
getData("data/schools.json")
  .then((departments) => {
    //console.log(departments)
    index.dept_id = new Map();
    index.short_name = new Map();
    for (const d of departments) {
      d.short_name = "Not Named"+d.dept_id;
      if (circles.has(d.dept_id)) d.short_name = circles.get(d.dept_id) 
      else d.short_name = d.ctu_name;
      index.dept_id.set (d.dept_id,d);
      index.short_name.set(d.short_name,d);
      let name = d.short_name;
      if (d.type === "Charter") { names.charter.add(name); }
      else if (d.type === "Network Office") { names.network.add(name);}
      else if (d.type === "CW Department") { names.office.add(name);}
      else if (d.type) { names.district.add(name);}
    }
    //console.log("After depts:",names);
  })
  .then( (index) => getData( "data/ctu-jobs.json" ) )
  .then( (jobData) => {
    for (let job of jobData) {
      jobsMap.set( parseInt(job.jobCode),job );
    }
  })
  .then ( (index) => getData("data/vacancies-by-department.json") )
  .then ( (vacancies) => {
    //console.log("Vacancies:",vacancies)
    for (const v of vacancies) {
      v.short_name = "No Name"+v.dept_id;
      if (circles.has(v.dept_id)) v.short_name = circles.get(v.dept_id) 
      else v.short_name = v.ctu_name;
      index.dept_id.set(v.dept_id,v);
      index.short_name.set(v.short_name,v)
        let name = "No Name";
        if (v.ctu_name) name = v.ctu_name;
        if (v.short_name) name = v.short_name;
        if (v.type === "Charter") { names.charter.add(name) }
        else if (v.type) { names.district.add(name) }
        else if (name.match("Network")) names.network.add(name);
        else names.office.add(name);
    }
    //console.log("Index after vacancies:",index)
    //console.log("After vac:",names);
  })
  .then ( (name) => {
    let optionObj = {}
    optionObj.network =  Array.from(names.network);
    optionObj.district = Array.from(names.district).sort() ;
    optionObj.charter = Array.from(names.charter).sort() ;
    optionObj.office = Array.from(names.office).sort() ;

    //console.log ("Option Object:",optionObj)
    let datalistOpts = "";
    datalistOpts += `<div>Network Office</div>`
    for (const net of optionObj.network) {
      datalistOpts += `<option value="${net}">${net}</option>`
    }
    for (const ofc of optionObj.office) {
      datalistOpts += `<option value="${ofc}">${ofc}</option>`
    }
    for (const dist of optionObj.district) {
      datalistOpts += `<option value="${dist}">${dist}</option>`
    }
    for (const chrt of optionObj.charter) {
      datalistOpts += `<option value="${chrt}">${chrt}</option>`
    }
    let dlist = document.querySelector("#departments")
    dlist.innerHTML = datalistOpts;

  })


function stringSort(items) {
  items.sort((a, b) => {
    const nameA = a.toUpperCase(); // ignore upper and lowercase
    const nameB = b.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    // names must be equal
    return 0;
  });
}
input.addEventListener("select",outputSchoolData);
input.addEventListener("selectionchange",outputSchoolData);

function outputSchoolData(e) {
  //console.log("outputSchoolData called. E:",e)
  //console.log("e.target",e.target)
  //console.log("e.currentTarget",e.currentTarget)
  let dept = {}
  let entry = "";
  if (e.target.value) {
    entry = e.target.value.trim().toUpperCase();
    if ( index.short_name.has(entry) ) { 
      //console.log("NameTarget:",entry,index.short_name.get(entry));
      dept = index.short_name.get(entry) 
    }
  } else {
    if (e.target.id) {
      entry = e.currentTarget.id;
      if ( index.dept_id.has(entry) ) {
        //console.log("CurrentTarget:",entry,index.dept_id.get(entry));
        dept = index.dept_id.get(entry);
      }
    }
  }
  //console.log("Chose:",entry, dept)
output.scrollIntoView({behavior: smooth});
output.innerHTML = data2Table (dept);
}

function data2Table (dept) {
  //console.log(dept)
  //console.log("JobsMap",jobsMap);
  let sum = 0;
  let outputString = "";
  let posVac = Object.entries(dept.positionsVacant);
  //console.log("Pos Vac:",posVac);
  if (posVac.length === 0) {
    outputString = `
<p>CPS says ${dept.short_name} has no vacant positions.</p>
`
  } else {
  outputString = `
<table><caption><div>${dept.short_name}</div></caption>
<thead class="thead">
<tr><td colspan="2" style="font-weight:bold">By Job Title</td></tr>
<tr><th scope="col">Job Title</th><th scope="col">Vacancies</th></tr>
</thead> <tbody>
`
    for (const v of posVac) {
      [jobCode,vacancyCount] = v;
      const jobTitle = jobsMap.get(parseInt( jobCode )).jobTitle
      outputString += `
<tr><th scope="row">${jobTitle}</th><td>${parseFloat( vacancyCount ).toFixed(1)}</td></tr>`
      sum += parseFloat(vacancyCount);
    }


  outputString += `
</tbody> <tfoot>
<tr><th scope="row">Total</th><td>${sum.toFixed(1)}</td></tr>
</tfoot> </table>
`
    let count = 0
    let categoriesString = `
<table> <thead class="thead">
<tr><td colspan="2" style="font-weight:bold">By Job Category*</td></tr>
<tr><th scope="col">Job Category</th><th scope="col">Vacancies</th></tr>
</thead> <tbody>
`;


    let catVac = Object.entries(dept.categoriesVacant);
    for (cat of catVac) {
      [category,vacancyCount] = cat;
      if (vacancyCount > 0) {
        count++;
        categoriesString += `
<tr><th scope="row">${category}</th><td>${parseFloat( vacancyCount ).toFixed(1)}</td></tr>`
        sum += parseFloat(vacancyCount);
      }
    }

  categoriesString += `</tbody></table>
<p class="asterisk">Not every job fits one of these categories and some fit multiple categories.`;
    if (count > 0) outputString += categoriesString;
}
  if (sum === 0) outputString = `
<p>CPS says ${dept.short_name} has no vacant positions.</p>
`
  //console.log(outputString);
  return outputString;
}

/*
let schoolGroups = document.querySelectorAll("#cpsmap #schools g");
schoolGroups.forEach((group) => {
  const schoolNumber = parseInt( group.id );
  const schoolMatch = schoolsData.filter((school) => school.school_id === group.id);
  if (schoolMatch.length < 1) {
    group.style.display = "none";
  } else {
    const schoolData = schoolMatch[0];
    const schoolVacancyData = vacanciesData.find(school => school.school_id === schoolData.school_id);
    if (!schoolVacancyData) {
      group.style.display = "none";
      //console.log("Vacancy Data Not Found for",schoolData.name_short)
    } else {
      const schoolMembers = parseInt( schoolVacancyData.ActiveMemb );
      const schoolVacancies = parseInt( schoolVacancyData.TotVacancy ); 
      const schoolVacancyPercent = Math.round(schoolVacancies*1000/schoolMembers) / 10.0;
      let dataTable = `
<table id="${schoolData.school_id}">
<thead>
<caption><div>${schoolData.name_short}</div></caption>
<tr>
<th></th>
<th scope="col" aria-label="Positions">Pos.</th>
<th scope="col" aria-label="Vacancies">Vac.</th>
<th scope="col" aria-label="Vacancy Rate">Rate</th></tr>
</thead>
<tbody>
<tr>
<th scope="row">All Positions:</th>
<td>${schoolMembers}</td>
<td>${schoolVacancies}</td>
<td>${schoolVacancyPercent}%</td>
</tr>
</tbody>
</table>
<form id="report" name="report">
<p>Is this your school? <button class="positive" type="button">&#9989;Yes!</button>
</p>
</form>
`;
      group.addEventListener("click", outputSchoolData, {capture: true});
      group.dataset.members = `${schoolMembers}`;
      group.dataset.vacancy = `${schoolVacancies}`;
      let circle = group.querySelector("circle");
      circle.setAttributeNS(null,"r",Math.sqrt(schoolMembers/5));
      if (schoolVacancies < 1) { 
        circle.style.fill = "#009966";
      } else if (schoolVacancyPercent < 5) {
        circle.style.fill="#99ccaa";
      } else if (schoolVacancyPercent < 10) {
        circle.style.fill="#ffffaa";
      } else if (schoolVacancyPercent < 20) {
        circle.style.fill="#ffaaaa";
      }
    }
  }
});
let nets = document.querySelectorAll("#cpsmap #networks path");
nets.forEach( (net) => {
  const intRegex = /[0-9]+/g;
  const netNumber = parseInt( net.id.match(intRegex) );
  const schoolMatches = schoolsData.filter((school) => parseInt( school.network_es ) === netNumber);
  //console.log("Network:",netNumber,"Schools:",schoolMatches);
  let netData = {members:0,vacancies:0};
  if (schoolMatches.length < 1) {
    net.style.fill="#bbaaff";
    //console.error("No schools found in Network",netNumber);
  } else {
    netData.members = schoolMatches.reduce( (members,schoolData) => {
      let schoolVacancyDatum = vacanciesData.find(school => {
        return parseInt( school.school_id ) === parseInt( schoolData.school_id ) });
      let activeMembers = 0;
      if (schoolVacancyDatum) {
        activeMembers = parseInt( schoolVacancyDatum.ActiveMemb);
      }
      return members + activeMembers;
    }, 0);
    //console.log("Network",netNumber,"Member Total:",netData.members);
    netData.vacancies = schoolMatches.reduce( (vacancies,schoolData) => {
      const schoolVacancyDatum = vacanciesData.find(school => parseInt( school.school_id ) === parseInt( schoolData.school_id ));
      let schoolVacancies = 0;
      if (schoolVacancyDatum) {
        schoolVacancies = parseInt( schoolVacancyDatum.TotVacancy);
      }
      return vacancies + schoolVacancies;
    }, 0);
    //console.log(netData);
    const netVacancyPercent = Math.round(netData.vacancies * 1000 / netData.members) / 10.0;
    let dataTable = `
<table id="network${netNumber}">
<thead>
<caption><div>Network ${netNumber}</div></caption>
<tr><th></th><th scope="col">Pos.</th><th scope="col">Vac.</th><th scope="col">Rate</th></tr>
</thead>
<tbody>
<tr>
<th scope="row">All Positions:</th>
<td>${netData.members.toLocaleString()}</td>
<td>${netData.vacancies.toLocaleString()}</td>
<td>${netVacancyPercent}%</td>
</tr>
</tbody>
</table>
`;
    net.addEventListener("click", (e) => {
      let dataOutput = document.querySelector("#dataOutput");
      dataOutput.innerHTML = dataTable;
    });
    //console.log(netVacancyPercent);
    if (netVacancyPercent === 0) { 
      net.style.fill = "#009966";
    } else if (netVacancyPercent < 5) {
      net.style.fill="#009966";
    } else if (netVacancyPercent < 10) {
      net.style.fill="#99ffaa";
    } else if (netVacancyPercent < 15) {
      net.style.fill="gold";
    } else if (netVacancyPercent < 20) {
      net.style.fill="#ffaaaa";
    } else net.style.fill = "dd6666";
  }
});
const data = new CustomEvent("data");
window.dispatchEvent(data);
return "Main finishes inside adding eventlisteners.";
)
    })
  })
}
function joinVacancies (schools,vacancies) {
 console.log("joinVacancies | vacancies:",vacancies,"schools:",schools);
  const vacancyJoin = vacancies.map(vacancy => {
    //console.log(vacancy);
    const vacant = vacancy;
    const school = schools.find(school => parseInt(school.school_id) === parseInt(vacant.school_id));
    return {...vacant,...school}
  })
  return vacancyJoin;
}

function outputSchoolData (event) {
  let target;
  if (event instanceof Event) {target = event.currentTarget} else {
    target = event.lastOption;
  }
  const school_id = target.id;
  console.log("Output School Data:",school_id,target.textContent);
  const schoolName = target.textContent;
  const schoolMembers = target.dataset.members;
  const schoolVacancies =  target.dataset.vacancy;
  const schoolVacancyPercent = Math.round(schoolVacancies*1000/schoolMembers) / 10.0;
  let combobox = document.getElementById("cb1-input");
  combobox.value = "";
  let dataTable = `
<table id="${school_id}">
<thead>
<caption><div>${schoolName}</div></caption>
<tr>
<th></th>
<th scope="col">Pos.</th>
<th scope="col">Vac.</th>
<th scope="col">Rate</th>
</tr>
</thead>
<tbody>
<tr>
<th scope="row">All Positions:</th>
<td>${schoolMembers}</td>
<td>${schoolVacancies}</td>
<td>${schoolVacancyPercent}%</td>
</tr>
</tbody>
</table>
<form id="report" name="report">
<p>Is this your school? <button class="positive" type="button" style="font-weight: bold;">&#9989; Yes!</button>
</p>
</form>
`;
  dataOutput.innerHTML = dataTable;
  let reportButtons = document.querySelectorAll("#report button" )
  reportButtons.forEach( (button) => {
    button.dataset.schoolName = schoolName;
    button.dataset.members = schoolMembers;
    button.dataset.vacancies = schoolVacancies;
    button.dataset.rate = schoolVacancyPercent;
    button.addEventListener ("click", reportMessage);
  })
}

function stringPropertySort(a,b,property) {
  // Use this function inside Array.sort() 
  const nameA = a[property].toUpperCase(); // ignore upper and lowercase
  const nameB = b[property].toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  // names must be equal
  return 0;
}

function initCombobox (schoolVacancies) {
  const datalist = document.querySelector("#choiceList");
  const vacancies = {};
  vacancies.schools = schoolVacancies;
  console.log("initCombobox schoolVacancies:",schoolVacancies);
  const nameSortedVacancies = vacancies.schools;
  console.log("nameSortedVacancies:",nameSortedVacancies);
  nameSortedVacancies.forEach(school => {
    const option = document.createElement("li");
    option.id = `${school.school_id}`;
    option.innerText = school.ctu_name;
    option.role = "option";
    option.dataset.members = `${school.ActiveMemb}`;
    option.dataset.vacancy = `${school.TotVacancy}`;
    datalist.appendChild(option);
    option.addEventListener("click", outputSchoolData);
  })
  console.log("First Kid:",datalist.children[0])



}

*/
