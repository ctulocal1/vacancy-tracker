import {page,map,schools,vacancies,dialog} from "./map.mjs"

Deno.serve(async (req) => {
  console.log("Method:", req.method);

  const url = new URL(req.url);
  console.log("Path:", url.pathname);
  console.log("Query parameters:", url.searchParams);
  console.log("Headers:", req.headers);

  if (req.body) {
    const body = await req.text();
    console.log("Body:", body);
  }

  if (url.pathname === "/map") {
    let resp = page();
    return resp;
  } else if (url.pathname === "/schools.json") {
    let resp = schools();
    return resp;
  } else if (url.pathname === "/cps-map.svg") {
    let resp = map();
    return resp;
  } else if (url.pathname === "/schools-vacancies.json") {
    let resp = vacancies();
    return resp;
  } else if (url.pathname === "/dialog.html") {
    let resp = dialog();
    return resp;
  }
  return new Response("Route not found", {
    status: 404,
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
  */
});
