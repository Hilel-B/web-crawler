function printReport(pages) {
  console.log("generation of report...");
  const entries = Object.entries(pages);
  console.log("entries", entries);
  entries.sort((a, b) => b[1] - a[1]);
  entries.map((entry) => {
    console.log(`Found ${entry[1]} internal links to ${entry[0]}`);
  });
}

export { printReport };
