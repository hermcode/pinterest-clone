import React, { useEffect, useRef, useState } from 'react'
import { Link, Routes, Route } from 'react-router-dom'
import { BiMenuAltLeft } from 'react-icons/bi';

import { Sidebar, UserProfile } from '../components'
import Pins from './Pins';
import { client } from '../client';
import logo from '../assets/logo-lg.png'
import { userQuery } from '../utils/data';
import ProfileOptions from '../components/ProfileOptions';
import { useContext } from 'react';
import AppContext from '../context/AppContext';
import useVerifyIfUserExist from '../hooks/useVerifyIfUserExist';

const Home = () => {

  const { userInfo, setUserData } = useContext(AppContext)

  const [toggleSidebar, setToggleSidebar] = useState(false)
  const scrollRef = useRef(null)
  const bgCloseRef = useRef(null)

  useVerifyIfUserExist()

  useEffect(() => {
    if (userInfo) {
      const query = userQuery(userInfo?.sub)
      client.fetch(query)
        .then((data) => {
          setUserData(data[0])
        })
    }
  }, [userInfo])

  useEffect(() => {
    scrollRef.current.scrollTo(0, 0)
  }, [])

  return (
    <div className="flex bg-gray-50 lg:flex-row flex-col h-screen transition-height duration-75 ease-out ">
      {/* lg sidebar */}
      <div className='hidden lg:flex h-screen flex-initial'>
        <Sidebar />
      </div>
      <div className="flex lg:hidden flex-row">
        {/* Header mobile */}
        <div className="w-full pr-6 pl-4 flex flex-row justify-between items-center h-20">
          <BiMenuAltLeft
            fontSize={35}
            className='cursor-pointer'
            onClick={() => setToggleSidebar(!toggleSidebar)}
          />
          <Link to='/'>
            <img src={logo} alt="Pinterest logo" className='w-32' />
          </Link>
          <ProfileOptions />
        </div>

        {/* lateral menu */}
        <div className={`fixed w-full md:w-1/3 lg:hidden bg-white h-screen overflow-y-auto z-10 duration-200 ${toggleSidebar ? 'left-0' : 'left-[-100%]'} shadow-xl z-20`}>
          <div 
            className={`fixed w-full h-full bg-black z-0 opacity-20 left-0 ${!toggleSidebar && 'hidden'}` }
            ref={bgCloseRef} 
            onClick={(e) => { if(bgCloseRef.current === e.target) setToggleSidebar(false) }}
          ></div>
          <Sidebar closeToggle={setToggleSidebar} />
        </div>
      </div>

      <main className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
        <Routes>
          <Route path='/profile/:userId' element={<UserProfile />} />
          <Route path='/*' element={<Pins />} />
        </Routes>
      </main>
    </div>

  )
}

export default Home