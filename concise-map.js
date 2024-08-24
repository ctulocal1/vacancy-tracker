import { DOMParser } from "npm:linkedom";

const mapString = Deno.readTextFileSync("./public/images/dept-map.svg");
const map = new DOMParser().parseFromString(mapString, "image/svg+xml" );

let mapOut = map.toString();

Deno.writeTextFileSync("./public/images/dept-map.svg",mapOut);
