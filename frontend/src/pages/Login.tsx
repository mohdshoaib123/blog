
import axios from "axios";
import Layout from "../components/Layout";
import Cookies from "js-cookie";
import React from "react";
import { useAppData, user_service } from "../context/AppContext";
import toast from "react-hot-toast";
import {useGoogleLogin} from "@react-oauth/google"
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";


const Login = () => {
  const navigate=useNavigate()

  const {isAuth,setIsAuth,user,setIsLoading,isLoading,setUser}=useAppData()

  if(isAuth) navigate('/')
  
  const responseGoogle =async (authResult:any) => {
    try { const result=await axios.post(`${user_service}/user/api/v1/login`,{code:authResult['code']})
    Cookies.set("token",result.data.token,{expires:5,secure:true,path:"/"})
    toast.success(result.data.message)
    setIsAuth(true)
    setIsLoading(false)
    setUser(result.data.user)
    
      
    } catch (error:any) {
      console.log("error",error)
      toast.error("problem while login you")
    }
   
    // yaha Firebase ya OAuth logic add kar sakte ho
  };

  const googleLogin=useGoogleLogin({onSuccess:responseGoogle,
    onError:responseGoogle,
    flow:"auth-code"
  })

  return (
  <> {isLoading?<Loading />:(
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-[340px] text-center">
        
        <h2 className="text-lg font-semibold text-gray-800">
          Login to The Reading Retreat
        </h2>

        <p className="text-sm text-gray-500 mt-1 mb-6">
          Your go to blog app
        </p>

        <button
          onClick={googleLogin}
          className="flex items-center justify-center gap-3 w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition"
        >
          <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold text-blue-500">
            G
          </div>
          Login with Google
        </button>
      </div>
    </div>)
   }</>
  );
};

export default Login;