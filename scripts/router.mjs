let routes = new Map();
routes.set("/",{type:"html",file:"./public/index.html"})
routes.set("/map",{type:"html",file:"./public/index.html"})
routes.set("/schools.json",{type:"json",file:"./data/schools.json"});
routes.set("/cps-map.svg",{type:"svg",file:"./maps/cps-map.svg"});
routes.set("/schools-vacancies.json",{type:"json",file:"./data/schools-vacancies.json"});
routes.set("/schools-vacancies.html",{type:"html",file:"./public/school-vacancies.html"});
routes.set("/dialog.html",{type:"html",file:"./experiments/dialog.html"});
routes.set("/vload.js",{type:"js",file:"./scripts/vload.js"})
routes.set("/images/ctu-seal.png",{type:"png",file:"./images/ctu-seal.png"})
routes.set("/images/ctu-logo.png",{type:"png",file:"./images/ctu-logo.png"})
routes.set("/images/ctu-seal.svg",{type:"svg",file:"./images/ctu-seal.svg"})
routes.set("/images/ctu-logo.svg",{type:"svg",file:"./images/ctu-logo.svg"})

export function router(path) {
  console.log("Router called on:",path)
  const route = routes.get(path);
  console.log("Router:",route)
  if (route) {
    console.log("route:",route)
    if (route.type === "html") return htmlRoute(route.file);
    if (route.type === "svg")  return svgRoute(route.file);
    if (route.type === "png")  return pngRoute(route.file);
    if (route.type === "json") return jsonRoute(route.file);
    if (route.type === "js") return jsRoute(route.file)
  }
  else return route404();
}

function pngRoute (pathname) {
  let file = Deno.readTextFileSync (`./${pathname}`);
  let resp = new Response (file, {
    status: 200,
    headers: {
      "content-type": "image/png",
      "vary": "Accept-Encoding"
  }
  })
  return resp;
}

function svgRoute (pathname) {
  let file = Deno.readTextFileSync (`./${pathname}`);
  let resp = new Response (file, {
    status: 200,
    headers: {
      "content-type": "image/svg+xml",
      "vary": "Accept-Encoding"
  }
  })
  return resp;
}

function htmlRoute (pathname) {
  console.log("searching for:",pathname)
  let file = Deno.readTextFileSync (`./${pathname}`);
  let resp = new Response (file, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
  }
  })
  return resp;
}


function jsonRoute (pathname) {
  let file = Deno.readTextFileSync (`./${pathname}`);
  let resp = new Response (file, {
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
