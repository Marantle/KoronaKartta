import * as React from "react";
import Layout from "../components/Layout";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import fetch from "isomorphic-unfetch";
import { GetStaticProps } from "next";
import {
  Corona
} from "../interfaces/corona";
import hcdGeoData from "../sairaus/sairaanhoitopiiritgeocentroid.json";
import hcdCentroiGeoData from "../sairaus/hcdcentroidgeo.json";
import { countAll, countCurrent, countRecovered } from "../utils/coronCounter";


if (typeof window !== 'undefined') {
  import('../utils/analytics');  
}

interface Props {
  data: Corona;
}

const IndexPage: NextPage<Props> = ({ data }) => {
  const all = countAll(data);
  const current = countCurrent(data);
  const recovered = countRecovered(data);

  const DynamicMap = dynamic(() => import("../components/map/Map"), {
    loading: () => <p>Loading...</p>,
    ssr: false
  });

  return (
    <Layout>
      <DynamicMap
        hcdGeoData={hcdGeoData}
        hcdCentroidGeoData={hcdCentroiGeoData}
        coronaData={{
          rawInfectionData: data,
          allInfections: all,
          currentInfections: current,
          curedInfections: recovered
        }}
      />
    </Layout>
  );
};

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries. See the "Technical details" section.
export const getStaticProps: GetStaticProps = async () => {
  // Call an external API endpoint to get posts.
  const coronaData = await fetch(
    "https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/finnishCoronaData"
  );

  const data: Corona = await coronaData.json();

  console.log(`Server fetched this many confirmed: ${data.confirmed.length}`);

  return {
    props: {
      data
    }
  };
};


export default IndexPage;
