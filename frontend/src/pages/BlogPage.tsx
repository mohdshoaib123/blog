import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useAppData, blog_service, author_service, type Blog } from "../context/AppContext";
import { Bookmark, BookmarkCheck, Edit, IdCard, Trash2, User2 } from "lucide-react";
import toast from 'react-hot-toast'


interface comment {
  id: string;
  userid: string;
  comment: string;
  created_at: string;
  username: string;
}

const BlogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuth, user, fetchBlogs, savedBlogs, getSavedBlogs,author,setAuthor } = useAppData();

  const [blog, setBlog] = useState<Blog |null>(null);
 
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState<comment[]>([]);
  const [comment, setComment] = useState<string>("");
  const [saved, setSaved] = useState(false);

  // Fetch Blog
   const fetchSingleBlog = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${blog_service}/blog/api/v1/getsingleblog/${id}`);
      setBlog(data.blog);
      setAuthor(data.author);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Comments
  const fetchComment = async () => {
    try {
      const { data } = await axios.get(`${blog_service}/blog/api/v1/comment/${id}`);
      setComments(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSingleBlog()
    fetchComment();
  }, [id]);

  // Add Comment
  const addComment = async () => {
    try {
      const token = Cookies.get("token");
      await axios.post(
        `${blog_service}/blog/api/v1/comment/${id}`,
        { comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComment("");
      fetchComment();
    } catch {
      alert("Error adding comment");
    }
  };

  // Delete Comment
  const deleteComment = async (id:string) => {
    if (!window.confirm("Delete comment?")) return;
    try {
      const token = Cookies.get("token");
      await axios.delete(`${blog_service}/blog/api/v1/comment/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchComment();
    } catch(err) {
      // alert("Error deleting");
      console.log(err)
    }
  };

  // Delete Blog
  const deleteBlog = async () => {
    if (!window.confirm("Delete blog?")) return;
    try {
      const token = Cookies.get("token");
      await axios.delete(`${author_service}/author/api/v1/blog/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/");
      fetchBlogs();
    } catch {
      alert("Error deleting blog");
    }
  };

  // Save Blog
  const saveBlog = async () => {
    try {
      console.log(id)
      const token = Cookies.get("token");
     const {data}= await axios.post(
        `${blog_service}/blog/api/v1/save/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSaved(!saved);
      toast.success(data.message)
      
      getSavedBlogs();
    } catch(err) {
      console.log(err)
      
    }
  };

  useEffect(() => {
    if (savedBlogs?.some((b) => b.blogid === id)) {
      setSaved(true);
    } else {
      setSaved(false);
    }
  }, [savedBlogs, id]);

  if (!blog) return <p className="text-center mt-10">Loading...</p>;
 console.log("blog.author:", blog.author);
console.log("user._id:", user?._id);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      
      {/* Blog Card */}
      <div className="bg-white shadow rounded-lg p-5">
        <h1 className="text-3xl font-bold">{blog.title}</h1>

        <div className="flex items-center gap-3 mt-3 text-gray-600">
          <Link to={`/profile/${author?._id}`} className="flex items-center gap-2">
            <img src={author?.image} className="w-8 h-8 rounded-full" />
            {author?.name}
          </Link>

          {isAuth && (
            <button onClick={saveBlog}>
              {saved ? <BookmarkCheck /> : <Bookmark />}
            </button>
          )}

          {blog.author === user?._id && (
            <>
              <button >
                <Edit />
              </button>
              <button onClick={deleteBlog} className="text-red-500">
                <Trash2 />
              </button>
            </>
          )}
        </div>

        <img src={blog.image} className="w-full h-64 object-cover my-4 rounded" />
        <p>{blog.description}</p>

        <div dangerouslySetInnerHTML={{ __html: blog.blogcontent }} />
      </div>

      {/* Add Comment */}
      {isAuth && (
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Leave a comment</h3>
          <input
            className="border w-full p-2 my-2"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            onClick={addComment}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Post Comment
          </button>
        </div>
      )}

      {/* Comments */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Comments</h3>

        {comments.length > 0 ? (
          comments.map((c) => (
            <div key={c.id} className="border-b py-2 flex justify-between">
              <div>
                <p className="font-semibold flex items-center gap-1">
                  <User2 /> {c.username}
                </p>
                <p>{c.comment}</p>
                <p className="text-xs text-gray-500">
                  {new Date(c.created_at).toLocaleString()}
                </p>
              </div>

              {c.userid === user?._id && (
                <button onClick={() => deleteComment(c.id)} className="text-red-500">
                  <Trash2 />
                </button>
              )}
            </div>
          ))
        ) : (
          <p>No Comments Yet</p>
        )}
      </div>
    </div>
  );
};

export default BlogPage;