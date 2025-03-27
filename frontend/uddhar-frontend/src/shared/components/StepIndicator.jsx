import { CheckCircle, Circle } from "lucide-react";
import React from "react";

const steps = ["Account Info", "Verify Email", "Details", "Completion"];

const VerticalStepper = ({ currentStep }) => {
  return (
    <div className="flex flex-col items-start max-md:hidden">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center space-x-4">
          <div className="flex flex-col items-center">
            {/* Verticle line */}
            {index > 0 && <div className="w-1 h-20 bg-gray-300"></div>}
            {/* Circle */}
            {index < currentStep ? (
              <CheckCircle className="text-green-500 w-[35px] h-[35px]" />
            ) : (
              <Circle
                className={`w-[35px] h-[35px] ${
                  index === currentStep ? "text-blue-500" : "text-gray-400"
                }`}
              />
            )}
          </div>
          
          {index === 0 ? (
            <span
              className={`text-sm font-medium ${
                index < currentStep ? "text-green-500" : "text-gray-600"
              }`}
            >
              {step}
            </span>
          ) : (
            <span
              className={`text-sm font-medium mt-[70px] ${
                index < currentStep ? "text-green-500" : "text-gray-600"
              }`}
            >
              {step}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default VerticalStepper;
