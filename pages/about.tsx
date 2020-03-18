import React from "react";
import Layout from "../components/Layout";

const AboutPage: React.FunctionComponent = () => (
  <Layout title="About | Koronakartta">
    <div>
      <a href="https://github.com/Marantle/KoronaKartta">
        <img
          alt="https://github.com/Marantle/KoronaKartta"
          src="/githubmark.png"
        />
      </a>

      <style jsx>{`
        img {
          background-color: black;
          border-radius: 25px;
        }
      `}</style>
    </div>
  </Layout>
);

export default AboutPage;
