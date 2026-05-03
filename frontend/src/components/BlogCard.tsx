import React from "react";
import { Calendar } from "lucide-react";
import moment from "moment";


const BlogCard = ({ image, title, desc, id, time }) => {
  return (
    <a href={`/blogpage/${id}`} className="block">
      <div className="overflow-hidden rounded-xl transition duration-300 hover:shadow-xl bg-white">
        
        {/* Image */}
        <div className="w-full h-[200px]">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          
          {/* Date */}
          <p className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Calendar size={16} />
            {moment(time).format("DD-MM-YYYY")}
          </p>

          {/* Title */}
          <h2 className="text-lg font-semibold mt-2 text-center line-clamp-1">
            {title}
          </h2>

          {/* Description */}
          <p className="text-sm text-gray-600 text-center mt-1">
            {desc.slice(0, 50)}...
          </p>
        </div>
      </div>
    </a>
  );
};

export default BlogCard;