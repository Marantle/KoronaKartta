// import { AppProps } from 'next/app'

import "mapbox-gl/dist/mapbox-gl.css";
import "./global.css";

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
