import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IoMdAdd } from 'react-icons/io';
import { BiSearch} from 'react-icons/bi';
import ProfileOptions from './ProfileOptions';

const Navbar = ({ searchTerm, setSearchTerm }) => {

  const navigate = useNavigate()

  return (
    <div className="flex gap-2 md:gap-5 w-full mt-0 lg:mt-5 pb-7 items-center">
      <Link 
        to={'/'} 
        className='hidden lg:block py-3 px-5 duration-200 hover:bg-neutral-200 rounded-full font-semibold'
      >
        Explore
      </Link>
      
      <div className="flex justify-start items-center w-full px-2 rounded-full bg-white focus-within:shadow-md border-2 border-neutral-200 ml-2 lg:ml-0">
        
        <BiSearch fontSize={25} className="ml-2 text-neutral-500" />
        <input
          type="text"
          spellCheck="false"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          value={searchTerm}
          onFocus={() => navigate('/search')}
          className="p-2 w-full bg-white outline-none rounded-r-full"
        />
      </div>
      <div className="flex gap-3 ">
        <Link 
          to="/create-pin" 
          className="bg-neutral-100 hover:bg-red-600 duration-200 text-black hover:text-white rounded-full h-11 w-11  flex justify-center items-center"  
          title="Create New Pin"
        >
          <IoMdAdd fontSize={25}/>
        </Link>
        <div className='hidden lg:block'>
          <ProfileOptions/>
        </div>
      </div>
    </div>
  )
}

export default Navbar