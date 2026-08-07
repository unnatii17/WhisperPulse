import React from "react";
import OurInfo from "./OurInfo";

const AboutTeam = ({ developers }) => {
  return (
    <section className="aboutus-team">
      {developers?.map((dev, i) => (
        <OurInfo key={i} {...dev} />
      ))}
    </section>
  );
};

export default AboutTeam;