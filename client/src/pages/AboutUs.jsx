import React, { Suspense } from "react";
import Loader from "../components/common/Loader";
import AboutHero from "../components/core/AboutUs/AboutHero";
import AboutMission from "../components/core/AboutUs/AboutMission";
import AboutStats from "../components/core/AboutUs/AboutStats";
import AboutTeam from "../components/core/AboutUs/AboutTeam";
import FeedbackForm from "../components/core/AboutUs/FeedbackForm";
import AboutCTA from "../components/core/AboutUs/AboutCTA";
import { developerData } from "../components/core/AboutUs/developerData";
import "../pages/aboutUs.css";

const AboutUs = () => {
  return (
    <Suspense fallback={<Loader />}>
      <main className="aboutus-page min-h-screen w-full relative flex flex-col justify-between overflow-x-hidden">
        <div className="aboutus-bg" />
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-16 relative z-10">
          <AboutHero />
          <AboutMission />
          <AboutStats />
          <AboutTeam developers={developerData} />
          <section className="aboutus-feedback my-12">
            <FeedbackForm />
          </section>
          <AboutCTA />
        </div>
      </main>
    </Suspense>
  );
};

export default AboutUs;