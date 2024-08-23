import { Application, Router, Status } from 'https://deno.land/x/oak/mod.ts'
import { oakCors } from "https://deno.land/x/cors/mod.ts";

/* static_content.js */


const port = 8000

const app = new Application()
const router = new Router()

// error handler
app.use(async (context, next) => {
  try {
    await next()
  } catch (err) {
        console.log(err)
  }
})

// routes.set("/",{type:"html",file:"./public/index.html"})
// routes.set("/map",{type:"html",file:"./public/index.html"})
// routes.set("/schools.json",{type:"json",file:"./data.schools.json"});
// routes.set("/cps-map.svg",{type:"svg",file:"./maps/cps-map.svg"});
// routes.set("/schools-vacancies.json",{type:"json",file:"./data/schools-vacancies.json"});
// routes.set("/dialog.html",{type:"html",file:"./experiments/dialog.html"});
// routes.set("/vload.js",{type:"js",file:"./scripts/vload.js"})

app.use(
  oakCors({
    origin: /ctulocal1.org$/,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  }),
);

app.use(router.routes())
app.use(router.allowedMethods())

// static content
app.use(async (context, next) => {
    const root = `${Deno.cwd()}/public`
    try {
        await context.send({ 
      root ,
      index: "index.html"
    })
    } catch {
        next()
    }
})


// page not found
app.use( async context => {
    context.response.status = Status.NotFound
  context.response.body = `"${context.request.url}" not found`
})

app.addEventListener("listen", ({ port }) => console.log(`listening on port: ${port}`) )

await app.listen({ port })
