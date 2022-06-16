import React, { useEffect, useState } from 'react';
import { HiDotsHorizontal } from 'react-icons/hi';
import { BsBoxArrowLeft } from 'react-icons/bs'
import { useParams, useNavigate } from 'react-router-dom';

import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/data';
import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { useContext } from 'react';
import AppContext from '../context/AppContext';

const UserProfile = () => {

  const navigate = useNavigate()
  const { userId } = useParams()
  const { userData, setUserInfo } = useContext(AppContext)

  /** States ================================================= */

  const [user, setUser] = useState()
  const [pins, setPins] = useState()
  const [text, setText] = useState('Created');
  const [activeBtn, setActiveBtn] = useState('created');
  const [logoutToggle, setLogoutToggle] = useState(false)

  /** Functions ============================================== */

  const handleLogout = () => {
    localStorage.clear()
    setUserInfo(null)
    navigate('/login')
  }

  const handleLogoutToggle = () => {
    setLogoutToggle(!logoutToggle)
  }

  useEffect(() => {
    const query = userQuery(userId)
    client.fetch(query)
      .then((data) => {
        setUser(data[0])
      })
  }, [userId])

  useEffect(() => {
    if (activeBtn === 'created') {
      const createdPinsQuery = userCreatedPinsQuery(userId)
      client.fetch(createdPinsQuery)
        .then((data) => {
          setPins(data)
        })
    } else {
      const savedPinsQuery = userSavedPinsQuery(userId)
      client.fetch(savedPinsQuery)
        .then((data) => {
          setPins(data)
        })
    }
  }, [activeBtn])

  /** Functional Components ================================== */

  if (!user) return <Spinner message='Loading user profile...'></Spinner>

  return (
    <div className='flex flex-col min-h-screen lg:w-4/5 m-auto'>
      <div className='flex flex-col relative items-center lg:mt-10'>

        { /* Logout option */}
        {userData?._id === userId && (
          <div className='hidden lg:block absolute top-0 right-0'>
            <div className='relative '>
              <figure
                className='hover:bg-gray-200 cursor-pointer w-12 h-12 rounded-full flex justify-center items-center no-selection'
                onClick={handleLogoutToggle}
              >
                <HiDotsHorizontal fontSize={30} />
              </figure>
              <div
                className={`${logoutToggle ? 'block' : 'hidden'} absolute right-0 mt-1 bg-white p-3 w-52 border shadow-xl rounded-2xl z-40 no-selection`}
                onMouseLeave={handleLogoutToggle}
              >
                <div
                  className="flex items-center py-2 px-4 hover:bg-neutral-100 rounded-lg cursor-pointer font-semibold w-full text-left"
                  onClick={handleLogout}
                >
                  <BsBoxArrowLeft fontSize={20} />
                  <p className='ml-2'>Logout</p>
                </div>
              </div>
            </div>
          </div>
        )}


        <figure className=' w-32 h-32 rounded-full overflow-hidden'>
          <img src={user?.image} alt="user-pic" />
        </figure>
        <h1 className='text-3xl font-bold mt-5'>{user?.userName}</h1>
        <div className='flex gap-3 font-bold mt-5'>
          <div>
            <button
              className={`${activeBtn === 'created' ? 'border-b-4' : ''} hover:bg-gray-200 border-black py-2 px-4 rounded-lg`}
              onClick={() => setActiveBtn('created')}
            >Created</button>
          </div>
          <div>
            <button
              className={`${activeBtn === 'saved' ? 'border-b-4' : ''} hover:bg-gray-200 border-black py-2 px-4 rounded-lg`}
              onClick={() => setActiveBtn('saved')}
            >Saved</button>
          </div>
        </div>
      </div>

      {pins ? (
        <div className='p-4'>
          <MasonryLayout pins={pins} />
        </div>
      )
        : <Spinner message='Loading pins...' />
      }

      {pins?.length === 0 && (
        <div className="flex justify-center font-bold items-center w-full text-2xl mt-2">
          No Pins Found!
        </div>
      )}

    </div>
  )
}

export default UserProfile