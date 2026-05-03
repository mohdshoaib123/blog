import React, { type ReactNode } from 'react'
import Navbar from './Navbar';
import { AppProvider } from '../context/AppContext';

interface LayoutProps{
  children:ReactNode;
}
const Layout:React.FC<LayoutProps> = ({children}) => {
  return (
    
    <div className='h-screen'>
      <div className='h-[90%]'>
        <Navbar></Navbar>
{children}
      </div>
      
    </div>
    
  )
}

export default Layout
