import React, { useState } from 'react'
import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {BsBoxArrowLeft} from 'react-icons/bs'
import {FaRegUser} from 'react-icons/fa'
import { useContext } from 'react'
import AppContext from '../context/AppContext'

const ProfileOptions = () => {

  const navigate = useNavigate()
  const { setUserInfo, userData } = useContext(AppContext)

  const optionsRef = useRef(null)
  const [optionsToggle, setOptionsToggle] = useState(false)

  const handleLogout = () => {
    localStorage.clear()
    setUserInfo(null)
    navigate('/login')
  }

  const handleOptionsToggle = () => {
    setOptionsToggle(!optionsToggle)
  }

  return (
    <div className='relative w-11 h-11 z-10'>
      <img 
        src={userData?.image} 
        alt="user-pic" 
        className=" rounded-full cursor-pointer" 
        onClick={handleOptionsToggle}
      />
      <div 
        className={` w-52 ${optionsToggle ? 'block' : 'hidden'} p-3 absolute bg-white rounded-2xl  right-0 mt-3 shadow-xl `} 
        ref={optionsRef} 
        onMouseLeave={handleOptionsToggle} 
        
      >
        <Link
          to={`/profile/${userData?._id}`}
          className="flex items-center py-2 px-4 hover:bg-neutral-100 rounded-lg font-semibold"
        >
          <FaRegUser fontSize={18}/>
          <p className='ml-2'>View Profile</p>
        </Link>
        <div className="flex items-center py-2 px-4 hover:bg-neutral-100 rounded-lg cursor-pointer font-semibold w-full text-left" onClick={handleLogout} >
          <BsBoxArrowLeft fontSize={20}/>
          <p className='ml-2'>Logout</p>
        </div>
      </div>
    </div>
  )
}

export default ProfileOptions