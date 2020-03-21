import * as React from "react";
import Layout from "../components/Layout";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import fetch from "isomorphic-unfetch";
import { GetStaticProps } from "next";
import { Corona } from "../interfaces/corona";
import hcdGeoData from "../sairaus/simplehcdgeo.json";
import hcdCentroiGeoData from "../sairaus/hcdcentroidgeo.json";
import countPositionsGeo from "../sairaus/totalPositions.json";
import {
  countAll,
  countCurrent,
  countRecovered,
  countDeaths
} from "../utils/coronCounter";
import { Loading } from "../components/Loading";

if (typeof window !== "undefined") {
  import("../utils/analytics");
}

interface Props {
  data: Corona;
}

const IndexPage: NextPage<Props> = ({ data }) => {
  const allInfections = countAll(data);
  const currentInfections = countCurrent(data, null, allInfections);
  const recovered = countRecovered(data);
  const deaths = countDeaths(data);

  const DynamicMap = dynamic(() => import("../components/map/Map"), {
    loading: () => <Loading />,
    ssr: false
  });

  return (
    <Layout>
      <DynamicMap
        hcdGeoData={hcdGeoData}
        hcdCentroidGeoData={hcdCentroiGeoData}
        coronaData={{
          rawInfectionData: data,
          allInfections: allInfections,
          currentInfections: currentInfections,
          recovered,
          deaths
        }}
        countPositionsGeo={countPositionsGeo}
      />
      <div>
        <a href="https://github.com/Marantle/KoronaKartta">
          <img
            alt="https://github.com/Marantle/KoronaKartta"
            src="/githubmark.png"
          />
        </a>

        <style jsx>{`
          position: absolute;
          top: 0;
          right: 0;
          img {
            width: 2em;
          }
        `}</style>
      </div>
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
