import * as React from "react";
// import Link from 'next/link'
import Head from "next/head";

type Props = {
  title?: string;
  description?: string;
  url? : string;
  imageUrl?: string;
};

const Layout: React.FunctionComponent<Props> = ({
  children,
  title = "Covid-19 eli Koronaviruksen leviäminen suomessa",
  description = "Koronakartalla voit selata historiallista koronan leviämistä suomessa ja katsoa sairaanhoitopiirikohtaisesti kokonaistartuntojen, kipeiden sekä parantuneiden määriä.",
  imageUrl = "/banner.png",
  url = "//koronakartta.info/"
}) => (
  <div id="buut">
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      {/* <!-- Primary Meta Tags --> */}
      <meta name="title" content={title}/>
      <meta name="description" content={description}/>

      {/* <!-- Open Graph / Facebook --> */}
      <meta property="og:type" content="website"/>
      <meta property="og:url" content={url}/>
      <meta property="og:title" content={title}/>
      <meta property="og:description" content={description}/>
      <meta property="og:image" content={imageUrl}/>

      {/* <!-- Twitter --> */}
      <meta property="twitter:card" content="summary_large_image"/>
      <meta property="twitter:url" content={url}/>
      <meta property="twitter:title" content={title}/>
      <meta property="twitter:description" content={description}/>
      <meta property="twitter:image" content={imageUrl}/>

    </Head>
    {children}
  </div>
);

export default Layout;
