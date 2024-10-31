import React from "react";
import "./index.css";
import Header from "./component/Header/index.jsx";
import Hero from "./component/Hero/index.jsx";
import Section1 from "./component/Section1/index.jsx";
import Section2 from "./component/Section2/index.jsx";
import Section3 from "./component/Section3/index.jsx";
import BottomBanner from "./component/UnderBanner/index.jsx";
import Footer from "../../components/Footer/index.jsx";


function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Section1 />
        <Section2 />
        <Section3 />
        <BottomBanner />
      </main>
      <Footer />
    </>
  );
}

export default HomePage;
