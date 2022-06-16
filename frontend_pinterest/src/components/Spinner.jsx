import React from 'react'
import {ThreeDots} from 'react-loader-spinner'

const Spinner = ({message}) => {
  return (
    <div className='flex flex-col justify-center items-center'>
      <ThreeDots 
        height="70"
        width="70"
        color='#797b7a'
        ariaLabel='loading'
      />
      <p className='text-xl text-center px-2 text-neutral-400 font-medium'>{message}</p>
    </div>
  )
}

export default Spinner