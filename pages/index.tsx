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
  hsData: Corona;
  thlData: Corona;
}

const IndexPage: NextPage<Props> = ({ hsData, thlData }) => {
  const allInfections = countAll(hsData);
  const currentInfections = countCurrent(hsData, null, allInfections);
  const recovered = countRecovered(hsData);
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
  // const coronaData = await fetch(
  //   "https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/finnishCoronaData"
  // );

  // const data: Corona = await coronaData.json();
  const toolkit = require("jsonstat-toolkit");
  const _ = require("lodash");

  const hcdNameMap: any = {
    Ahvenanmaa: "Ahvenanmaa",
    "Varsinais-Suomen SHP": "Varsinais-Suomi",
    "Satakunnan SHP": "Satakunta",
    "Kanta-Hämeen SHP": "Kanta-Häme",
    "Pirkanmaan SHP": "Pirkanmaa",
    "Päijät-Hämeen SHP": "Päijät-Häme",
    "Kymenlaakson SHP": "Kymenlaakso",
    "Etelä-Karjalan SHP": "Etelä-Karjala",
    "Etelä-Savon SHP": "Etelä-Savo",
    "Itä-Savon SHP": "Itä-Savo",
    "Pohjois-Karjalan SHP": "Pohjois-Karjala",
    "Pohjois-Savon SHP": "Pohjois-Savo",
    "Keski-Suomen SHP": "Keski-Suomi",
    "Etelä-Pohjanmaan SHP": "Etelä-Pohjanmaa",
    "Vaasan SHP": "Vaasa",
    "Keski-Pohjanmaan SHP": "Keski-Pohjanmaa",
    "Pohjois-Pohjanmaan SHP": "Pohjois-Pohjanmaa",
    "Kainuun SHP": "Kainuu",
    "Länsi-Pohjan SHP": "Länsi-Pohja",
    "Lapin SHP": "Lappi",
    "Helsingin ja Uudenmaan SHP": "HUS"
    // "Kaikki sairaanhoitopiirit": "Kaikki sairaanhoitopiirit"
  };

  const thlBaseUrl =
    "https://sampo.thl.fi/pivot/prod/fi/epirapo/covid19case/fact_epirapo_covid19case.json";
  const dailyQueryParameters =
    "row=hcd-444832&column=dateweek2020010120201231-443702L";
  const result = await toolkit(thlBaseUrl + "?" + dailyQueryParameters);
  const objects = result.Dataset(0).toTable({ type: "arrobj" });
  const cleanedObjects = _.map(
    objects.filter((o: any) => o.value > 0 && hcdNameMap[o.hcd]),
    (o: any) => ({
      value: o.value === null ? 0 : parseInt(o.value, 10),
      healthCareDistrict: hcdNameMap[o.hcd],
      date: new Date(
        new Date(o.dateweek2020010120201231).setHours(15)
      ).toISOString()
    })
  );
  const grouped = _.groupBy(cleanedObjects, "healthCareDistrict");
  const today = new Date();
  today.setHours(20);
  const thlData = _.mapValues(grouped, (group: any) =>
    _.sortBy(
      _.filter(group, (item: any) => item.date < today.toISOString()),
      (item: any) => item.date
    )
  );

  const coronaData = await fetch(
    "https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/finnishCoronaData"
  );

  const hsData: Corona = await coronaData.json();
  const thlConfirm = (Object.values(thlData) as any).reduce(
    (a: any[], v: any[]) => a.concat(v),
    []
  );
  const props: Props = {
    thlData: {
      confirmed: thlConfirm,
      deaths: [],
      recovered: []
    },
    hsData
  };

  return {
    props
  };
};

export default IndexPage;
