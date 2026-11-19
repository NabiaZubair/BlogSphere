import React from 'react'
import { Link } from "react-router-dom"
import { BookOpen, Search,Sun,Moon } from "lucide-react"



const Navbar = () => {
  return (

      <header className='border-b border-purple-100 bg-white'>
        <nav className=" flex  items-center justify-between px-6 py-4">
          <Link to="/" className='flex items-center gap-2'>
            <div  className="rounded-xl bg-purple-100 p-2 text-purple-600">
              <BookOpen size={22} />
            </div>
            <span  className="text-xl font-bold text-gray-900">BlogSphere</span>
          </Link>
          <div className="hidden items-center gap-7 md:flex">
            <Link to="/" className="text-gray-700 hover:text-purple-700">Home</Link>
            <Link to="/explore" className="text-gray-700 hover:text-purple-700">Explore</Link>
            <Link to="/about" className="text-gray-700 hover:text-purple-700">About</Link>
          </div>
          <div className='flex items-center gap-4'>
            <button  type="button"
            aria-label="Search"
            className="rounded-lg p-2 text-gray-600 hover:bg-purple-50 hover:text-purple-700"><Search size={22} /></button>
             <button  type="button"
            aria-label="Search"
            className="rounded-lg p-2 text-gray-600 hover:bg-purple-50 hover:text-purple-700"><Sun />
            </button>
             <button  type="button"
            aria-label="Search"
            className="rounded-lg p-2 text-gray-600 hover:bg-purple-50 hover:text-purple-700"><Moon />
            </button>
            <Link to="/register" className="hidden rounded-lg px-4 py-2 font-medium text-gray-700 hover:bg-purple-50 sm:block">Sign up</Link>
            <Link  to="/login"
            className="rounded-lg bg-purple-600 px-4 py-2 font-medium text-white transition hover:bg-purple-700">Log in </Link>
               
          </div>
        </nav>
      </header>
    
  )
}

export default Navbar
