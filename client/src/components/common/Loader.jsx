import React from "react";
import { Hearts } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-950 via-gray-900 to-black grid place-items-center">
      <Hearts
        height="80"
        width="80"
        color="#DC143C"
        ariaLabel="hearts-loading"
        visible={true}
      />
    </div>
  );
};

export default Loader;
