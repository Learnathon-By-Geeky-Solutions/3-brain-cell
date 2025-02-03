import { useEffect, useState } from "react";

import { map } from "../../assets/Assests";
import { geographicalData } from "../data/Data";

const Mapdiv = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const active = geographicalData[currentIndex];

  // Change the highlighted area and details every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % geographicalData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="h-auto bg-gray-200 py-20 px-10 my-10">
        <p className="text-3xl text-center">Affected Area in Visualization</p>
      <div className="flex justify-center align-center max-md:flex-col h-auto">
        {/* Left Side: Map Image */}
        <div className="relative md:w-1/2 h-full max-md:h-auto">
          <img
            src={map}
            alt="Map"
            className="object-cover object-center w-full h-full"
          />
          {/* Highlighted Area */}
          <div
            className="absolute border-4 border-red-500 pointer-events-none rounded-full w-30 h-30"
            style={{
              top: active.areaCoordinates.top,
              left: active.areaCoordinates.left,
            }}
          />
        </div>

        {/* Right Side: Disaster Details */}
        <div className="md:w-1/2 max-md:text-center p-6 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-4">{active.location}</h2>
          <p className="text-gray-700">{active.details}</p>
        </div>
      </div>
    </section>
  );
};

export default Mapdiv;
