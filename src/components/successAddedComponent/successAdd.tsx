import React from "react";
import { Check } from "lucide-react";

const SuccessAdd = () => {
  return (
    <>
      <div className="bg-green-200 h-32 flex justify-center items-center">
        <h1 className="text-xl text-green-600 font-bold flex justify-center items-center">
          <Check className="w-8 h-8 me-2" />
          Added Sucessfully
        </h1>
      </div>
    </>
  );
};

export default SuccessAdd;
