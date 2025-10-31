"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { pages } from "@/assets"; // Your imported pages
// import Short from "@/assets/short";

export default function EditImages() {
  const [selectedPage, setSelectedPage] = useState("Home Page");
  const [saveChanges, setSaveChanges] = useState(false);

  // Function to map page names to keys
  const pageNames: { [key: string]: keyof typeof pages } = {
    "Home Page": "home",
    "Mission Vision": "mission-vision",
    "Join our Network": "partnerships",
    Team: "team",
    Products: "products",
    Gallery: "gallery",
    Advertise: "advertise",
    Blogs: "blogs",
    Pricing: "pricing",
    Insights: "insights",
    EURideshareSeries: "euseries",
  };

  const renderPageContent = () => {
    const Component = pages[pageNames[selectedPage]];
    if (Component) {
      return (
        <div className="border-2 border-black">
          <Component />
        </div>
      ); // Pass the images as props
    }
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex xl:px-32 px-8 w-full py-8 flex-col">
        <h1 className="text-3xl font-bold mb-6">Website Images</h1>
        <div className="mb-6">
          <select
            value={selectedPage}
            onChange={(e) => setSelectedPage(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="Home Page">Home Page</option>
            <option value="Mission Vision">Mission Vision</option>
            <option value="Products">Products</option>
            <option value="Join our Network">Join Our Network</option>
            <option value="Team">Team</option>
            <option value="Gallery">Gallery</option>
            <option value="Advertise">Advertise</option>
            <option value="Blogs">Blogs</option>
            <option value="Insights">EURideshareSeries</option>
            <option value="EURideshareSeries">Insights</option>

            <option value="Pricing">Pricing</option>
          </select>
        </div>
        {renderPageContent()}
        {saveChanges && (
          <div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setSaveChanges(false)}
            >
              Save
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
