import { useContext } from 'react';
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import AppContext from '../context/AppContext';
import { decodeUserInfo } from '../utils/decodeUserInfo';

const useVerifyIfUserExist = () => {

  const navigate = useNavigate()
  const {setUserInfo} = useContext(AppContext)

  useEffect(() => {
    try {
      const User = decodeUserInfo()
      if (!User) navigate('/login');
      setUserInfo(User) // set to -> AppContext
    } catch (error) {
      localStorage.clear()
      navigate('/login')
    }    
  }, []);
}

export default useVerifyIfUserExist