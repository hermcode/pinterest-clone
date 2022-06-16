import React from 'react'
import { useNavigate } from 'react-router-dom';
import shareVideo from '../assets/share.mp4';
import logoLargeImage from '../assets/logo-lg.png';
import { useEffect } from 'react';
import { client } from '../client';
import { decodeUserInfo } from '../utils/decodeUserInfo';

const Login = () => {

  const navigate = useNavigate();

  const responseGoogle = (response) => {
    localStorage.setItem('userToken', JSON.stringify(response.credential));
    const profileObj = decodeUserInfo()

    const { name, picture, sub } = profileObj
    const doc = {
      _id: sub,
      _type: 'user',
      userName: name,
      image: picture,
    };
    client.createIfNotExists(doc)
      .then(() => {
        navigate('/', { replace: true });
      })
  }

  useEffect(() => {
    /*global google*/
      google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_API_TOKEN,
        callback: responseGoogle
      })
      
      google.accounts.id.renderButton(
        document.getElementById('signIn'),
        { theme: 'outline', size: 'large' }
      )
  }, [])

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className=" relative w-full h-full">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />

        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          <div className=" flex flex-col items-center p-5 pt-7 pb-7 bg-white rounded-2xl text-center w-4/5 md:w-1/2 lg:w-96 ">
            <figure className="text-3xl w-32 mb-5">
              <img src={logoLargeImage} alt="Pinterest logo" />
            </figure>
            <h1 className='text-2xl font-semibold mb-1'>Welcome to pinterest</h1>
            <p className='mb-5'>Here you can find new ideas</p>
            <div id="signIn"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login