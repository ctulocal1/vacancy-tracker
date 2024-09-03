let quoteBox = document.querySelector(".quotebox");
let i = 0;

let quotes = initQuotes () // Initializes quoteString
let slideInterval = setInterval (slideQuotes,12000);


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
  outgoing.className = "offLeft";
  incoming.className = "centered";
  ondeck.className = "offRight";
  ondeck.innerHTML = "";
  incoming.innerHTML = `<p>${newQuote.quote}</p>${citation}`
}

function nextQuote () {
  if (i < (quotes.length - 1)) {
    i++;
    return quotes[i];
  } else {
    i = 0;
    return quotes[i];
  }
}

function initQuotes () {
  let quotes = [];
quotes.push({
  quote: "Class sizes are too big. My largest class has 36 students. Students who legally require a one-on-one [aide] are not receiving support. Newcomers are not getting adequate language support and become easily frustrated or disengaged.",
  name: "Teacher",
  schools: "Daley Elementary"
})

quotes.push({
quote: "Huge classes, my school’s largest class has 39 students. We have no arts, no library, all after school programming was cut so we have nothing for the kids now.",
name: "Teacher",
school: "elementary school"
})

quotes.push({
  quote: "Our Youth Intervention Specialist position was cut. This position is vital to our school because of daily behavior issues. The English Language Program Teacher is still listed as a half position when we have 81 EL students as of today. She’s also working in a half position as the case manager. Something our students need is not going to get done.",
  name: "Teacher",
  school: "Nash Elementary"
  })

quotes.push({
quote:"We are busting at the seams right now. Both 5th grade classes are at 34 students with no money to hire a TA. Admin has requested for more and they keep getting denied. We keep getting told they won’t do anything until the 20th day. I have 7 tables in my room with 5 students at every table.",
name: "Teacher",
school:"Belding Elementary",
})

quotes.push({
quote:"Missing resources: our Student Voice Committee has been cut, a librarian, a full time nurse, sports coaches, dance or drama teacher. Students would love healthy choices like sports or dance for their time. Many students have medical conditions that deserve a nurse full time.",
name: "Teacher",
school:"elementary school",
})

quotes.push({
quote:"Largest class is 37 students. Our middle school classrooms are transformed. They are so full of desks there’s little space for anything else. We need Teacher Assistants, Bilingual supports, Special Education services, and a Librarian.",
name: "Teacher",
school:"Mitchell Elementary",
})


quotes.push({
quote:"We have 15 languages spoken at our school, including many refugees from the Middle East, Africa and Asia. We need ESL support for pull-out services to teach students basic and functional English.",
name: "Teacher",
school:"elementary school",
})

quotes.push({
quote:"We have 31 students in our kindergarten classes and 32-33 students in middle school classes. We are lacking Special Ed Services and Teachers Assistants.",
name: "Special Education Teacher",
school:"elementary school",
})

quotes.push({
quote:"We do not have enough TAs for our special education students who need dedicated assistants. There are special education students who should have a TA in Spanish classes according to their Individualized Education Plans and are not receiving their services.",
name: "Special Education Teacher",
school:"Phillips HS",
})

quotes.push({
quote:"I have 31 desks and 33 children. My room is a safety hazard. Neither students nor teacher can safely navigate the room due to congestion. The first grade room has 35 students. The teacher has to utilize another room in order to provide instructions that require use of the rug.",
name: "Teacher",
school:"elementary school",
})

quotes.push({
quote: "Our students now have to learn Spanish virtually and we are outsourcing that to a third party. Our resources are scarce. Each department gets three cases of paper for the year. We haven’t had department funds since before the pandemic. Our chemistry teacher is buying her supplies out of pocket.",
name: "Teacher",
school: "high school"
})

quotes.push({
quote: "Having 32 seven-year-olds in a class is really tough! It means way more time is spent on behavior management and classroom management and way less time on teaching. It is nearly impossible to meet the needs of our students, especially the newcomers.",
name: "Bilingual Teacher",
school: "Clinton Elementary"
})

quotes.push({
quote: "We have unfilled 5th grade and Special Ed positions, and 4 primary classes at or above 32 students without classroom aides.  The social worker is using a nook in the hallway without AC or a door for privacy and there are no rooms for our sped students so we are working in one large room in the basement.",
name: "Special Education Teacher",
school: "elementary school"
})

quotes.push({
quote: "Our largest class has 30 students. I have to diaper change in my blended classroom. Our bilingual kindergarten classroom has 28 students, teachers are being moved around, and students are not getting services.",
name: "Bilingual Teacher",
school: "Orozco Elementary"
})

quotes.push({
    quote: "Largest class size is 36. Large class sizes and not enough student support makes everything harder. We have students being unsupervised because we don’t have the support or we have students not receiving services because of staffing changes and budgets. ",
name: "Literacy Intervention Teacher",
school: "elementary school"
})

quotes.push({
    quote: "Our largest class has 31 students.  We have 4 vacancies. Our gym teacher has to teach the entire school alone, the workload is too much for him. Kids are no longer receiving library class or financial literacy. We are missing the TA who would help our elementary students.",
name: "Teacher",
school: "LaSalle Elementary"
})

quotes.push({
    quote: "Our school is 60% English Language Learners with over 40 languages represented. Our class sizes are far too big to reach these students with small group instructional time at their working levels.",
name: "Teacher",
school: "West Ridge Elementary"
  })



  return quotes;
}
