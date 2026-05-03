
import React from 'react'
import { useAppData } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'


const Home = () => {
  
  const navigate=useNavigate()
  return (
   
  navigate("/blogs")
  )
}

export default Home
