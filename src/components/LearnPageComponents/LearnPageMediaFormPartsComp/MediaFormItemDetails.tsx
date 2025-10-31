import React from "react";

interface MediaFormItemDetailsProps {
  formData: {
    title: string;
    abstract: string;
    author: string;
    fileUrl: string;
    tags: string;
    dateOfPublish: string;
    seo: {
      title: string;
      description: string;
      author: string;
      subject: string;
      creator: string;
      keywords: string[];
      lang: string;
      canonical_url: string;
      published_time: string;
    };
  };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const MediaFormItemDetails: React.FC<MediaFormItemDetailsProps> = ({
  formData,
  handleChange,
}) => {
  return (
    <div className="flex flex-col justify-center items-start gap-5">
      <h3 className="text-xl font-outfit text-black">Step 1</h3>
      <h1 className="text-5xl font-outfit text-black">Item Details</h1>

      <div className="flex flex-col gap-5 w-full">
        <div className="flex gap-x-5 w-full">
          {/* Title */}
          <div className="flex flex-col w-1/2">
            <label htmlFor="title" className="font-outfit text-black mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
              required
            />
          </div>

          {/* Author */}
          <div className="flex flex-col w-1/2">
            <label htmlFor="author" className="font-outfit text-black mb-2">
              Author
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
              required
            />
          </div>
        </div>

        <div className="flex gap-x-5 w-full">
          {/* Date */}
          <div className="flex flex-col w-1/2">
            <label
              htmlFor="dateOfPublish"
              className="font-outfit text-black mb-2"
            >
              Date of Publishing
            </label>
            <input
              type="date"
              id="dateOfPublish"
              name="dateOfPublish"
              value={
                formData.dateOfPublish
                  ? new Date(formData.dateOfPublish).toISOString().split("T")[0] // show in YYYY-MM-DD
                  : ""
              }
              onChange={(e) => {
                const selectedDate = e.target.value; // "YYYY-MM-DD"
                const isoString = new Date(selectedDate).toISOString(); // strict ISO 8601
                handleChange({
                  target: {
                    name: "dateOfPublish",
                    value: isoString,
                  },
                } as React.ChangeEvent<HTMLInputElement>);
              }}
              className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
              required
            />
            <p className="text-xs font-thin m-2">
              Note: The website will display this date, regardless of upload
              time.
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-col w-1/2">
            <label htmlFor="tags" className="font-outfit text-black mb-2">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
              required
            />
            <p className="text-xs font-thin m-2">
              Note: This will appear below the document to indicate the topic
              and help sort the data.
            </p>
          </div>
        </div>

        {/* Abstract */}
        <div className="flex flex-col w-full">
          <label htmlFor="abstract" className="font-outfit text-black mb-2">
            Abstract
          </label>
          <textarea
            id="abstract"
            name="abstract"
            value={formData.abstract}
            onChange={handleChange}
            rows={3}
            className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658] focus:outline-none"
            required
          />
          <p className="text-xs font-thin m-2">
            Note: Character limits should be between 300–500.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MediaFormItemDetails;
