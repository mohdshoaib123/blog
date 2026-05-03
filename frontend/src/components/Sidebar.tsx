
import React from "react";
import { BoxSelect } from "lucide-react";
import { blogCategories, useAppData } from "../context/AppContext";

const SideBar = () => {
  const { searchQuery, setSearchQuery, setCategory } = useAppData();

  return (
    <aside className="w-64 min-h-screen bg-white border-r p-4">
      
      
     

      {/* Search */}
      <div className="mb-6">
        <p className="text-sm font-semibold mb-2">Search</p>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search your desired blog"
          className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* Categories */}
      <div>
        <p className="text-sm font-semibold mb-2">Categories</p>

        <button
          onClick={() => setCategory("")}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-gray-100"
        >
          <BoxSelect size={18} />
          <span>All</span>
        </button>

        {blogCategories?.map((e, i) => (
          <button
            key={i}
            onClick={() => setCategory(e)}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            <BoxSelect size={18} />
            <span>{e}</span>
          </button>
        ))}
      </div>

    </aside>
  );
};

export default SideBar;