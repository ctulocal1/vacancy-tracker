let routes = new Map();
routes.set("/",{type:"html",file:"./public/index.html"})
routes.set("/map",{type:"html",file:"./public/index.html"})
routes.set("/schools.json",{type:"json",file:"./data/schools.json"});
routes.set("/cps-map.svg",{type:"svg",file:"./maps/cps-map.svg"});
routes.set("/schools-vacancies.json",{type:"json",file:"./data/schools-vacancies.json"});
routes.set("/dialog.html",{type:"html",file:"./experiments/dialog.html"});
routes.set("/vload.js",{type:"js",file:"./scripts/vload.js"})

export function router(path) {
  const route = routes.get(path);
  if (route) {
    if (route.type === "html") return htmlRoute(route.file);
    if (route.type === "svg")  return svgRoute(route.file);
    if (route.type === "json") return jsonRoute(route.file);
    if (route.type === "js") return jsRoute(route.file)
  }
  else return route404();
}

function svgRoute (pathname) {
  let mapPage = Deno.readTextFileSync (`./${pathname}`);
  let resp = new Response (mapPage, {
    status: 200,
    headers: {
      "content-type": "text/svg; charset=utf-8",
  }
  })
  return resp;
}

function htmlRoute (pathname) {
  let mapPage = Deno.readTextFileSync (`./${pathname}`);
  let resp = new Response (mapPage, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
  }
  })
  return resp;
}


function jsonRoute (pathname) {
  let mapPage = Deno.readTextFileSync (`./${pathname}`);
  let resp = new Response (mapPage, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
  }
  })
  return resp;
}

function route404 () {
  return new Response("Route not found", {
    status: 404,
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
