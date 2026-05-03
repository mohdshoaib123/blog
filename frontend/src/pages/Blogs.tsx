import React from "react";
import BlogCard from "../components/BlogCard"; 
import Loading from "../components/Loading";
import { useAppData } from "../context/AppContext";
import { Filter } from "lucide-react";
import HomeLayout from "../components/HomeLayout";

const Blogs = () => {
  const { isLoading, blogLoading, blogs } = useAppData();
  const{toggleSidebar}=useAppData()
  

  return (
    <HomeLayout>
      <div>
        {isLoading ? (
          <Loading />
        ) : (
          <div className="container mx-auto px-4">
            
            {/* Header */}
            <div className="flex justify-between items-center my-5">
              <h1 className="text-3xl font-bold">Latest Blogs</h1>

              <button
                onClick={toggleSidebar}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Filter size={18} />
                <span>Filter Blogs</span>
              </button>
            </div>

            {/* Blog Section */}
            {blogLoading ? (
              <Loading />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {blogs?.length === 0 && <p>No Blogs Yet</p>}

                {blogs &&
                  blogs.map((e, i) => (
                    <BlogCard
                      key={i}
                      image={e.image}
                      title={e.title}
                      desc={e.description}
                      id={e.id}
                      time={e.created_at}
                    />
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </HomeLayout>
  );
};

export default Blogs;