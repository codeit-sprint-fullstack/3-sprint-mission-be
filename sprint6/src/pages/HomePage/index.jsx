import React from "react";
import "./index.css";
import Header from "./component/Header/index.jsx";
import Hero from "./component/Hero/index.jsx";
import Section1 from "./component/Section1/index.jsx";

function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Section1 />
        {/*<Section2 />
      <Section3 />
      <UnderBanner /> */}
      </main>
      {/*<Footer /> */}
    </>
  );
}

export default HomePage;
