function joinVacancies (schools,vacancies) {
    const vacancyJoin = vacancies.map(vacancy => {
        schools.find(school => parseInt(school.school_id) === parseInt(vacancy.school_id));
    })
}

function initCombobox (schoolVacancies) {
    const datalist = document.querySelector("searchList");
    const vacancies = {};
    vacancies.schools = schoolVacancies;
    const nameSortedVacancies = vacancies.schools.sort ( (a, b) => stringPropertySort(a,b,"name_short"))
    console.log(nameSortedVacancies)
    nameSortedVacancies.forEach(school => {
        const option = document.createElement("option");
        option.value = school.name_short;
        option.innerText = school.name_short;
        option.addEvent("click", () => outputSchoolData(`${school.school_id}`));
        datalist.appendChild(option);
    })
}

function outputSchoolData (school_id) {
    const schoolVacancyData = joinVacancies(school_id);
    const schoolMembers = parseInt( schoolVacancyData.ActiveMemb );
    const schoolVacancies = parseInt( schoolVacancyData.TotVacancy ); 
    const schoolVacancyPercent = Math.round(schoolVacancies*1000/schoolMembers) / 10.0;
    let dataTable = `
<table id="${schoolData.school_id}">
<thead>
    <caption><span>${schoolData.name_short}</span></caption>
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
`;
}

function stringPropertySort(a,b,property) {
    // Use this function inside Array.sort() 
    const nameA = a[property]toUpperCase(); // ignore upper and lowercase
    const nameB = b[property]toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }

    // names must be equal
    return 0;
}

