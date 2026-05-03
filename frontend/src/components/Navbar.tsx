import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X, LogIn, CircleUser } from "lucide-react";
import { useAppData } from "../context/AppContext";

const Navbar = () => {
  const {isLoading,isAuth}=useAppData()
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md p-4 z-50">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-gray-900">
          The Reading Retreat
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center space-x-6 text-gray-700">
         <li><Link to="/" className="hover:text-blue-500">Home</Link></li>
          <li><Link to="/blog/saved" className="hover:text-blue-500">Saved Blogs</Link></li>
          
          
          {isLoading?"":<li>
            
            {isAuth?( <Link to="/profile" className="hover:text-blue-500 flex items-center gap-1">
              
              <CircleUser />
            </Link>):(<Link to="/login" className="hover:text-blue-500 flex items-center gap-1">
              <LogIn className="w-4 h-4" />
              Login
            </Link>)}
          </li>}
        </ul>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col items-center space-y-4 p-4 text-gray-700 bg-white shadow-md">
          <li onClick={() => setIsOpen(false)}>
            <Link to="/" className="hover:text-blue-500">Home</Link>
          </li>
          <li onClick={() => setIsOpen(false)}>
            <Link to="/blog/saved" className="hover:text-blue-500">Saved Blogs</Link>
          </li>
          <li onClick={() => setIsOpen(false)}>
            <Link to="/login" className="hover:text-blue-500 flex items-center gap-1">
              <LogIn className="w-4 h-4" />
              Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;