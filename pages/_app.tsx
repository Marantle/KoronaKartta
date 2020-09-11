import "mapbox-gl/dist/mapbox-gl.css";
import { AppProps } from "next/app";
import "./global.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
