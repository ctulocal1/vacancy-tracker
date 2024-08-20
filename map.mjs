export function map () {
  let mapPage = Deno.readTextFileSync ("./cps-map.svg");
  let resp = new Response (mapPage, {
    status: 200,
    headers: {
      "content-type": "text/svg; charset=utf-8",
  }
  })
  return resp;
}

export function dialog () {
  let page = Deno.readTextFileSync ("./dialog.html");
  let resp = new Response (page, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
  }
  })
  return resp;
}

export function page () {
  let mapPage = Deno.readTextFileSync ("./map.html");
  let resp = new Response (mapPage, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
  }
  })
  return resp;
}

export function schools () {
  let mapPage = Deno.readTextFileSync ("./schools.json");
  let resp = new Response (mapPage, {
    status: 200,
    headers: {
      "content-type": "text/json; charset=utf-8",
  }
  })
  return resp;
}

export function vacancies () {
  let mapPage = Deno.readTextFileSync ("./schools-vacancies.json");
  let resp = new Response (mapPage, {
    status: 200,
    headers: {
      "content-type": "text/json; charset=utf-8",
  }
  })
  return resp;
}

