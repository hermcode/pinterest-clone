import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { IoHomeSharp } from 'react-icons/io5'
import { GrClose } from 'react-icons/gr';
import { FaChevronRight } from 'react-icons/fa';

import logo from '../assets/logo-lg.png'
import { categories } from '../utils/data'
import { useContext } from 'react';
import AppContext from '../context/AppContext';

const isNotActiveStyle = 'flex items-center px-8 py-1 hover:bg-neutral-100 gap-2 text-base text-neutral-500 font-bold hover:text-black transition-all duration-200 ease-in-out capitalize';
const isActiveStyle = 'flex items-center px-8 py-1 hover:bg-neutral-100 text-base gap-2 font-extrabold border-r-2 border-black  transition-all duration-200 ease-in-out capitalize';



const Sidebar = ({ closeToggle }) => {

  const { userData } = useContext(AppContext)

  const handleCloseSidebar = () => {
    if(closeToggle) closeToggle(false)
  }

  return (
    <div className="flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 lg:min-w-300 hide-scrollbar shadow-xl relative">
      <div className="flex flex-col jus">
        <div className='flex justify-between items-center'>
          <Link
            to="/"
            className="flex px-5 gap-2 w-190 items-center h-20 cursor-pointer"
            onClick={handleCloseSidebar}
          >
            <img src={logo} alt="logo" />
          </Link>
          <GrClose 
            fontSize={20} 
            className='lg:hidden md:block cursor-pointer mr-6 mt-1'
            onClick={handleCloseSidebar}
          />
        </div>
        <div className="flex flex-col gap-1 mb-10">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? isActiveStyle : isNotActiveStyle)}
            onClick={handleCloseSidebar}
          >
            <IoHomeSharp className='my-4'/>
            Home
          </NavLink>
          <h3 className="mt-2 px-5 text-base 2xl:text-base">Discover categories</h3>
          <div className='px-4 mb-4'>
            <hr />
          </div>
          {
            categories.slice(0, categories.length - 1).map((category) => 
              <NavLink 
                to={`/category/${category.name.toLowerCase()}`}
                key={category.name}
                className={({ isActive }) => (isActive ? isActiveStyle : isNotActiveStyle)}
                onClick={handleCloseSidebar}
              >
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-10 h-10 rounded-full mr-2"
                />
                {category.name}
              </NavLink>
            )
          }
        </div>
      </div>
      { userData && (
          <Link
            to={`/profile/${userData._id}`}
            className="flex pl-5 gap-2 py-3 items-center bg-white hover:bg-neutral-100 border-t"
            onClick={handleCloseSidebar}
          >
            <img src={userData.image} alt="user" className="mr-3 w-11 rounded-full" />
            <p className='font-semibold'>{userData.userName}</p>
            <FaChevronRight />
          </Link>
        )}
    </div>
  )
}

export default Sidebar