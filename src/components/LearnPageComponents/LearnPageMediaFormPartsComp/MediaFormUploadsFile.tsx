import Image from "next/image";
import React from "react";

interface MediaFormUploadsFileProps {
  formData: {
    file: File | null;
    coverImage: File | null;
    fileType: string;
    fileUrl: string;
  };
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const MediaFormUploadsFile: React.FC<MediaFormUploadsFileProps> = ({
  formData,
  handleChange,
  handleFileChange,
  handleFileTypeChange,
}) => {
  // Generate temporary preview URLs



  // Helper to render file preview based on type


  return (
    <div className="flex flex-col justify-center items-start gap-5">
      <h3 className="text-xl font-outfit text-black">Step 3</h3>
      <h1 className="text-5xl font-outfit text-black">Upload File</h1>

      <div className="flex flex-col gap-5 w-[60%]">
        {/* Cover Image Upload */}
        <div className="flex flex-col w-full gap-y-4">
          <label
            htmlFor="coverImage"
            className="text-lg font-medium text-[#223658]"
          >
            Add Cover Image
          </label>

          <label
            htmlFor="coverImage"
            className="relative flex flex-col items-center justify-center w-full h-[250px] border-2 border-dashed border-[#223658] rounded-xl cursor-pointer bg-white hover:bg-white/60 transition overflow-hidden"
          >
            {formData.coverImage ? (
              <Image
                src={URL.createObjectURL(formData.coverImage)}
                alt="Cover Preview"
                height={250}
                width={400}
                className="absolute w-full h-full object-cover rounded-xl"
                onLoad={(e) =>
                  URL.revokeObjectURL((e.target as HTMLImageElement).src)
                }
              />
            ) : (
              <>
                <span className="text-[#223658] text-xl font-thin">
                  Add Cover +
                </span>
                <span className="text-xs font-thin text-gray-500">
                  Click to upload or drag & drop
                </span>
              </>
            )}
          </label>

          <input
            id="coverImage"
            name="coverImage"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <p className="text-[10px] font-poppins font-thin px-5 my-[-5px]">
            Note: Optimal Cover Dimensions — 400×250px
          </p>
        </div>

        {/* File Type Selector */}
        <div className="flex flex-col w-full gap-y-4">
          <label
            htmlFor="fileType"
            className="text-lg font-medium text-[#223658]"
          >
            Select File Type
          </label>

          <select
            id="fileType"
            value={formData.fileType}
            onChange={handleFileTypeChange}
            className="px-3 py-2 rounded-xl border border-gray-300"
          >
            <option value="pdf">Document .pdf</option>
            <option value="doc">Document .doc</option>
            <option value="mp3">Audio .mp3</option>
            <option value="mp4">Video .mp4</option>
            <option value="link">Paste Active Link</option>
          </select>
        </div>

        {/* File Upload Section */}
        {formData.fileType !== "link" && (
          <div className="flex flex-col w-full gap-y-4">
            <label
              htmlFor="file"
              className="text-lg font-medium text-[#223658] mb-1"
            >
              Add File
            </label>

            <label
              htmlFor="file"
              className="relative flex flex-col items-center justify-center w-full h-[200px] border-2 border-dashed border-[#223658] rounded-xl cursor-pointer bg-white hover:bg-white/60 transition overflow-hidden"
            >
              {formData.file ? (
                <>
                  {formData.fileType === "pdf" && (
                    <embed
                      src={URL.createObjectURL(formData.file)}
                      type="application/pdf"
                      className="absolute w-full h-full object-cover rounded-xl"
                      onLoad={(e) =>
                        URL.revokeObjectURL((e.target as HTMLEmbedElement).src)
                      }
                    />
                  )}
                  {formData.fileType === "mp4" && (
                    <video
                      src={URL.createObjectURL(formData.file)}
                      controls
                      className="absolute w-full h-full object-cover rounded-xl"
                      onLoadedData={(e) =>
                        URL.revokeObjectURL((e.target as HTMLVideoElement).src)
                      }
                    />
                  )}
                  {formData.fileType === "mp3" && (
                    <div className="flex flex-col items-center justify-center">
                      <audio
                        controls
                        src={URL.createObjectURL(formData.file)}
                        onLoadedData={(e) =>
                          URL.revokeObjectURL(
                            (e.target as HTMLAudioElement).src
                          )
                        }
                      />
                      <p className="text-sm text-gray-600 mt-2">
                        {formData.file.name}
                      </p>
                    </div>
                  )}
                  {(formData.fileType === "doc" || !formData.fileType) && (
                    <p className="text-sm text-gray-600 font-medium">
                      {formData.file.name}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <span className="text-[#223658] text-xl font-thin">
                    Add File +
                  </span>
                  <span className="text-xs font-thin text-gray-500">
                    Click to upload or drag & drop
                  </span>
                </>
              )}
            </label>

            <input
              id="file"
              name="file"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        )}

        {/* Link Input */}
        {formData.fileType === "link" && (
          <div className="flex flex-col w-full gap-y-4">
            <label
              htmlFor="fileUrl"
              className="text-lg font-medium text-[#223658] mb-1"
            >
              Add File URL
            </label>
            <input
              id="fileUrl"
              name="fileUrl"
              type="url"
              placeholder="https://example.com"
              className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#223658]"
              required
              value={formData.fileUrl}
              onChange={handleChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaFormUploadsFile;
