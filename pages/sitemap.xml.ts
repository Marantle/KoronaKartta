import { NextPageContext } from "next";

const modified = "2020-03-18";
const sitemapXml = () => {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://koronakartta.info/</loc>
      <lastmod>${modified}</lastmod>
      <priority>1.00</priority>
    </url>
    <url>
      <loc>https://koronakartta.info/about</loc>
      <lastmod>${modified}</lastmod>
      <priority>0.5</priority>
    </url>
  </urlset>`;
};
const Sitemap = () => {};
export default Sitemap;

Sitemap.getInitialProps = async ({ res }: NextPageContext) => {
  res.setHeader("Content-Type", "text/xml");
  res.write(sitemapXml());
  res.end();
};
