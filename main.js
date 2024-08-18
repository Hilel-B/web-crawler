import { argv } from "node:process";
import { crawlPage } from "./crawl.js";
import { printReport } from "./report.js";

async function main() {
  if (argv.length < 3) {
    throw new Error("please give a path or link to an html");
  }
  if (argv.length > 3) {
    throw new Error("too many arguments");
  }
  //   console.log(argv);
  const url = argv[2];
  console.log("starting to crawl " + url);
  const ans = await crawlPage(url);
  //   console.log(ans);
  printReport(ans);
}

main();
