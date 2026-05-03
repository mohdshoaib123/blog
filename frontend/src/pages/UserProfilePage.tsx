import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import {user_service, type User} from "../context/AppContext"


// const user_service = "YOUR_API_BASE_URL"; // replace this

const UserProfilePage = () => {
  const [user, setUser] = useState<User|null>(null);
  const { id } = useParams();

  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`${user_service}/user/api/v1/user/profile/${id}`);
      setUser(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-semibold text-center mb-4">Profile</h2>

        <div className="flex flex-col items-center space-y-4">
          <img
            src={user?.image}
            alt="profile"
            className="w-28 h-28 rounded-full border-4 border-gray-200 shadow-md object-cover"
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

          <div className="flex gap-4 mt-3">
            {user?.instagram && (
              <a href={user.instagram} target="_blank" rel="noreferrer">
                <FaInstagram className="text-pink-500 w-6 h-6" />
              </a>
            )}

            {user?.facebook && (
              <a href={user.facebook} target="_blank" rel="noreferrer">
                <FaFacebook className="text-blue-500 w-6 h-6" />
              </a>
            )}

            {user?.linkedin && (
              <a href={user.linkedin} target="_blank" rel="noreferrer">
                <FaLinkedin className="text-blue-700 w-6 h-6" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;