import React from 'react'
import {Routes,Route} from 'react-router-dom'
import Login from '../pages/Login'

  import Home from '../pages/Home'
import Profile from '../pages/Profile'
import AddBlog from '../pages/AddBlog'
import Blogs from '../pages/Blogs'
import BlogPage from '../pages/BlogPage'
import SavedBlogs from '../pages/SavedBlogs'
import { useAppData } from '../context/AppContext'

import UserProfilePage from '../pages/UserProfilePage'

const AppRoutes = () => {
  const {user,author}=useAppData()
  return (
    <Routes>
      <Route path='/login' element={<Login></Login>}/>
      {/* <Route path='/' element={<Home></Home>}/> */}
      <Route path='/profile/:id' element={(user?._id===author?._id)?<Profile />:<UserProfilePage/>}/>
      <Route path='/profile' element={<Profile />}/>
      <Route path='/addblog' element={<AddBlog />}/>
<Route path='/' element={<Blogs />}/>
<Route path='/blogpage/:id' element={<BlogPage />}/>
<Route path='/blog/saved' element={<SavedBlogs/>}/>


    </Routes>
  )
}

export default AppRoutes
