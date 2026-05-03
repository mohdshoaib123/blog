
import SideBar from "./Sidebar"
import Navbar from "./Navbar";
import { useAppData } from "../context/AppContext";

interface BlogsProps {
  children: React.ReactNode;
}

const HomeLayout: React.FC<BlogsProps> = ({ children }) => {
  const {isSidebarOpen }=useAppData()
  

  
  return (  <div className="w-full min-h-screen">
      
      {/* Navbar Top */}
      <Navbar />

      {/* Sidebar + Content */}
      <div className="flex">
        
        {/* Sidebar */}
     <div
  className={`
    ${isSidebarOpen ? "block" : "hidden"}
    md:block
  `}
>
  <SideBar />
</div>

        {/* Main Content */}
        <main className="flex-1 bg-gray-50">
          <div className="w-full min-h-[calc(100vh-64px)] px-4 py-4">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
};

export default HomeLayout;