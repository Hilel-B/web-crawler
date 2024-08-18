import { JSDOM } from "jsdom";

async function crawlPage(base, current = base, pages = {}) {
  try {
    const urlBase = new URL(base);
    let relLink = current;
    if (relLink[0] == "/") {
      relLink = base + current;
    }
    // console.log("TEST ", base, current, relLink);
    const urlCurr = new URL(relLink);
    // console.log("HERE", urlBase.hostname, urlCurr.hostname);
    if (urlBase.hostname != urlCurr.hostname) {
      return pages;
    }
    const normCurr = normalizeURL(current);
    if (pages[normCurr]) {
      pages[normCurr] += 1;
      return pages;
    }
    pages[normCurr] = 1;
    // console.log("normCurr", pages, normCurr);

    const html = await extractHtml(current);
    const links = getURLsFromHTML(html, base);
    for (let i = 0; i < links.length; i++) {
      pages = await crawlPage(base, links[i], pages);
    }
    return pages;
  } catch (err) {
    console.log(err);
  }
}

async function extractHtml(currentURL) {
  // fetch and parse the html of the currentURL
  console.log(`crawling ${currentURL}`);

  let res;
  try {
    res = await fetch(currentURL);
  } catch (err) {
    throw new Error(`Got Network error: ${err.message}`);
  }

  if (res.status > 399) {
    console.log(`Got HTTP error: ${res.status} ${res.statusText}`);
    return;
  }

  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("text/html")) {
    console.log(`Got non-HTML response: ${contentType}`);
    return;
  }

  return await res.text();
}

function getURLsFromHTML(html, baseURL) {
  const urls = [];
  const dom = new JSDOM(html);
  const anchors = dom.window.document.querySelectorAll("a");

  for (const anchor of anchors) {
    if (anchor.hasAttribute("href")) {
      let href = anchor.getAttribute("href");

      try {
        // convert any relative URLs to absolute URLs
        href = new URL(href, baseURL).href;
        // console.log(href)
        urls.push(href);
      } catch (err) {
        console.log(`${err.message}: ${href}`);
      }
    }
  }

  return urls;
}

function normalizeURL(url) {
  //   console.log("normalize url input", url);
  const urlObj = new URL(url);
  let fullPath = `${urlObj.host}${urlObj.pathname}`;
  if (fullPath.slice(-1) === "/") {
    fullPath = fullPath.slice(0, -1);
  }
  return fullPath;
}

export { normalizeURL, getURLsFromHTML, crawlPage };
