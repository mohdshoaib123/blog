import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import cookies from 'js-cookie'
import axios from "axios";
import toast,{Toaster} from 'react-hot-toast'


export const blogCategories = [
  "Techonlogy",
  "Health",
  "Finance",
  "Travel",
  "Education",
  "Entertainment",
  "Study",
];



export const user_service='http://localhost:80'
export const  author_service='http://localhost:80'
export const blog_service='http://localhost:80'


export interface User{
  _id:string;
    name:string;
  email:string;
  image:string;
  instagram:string;
  facebook:string;
  linkedin:string;
  bio:string;
}
export interface Blog{
  id:string;
    title:string;
  description:string;
  blogcontent:string;
  image:string;
  category:string;
  author:string;
  created_at:string;
}
interface SavedBlogType {
  id: string;
  userid: string;
  blogid: string;
  create_at: string;
}


interface AppContextType{
  user:User | null;
  isLoading:boolean;
  isAuth:boolean;
  setIsLoading:React.Dispatch<React.SetStateAction<boolean>>;
  setIsAuth:React.Dispatch<React.SetStateAction<boolean>>;
  setUser:React.Dispatch<React.SetStateAction<User|null>>;
  logoutUser:()=>Promise<void>;
  blogs:Blog[]|null;
  blogLoading:boolean;
  setSearchQuery:React.Dispatch<React.SetStateAction<string>>;
  searchQuery:string,
  setCategory:React.Dispatch<React.SetStateAction<string>>;
  isSidebarOpen:boolean;
  toggleSidebar:()=>void;
   fetchBlogs: () => Promise<void>;
  savedBlogs: SavedBlogType[] | null;
  getSavedBlogs: () => Promise<void>;
  author:User|null;
  setAuthor:React.Dispatch<React.SetStateAction<User|null>>

}

const AppContext=createContext<AppContextType|null>(null);
interface AppProviderPtops{
  children:ReactNode
}

export const AppProvider:React.FC<AppProviderPtops>=({children})=>{
  const [user, setUser] = useState<User |null>(null)
  const [isAuth, setIsAuth] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const[blogLoading,setBlogLoading]=useState(true);
  const [blogs, setBlogs] = useState<Blog[]|null>(null);
const [category, setCategory] = useState("");
const [searchQuery, setSearchQuery] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const [savedBlogs, setSavedBlogs] = useState<SavedBlogType[] | null>(null);
    const [author, setAuthor] = useState<User|null>(null);


  async function fetchUser() {
    try {
      const token=cookies.get('token');
      const {data}=await axios.get(`${user_service}/user/api/v1/myprofile`,{headers:{
        Authorization:`Bearer ${token}`
      }})
      setUser(data);
      setIsAuth(true);
      setIsLoading(false);
      
    } catch (error) {
      console.log(error)
      setIsLoading(false)
      
    }
  }
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  async function fetchBlogs(){
    setBlogLoading(true);

    try{
      const {data}=await axios.get(`${blog_service}/blog/api/v1/blog/all?searchQuery=${searchQuery}&category=${category}`)
      setBlogs(data)
      
    }
    catch(err){

      console.log(err)
    }
    finally{
setBlogLoading(false)
    }

  }
  const getSavedBlogs = async () => {
  try {
    const token = cookies.get("token");

    const { data } = await axios.get(
      `${blog_service}/blog/api/v1/blog/saved/all`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
console.log(data)
    setSavedBlogs(data);
  } catch (error) {
    console.log(error);
  }
};


  async function logoutUser() {
    cookies.remove("token")
    setUser(null);
    setIsAuth(false);
    toast.success("user logged out");
    
  }
  useEffect(()=>{
fetchUser();
getSavedBlogs();

  },[])

useEffect(()=>{
fetchBlogs();
},[searchQuery,category])

  return (
    <AppContext.Provider value={{user,isAuth,setIsAuth,isLoading,setIsLoading,setUser,logoutUser,blogs,blogLoading,searchQuery,setCategory,setSearchQuery,isSidebarOpen,toggleSidebar, fetchBlogs,
        savedBlogs,author,setAuthor,
        getSavedBlogs,}}> {children} <Toaster /></AppContext.Provider>
  )

}
export const useAppData=():AppContextType=>{
  const context=useContext(AppContext)
  if(!context){
    throw new Error('useappdata must be used within AppProvider')
  }
return context;
}