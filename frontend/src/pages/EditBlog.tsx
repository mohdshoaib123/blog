import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams, useNavigate } from "react-router-dom";
import JoditEditor from "jodit-react";

import {
  author_service,
  blog_service,
  blogCategories,
  useAppData,
} from "../context/AppContext";

const EditBlogPage = () => {
  const editor = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const { fetchBlogs } = useAppData();

  const [content, setContent] = useState("");
  const [existingImage, setExistingImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image: null,
    blogcontent: "",
  });

  // ✅ input change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
  };

  // ✅ editor config
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Start typing...",
    }),
    []
  );

  // ✅ fetch blog
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${blog_service}/blog/api/v1/blog/${id}`
        );

        const blog = data.blog;

        setFormData({
          title: blog.title,
          description: blog.description,
          category: blog.category,
          image: null,
          blogcontent: blog.blogcontent,
        });

        setContent(blog.blogcontent);
        setExistingImage(blog.image);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBlog();
  }, [id]);

  // ✅ submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("blogcontent", formData.blogcontent);
      form.append("category", formData.category);

      if (formData.image) {
        form.append("file", formData.image);
      }

      const token = Cookies.get("token");

      await axios.post(
        `${author_service}/author/api/v1/blog/${id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Blog updated successfully");
      fetchBlogs();
      navigate("/blogs");
    } catch (err) {
      alert("Error updating blog");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Edit Blog</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Title */}
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter blog title"
              className="w-full border p-2 rounded"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <input
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter description"
              className="w-full border p-2 rounded"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block mb-1 font-medium">Category</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full border p-2 rounded"
            >
              <option value="">Select category</option>
              {blogCategories?.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Image */}
          <div>
            <label className="block mb-1 font-medium">Image</label>

            {existingImage && !formData.image && (
              <img
                src={existingImage}
                alt=""
                className="w-40 h-40 object-cover rounded mb-2"
              />
            )}

            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          {/* Editor */}
          <div>
            <label className="block mb-1 font-medium">Blog Content</label>

            <p className="text-sm text-gray-500 mb-2">
              Write your blog using rich text editor
            </p>

            <JoditEditor
              ref={editor}
              value={content}
              config={config}
              tabIndex={1}
              onBlur={(newContent) => {
                setContent(newContent);
                setFormData({ ...formData, blogcontent: newContent });
              }}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            {loading ? "Updating..." : "Update Blog"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditBlogPage;