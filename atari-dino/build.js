import { runDasm } from "/usr/local/lib/node_modules/romdevtools/src/toolchains/dasm/dasm.js";
import { readFileSync, writeFileSync } from "node:fs";

const source = readFileSync("main.asm", "utf8");
const r = await runDasm({ source, outputFormat: "raw", options: ["-f3"] });
console.log(r.log);
if (r.exitCode !== 0) process.exit(r.exitCode);
writeFileSync("dino.a26", Buffer.from(r.binary));
console.log("wrote dino.a26", r.binary.length);
