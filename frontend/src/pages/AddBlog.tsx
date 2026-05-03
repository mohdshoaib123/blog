import React, { useMemo, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import JoditEditor from "jodit-react";

import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddBlog = () => {
  const editor = useRef(null);
  const navigate=useNavigate()
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image: null,
    blogcontent: "",
  });

  const blogCategories = ["Tech", "Business", "Education"]; // dummy

  const author_service = "http://localhost:80"; // change this

  const handleInputChange = (e:any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e:any) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("blogcontent", formData.blogcontent);
    form.append("category", formData.category);

    if (formData.image) {
      form.append("file", formData.image);
    }

    try {
      const token = Cookies.get("token");

      const { data } = await axios.post(
        `${author_service}/author/api/v1/blog/new`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(data.message);

      setFormData({
        title: "",
        description: "",
        category: "",
        image: null,
        blogcontent: "",
      });

      setContent("");
      navigate("/")
      
    } catch (err) {
      toast.error("Error while adding blog");
    } finally {
      setLoading(false);
    }
  };

 

 
  

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Start typing...",
    }),
    []
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Add New Blog</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <label className="font-medium">Title</label>
          <div className="flex gap-2">
            <input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter title"
              className="w-full border border-transparent hover:border-blue-400 rounded-lg px-3 py-2 outline-none"
            />
            
          </div>

          {/* Description */}
          <label className="font-medium">Description</label>
          <div className="flex gap-2">
            <input
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter description"
              className="w-full border border-transparent hover:border-blue-400 rounded-lg px-3 py-2"
            />
           
          </div>

          {/* Category */}
          <label className="font-medium">Category</label>
          <select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full border border-transparent hover:border-blue-400 rounded-lg px-3 py-2"
          >
            <option value="">Select category</option>
            {blogCategories.map((cat, i) => (
              <option key={i}>{cat}</option>
            ))}
          </select>

          {/* Image */}
          <label className="font-medium">Image</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full border rounded-lg p-2"
          />

          {/* Editor */}
          <label className="font-medium">Blog Content</label>

          

          <JoditEditor
            ref={editor}
            value={content}
            config={config}
            onBlur={(newContent) => {
              setContent(newContent);
              setFormData({ ...formData, blogcontent: newContent });
            }}
          />

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBlog;