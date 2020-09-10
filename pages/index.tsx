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
import { countAll, countDeaths } from "../utils/coronaCounter";
import { Loading } from "../components/Loading";

if (typeof window !== "undefined") {
  import("../utils/analytics");
}

interface Props {
  hsData: Corona;
  thlData: Corona;
}

const IndexPage: NextPage<Props> = ({ hsData, thlData }) => {
  const allInfections = countAll(hsData);
  const deaths = countDeaths(hsData);
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
          rawInfectionData: hsData,
          rawAlternativeData: thlData,
          allInfections: allInfections,
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
  const today = new Date();
  today.setHours(20);
  const coronaData = await fetch(
    "https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/finnishCoronaData/v2"
  );

  const hsData: Corona = await coronaData.json();

  const props: Props = {
    thlData: {
      confirmed: [],
      deaths: []
    },
    hsData
  };

  return {
    props
  };
};

export default IndexPage;
