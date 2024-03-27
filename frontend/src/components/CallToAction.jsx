import { Button } from "flowbite-react";
import React from "react";

const CallToAction = () => {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-200 justify-center items-center shadow-md text-center dark:border-teal-700">
      {/* we want both sides to be the same the size */}
      <div className="flex-1 justify-center flex flex-col">
        <h2 className="text-2xl">Want to learn more about JavaScript?</h2>
        <p className="text-gray-500 my-2">Check out these resources!</p>
        <Button gradientMonochrome="teal">Learn more</Button>
      </div>
      <div className="p-7 flex-1">
        <img src="https://miro.medium.com/v2/resize:fit:668/1*hcws3Wa6u9IqaEZ_4X04uw.jpeg" />
      </div>
    </div>
  );
};

export default CallToAction;
