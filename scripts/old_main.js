import {router} from "./scripts/router.mjs"

Deno.serve(async (req) => {
  console.log("Method:", req.method);

  const url = new URL(req.url);
  console.log("Path:", url.pathname);
  console.log("Query parameters:", url.searchParams);
  console.log("Headers:", req.headers);

  if (req.body) {
    const body = await req.text();
  }
  let resp = router(url.pathname);
  console.log("Response Headers:",resp.headers)
  return resp;

});
