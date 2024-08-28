// dept = object with all info including .vacant
  let outputString = `
<table><caption><div>${dept.short_name}</div></caption>
<thead class="thead">
<tr><td colspan="2" style="font-weight:bold">By Job Title</td></tr>
<tr><th scope="col">Job Title</th><th scope="col">Vacancies</th></tr>
</thead> <tbody>
`
let sum = 0;
dept.positionsVacant.forEach( ([jobCode,vacancyCount]) => {
      outputString += `
<tr><th scope="row">${jobsMap.get(jobCode)}</th><td>${parseFloat( vacancyCount ).toFixed(1)}</td></tr>`
sum += parseFloat(vacancyCount);
})


  outputString += `
</tbody> <tfoot>
<tr><th scope="row">Total</th><td>${sum.toFixed(1)}</td></tr>
</tfoot> </table>
<table> <thead class="thead">
<tr><td colspan="2" style="font-weight:bold">By Job Category*</td></tr>
<tr><th scope="col">Job Category</th><th scope="col">Vacancies</th></tr>
</thead> <tbody>
`;

dept.categoriesVacant.forEach( ([category,vacancyCount]) => {
      outputString += `
<tr><th scope="row">${category}</th><td>${parseFloat( vacancyCount ).toFixed(1)}</td></tr>`
sum += parseFloat(vacancyCount);
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
