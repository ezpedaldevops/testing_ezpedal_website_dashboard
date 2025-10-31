import React from "react";
import ShowPdfsDataLearnPage from "../ShowPdfsDataLearnPage";

// Define prop types explicitly
interface LearnPageSectionNewItemShowDataProps {
  toTitleCase: (str: string) => string;
  slugTitle: string;
  categoryId: string
}

const LearnPageSectionNewItemShowData: React.FC<LearnPageSectionNewItemShowDataProps> = ({
  toTitleCase,
  slugTitle,
  categoryId
}) => {
  return (
    <>
    <div className="flex flex-col justify-center items-center mb-8 h-[200px] my-10 xl:px-32 md:px-16 px-4">
      <h3 className="text-xl py-2 font-outfit font-bold text-black">Preview</h3>
      <h1 className="text-6xl font-outfit text-black">
        {toTitleCase(slugTitle.replace(/-/g, " "))}
      </h1>
      <h3 className="font-Poppins my-2 text-lg">
        A place to explore the rideshare industry, its challenges and
        limitations.
      </h3>
    </div>
    <ShowPdfsDataLearnPage slugTitle={slugTitle} categoryId={categoryId} />
    </>
  );
};

export default LearnPageSectionNewItemShowData;
