import React, { useRef, useState } from "react";
import { useAppData, user_service } from "../context/AppContext";
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "../components/Loading";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";

import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, setUser, logoutUser } = useAppData();
  const navigate = useNavigate();

  const inputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    instagram: user?.instagram || "",
    facebook: user?.facebook || "",
    linkedin: user?.linkedin || "",
    bio: user?.bio || "",
  });

  // 🔥 redirect fix (React Router)
  if (!user) {
    navigate("/login");
  }

  const logoutHandler = () => {
    logoutUser();
    navigate("/login");
  };

  const clickHandler = () => {
    inputRef.current?.click();
  };

  const changeHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("file", file);

    try {
      setLoading(true);
      const token = Cookies.get("token");

      const { data } = await axios.post(
        `${user_service}/user/api/v1/user/update/pic`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(data.message);
      Cookies.set("token", data.token, { expires: 5, path: "/" });
      setUser(data.user);
    } catch (err) {
      toast.error("Image Update Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("token");

      const { data } = await axios.post(
        `${user_service}/user/api/v1/user/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(data.message);
      Cookies.set("token", data.token, { expires: 5, path: "/" });
      setUser(data.user);
      setOpen(false);
    } catch (err) {
      toast.error("Update Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      {loading && <Loading />}

      <div className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-semibold text-center mb-4">Profile</h2>

        {/* Avatar */}
        <div className="flex flex-col items-center gap-4">
          <img
            src={user?.image}
            alt="profile"
            onClick={clickHandler}
            className="w-28 h-28 rounded-full border-4 border-gray-200 cursor-pointer object-cover"
          />

          <input
            type="file"
            className="hidden"
            ref={inputRef}
            accept="image/*"
            onChange={changeHandler}
          />

          <div className="text-center">
            <p className="font-medium">Name</p>
            <p>{user?.name}</p>
          </div>

          {user?.bio && (
            <div className="text-center">
              <p className="font-medium">Bio</p>
              <p>{user.bio}</p>
            </div>
          )}

          {/* Social Icons */}
          <div className="flex gap-4 mt-2">
            {user?.instagram && (
              <a href={user.instagram} target="_blank">
                <FaInstagram className="text-pink-500 hover:text-pink-400" />
              </a>
            )}
            {user?.facebook && (
              <a href={user.facebook} target="_blank">
                <FaFacebook className="text-blue-500 hover:text-blue-400" />
              </a>
            )}
            {user?.linkedin && (
              <a href={user.linkedin} target="_blank">
                <FaLinkedin className= " text-blue-700  hover:text-blue-500" />
              </a>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-2 mt-4 flex-wrap justify-center">
            <button
              onClick={logoutHandler}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Logout
            </button>

            <button
              onClick={() => navigate("/addblog")}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Add Blog
            </button>

            <button
              onClick={() => setOpen(true)}
              className="border px-4 py-2 rounded"
            >
              Edit
            </button>
          </div>
        </div>

        {/* Modal */}
        {open && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-xl w-[400px] space-y-3">
              <h3 className="text-lg font-semibold">Edit Profile</h3>

              <input
                className="w-full border p-2 rounded"
                value={formData.name}
                placeholder="Name"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <input
                className="w-full border p-2 rounded"
                value={formData.bio}
                placeholder="Bio"
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
              />

              <input
                className="w-full border p-2 rounded"
                value={formData.instagram}
                placeholder="Instagram"
                onChange={(e) =>
                  setFormData({ ...formData, instagram: e.target.value })
                }
              />

              <input
                className="w-full border p-2 rounded"
                value={formData.facebook}
                placeholder="Facebook"
                onChange={(e) =>
                  setFormData({ ...formData, facebook: e.target.value })
                }
              />

              <input
                className="w-full border p-2 rounded"
                value={formData.linkedin}
                placeholder="LinkedIn"
                onChange={(e) =>
                  setFormData({ ...formData, linkedin: e.target.value })
                }
              />

              <button
                onClick={handleFormSubmit}
                className="w-full bg-blue-500 text-white py-2 rounded mt-2"
              >
                Save Changes
              </button>

              <button
                onClick={() => setOpen(false)}
                className="w-full text-gray-500 mt-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;