let quoteBox = document.querySelector(".quotebox");
let i = 0;

let quotes = initQuotes () // Initializes quoteString
let slideInterval = setInterval (slideQuotes,9000);


function slideQuotes () {
  // Slides quotes to the left
  const outgoing = document.querySelector(".centered");
  const incoming = document.querySelector(".offRight");
  const ondeck = document.querySelector(".offLeft");
  let newQuote = nextQuote();
  let citation = "";
  if (newQuote.name || newQuote.school) citation = "<cite>"
  if (newQuote.name) {
    citation += newQuote.name
    if (newQuote.school) citation += `, `
  }
  if (newQuote.school) citation += `<span class="nobreak">${newQuote.school}`
  if (newQuote.name) citation += "</cite>"
  incoming.innerHTML = `<p>${newQuote.quote}</p>${citation}`
  outgoing.className = "offLeft";
  incoming.className = "centered";
  ondeck.className = "offRight";
}

function nextQuote () {
  if (i < (quotes.length - 1)) {
    i++;
    return quotes[i];
  } else {
    const random = Math.floor(quotes.length * Math.random());
    return quotes[random];
  }
}

function initQuotes () {
  let quotes = [];
  quotes.push ({
    name: "Caitlin Sheehan",
    school: "Clinton Elementary",
    quote: "Having 32 seven-year-olds in a class is really tough! It means way more time is spent on behavior management and classroom management and way less time on teaching. It is nearly impossible to meet the needs of our students, especially the newcomers."
  })
  quotes.push ({
    quote: "Our students now have to learn Spanish virtually, and we are outsourcing that to a third party. Our Sped/ELL instructor is stretched thin, and our school should be TBE. But we don’t have the funding for it. Our resources are scarce - each department gets 3 cases of paper for the year. We haven’t had department funds since before the pandemic - our chemistry teacher is buying her supplies out of pocket. We are the only school offering Aviation classes, but the district is dragging its feet in fixing our simulators."
  })
  quotes.push ({
    name: "Anita Guaman",
    school: "Orozco Elementary",
    quote: "I have to diaper change my blended classes room, our bilingual kinder classroom has 28 students, teachers are being moved around, students not getting service."
  })
  quotes.push ({
    quote: "I have 31 desks. 33 children. My room is a safety hazard. Students nor teacher can safely navigate the room due to congestion. 1st grade room 35 Students. Teacher has to utilize another room in order to provide instructions that require use of the rug."
  })
  quotes.push ({
    name: "Amaziah Burton",
    school: "Phillips HS",
    quote: "We do not have enough TAs for our sped students who need dedicated assistants. There are sped students who should have a TA in Spanish classes according to their IEPs and are not receiving their services. There are SPED students in resource classes who don’t have their TA as mandated in their IEP. Bottom line: more TAs are needed to give our students the education they deserve!"
  })
  quotes.push ({
    name: "Sarah Tschaen",
    school: "West Ridge Elementary",
    quote: "Our school is 60% English Language Learners with over 40 languages represented. Our class sizes are far too big to reach these students with small group instructional time at their working levels."
  })
  return quotes;
}
