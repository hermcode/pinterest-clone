import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiDownload } from 'react-icons/fi'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment'

import { client, urlFor } from '../client'
import { useContext } from 'react'
import AppContext from '../context/AppContext'

const Pin = ({ pin }) => {

  const navigate = useNavigate()
  const { userData } = useContext(AppContext)
  const [postHovered, setPostHovered] = useState(false)
  const [savingPost, setSavingPost] = useState(false)

  let alreadySaved = !!(pin?.save?.filter((item) => item?.postedBy?._id === userData?._id))?.length;

  const savePin = (id) => {
    if (!alreadySaved) {
      setSavingPost(true);

      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert('after', 'save[-1]', [{
          _key: uuidv4(),
          userId: userData?._id,
          postedBy: {
            _type: 'postedBy',
            _ref: userData?._id,
          },
        }])

        .commit()
        .then(() => {
          window.location.reload();
          setSavingPost(false);
        });
    }
  }

  const getDateFromCreatedBy = (createdAt) => {
    const date = createdAt?.slice(0, 10).split("-").join('')
    return moment(date, "YYYYMMDD").fromNow()
  }

  // const handleSavingPost = (e) => {
  //   e.stopPropagation()
  //   setSavingPost(!savingPost)
  // }

  const deletePin = (id) => {
    client
      .delete(id)
      .then(() => {
        window.location.reload();
      });
  };

  return (
    <div className='my-4 mx-2 overflow-hidden no-selection'>
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin/${pin?._id}`)}
        className="relative cursor-zoom-in w-auto oveflow-hidden transition-all duration-500 ease-in-out mb-3"
      >
        {
          postHovered && (
            <>
              <div
                className='absolute t-0 w-full h-100 bg-neutral-800 opacity-50 rounded-3xl'
                style={{ height: "100%" }}
              ></div>
              <div
                className='absolute top-0 w-full h-full rounded-3xl p-4 flex flex-col justify-between'
              >
                <div className='flex item-center justify-between items-center'>
                  <div className='flex gap-2'>
                    <a
                      href={`${pin.image?.asset?.url}?dl=`}
                      download
                      onClick={(e) => e.stopPropagation()}
                      className="text-white rounded-full flex justify-center items-center text-dark text-xl opacity-60 hover:opacity-100 m-2"
                      title='Download image'
                    >
                      <FiDownload fontSize={25} />
                    </a>
                  </div>
                  <div className='text-white cursor-pointer flex justify-center items-center rounded-full opacity-60 hover:opacity-100 m-2' onClick={(e) => e.stopPropagation()}>
                    {alreadySaved ? (
                      <button type="button" className="bg-red-600 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none">
                        {pin?.save?.length}  Saved
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          savePin(pin?._id);
                        }}
                        type="button"
                        className="bg-red-600 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                      >
                        {pin?.save?.length}   {savingPost ? 'Saving' : 'Save'}
                      </button>
                    )}
                    {/* {savingPost
                      ? <FaBookmark
                        fontSize={25}
                        title="Unsave"
                        onClick={handleSavingPost}
                      />
                      : <FaRegBookmark
                        fontSize={25}
                        title="Save"
                        onClick={handleSavingPost}
                      />
                    } */}
                  </div>
                </div>
                <div className='flex justify-between items-center'>

                  {pin.destination && (
                    <a
                      href={pin.destination}
                      target="_blank"
                      rel='noreferrer'
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 bg-white text-black flex items-center rounded-full font-bold opacity-50 hover:opacity-100 overflow-hidden no-selection"
                    >
                      <figure className='ml-2'>
                        <FaExternalLinkAlt />
                      </figure>
                      <p className='mx-2'>
                        {pin.destination.length > 20
                          ? pin.destination.slice(8, 13) + '...'
                          : pin.destination.slice(8)
                        }
                      </p>

                    </a>

                  )
                  }
                  {pin.postedBy?._id === userData?._id && (
                    <button
                      title="Delete pin"
                      className="p-2 bg-white text-black flex items-center justify-center rounded-full font-bold opacity-50 hover:opacity-100 overflow-hidden no-selection w-9 h-9"
                      onClick={(e) => {
                        e.stopPropagation()
                        deletePin(pin?._id)
                      }}
                    >
                      <RiDeleteBin5Line fontSize={25} />
                    </button>
                  )
                  }
                </div>
              </div>
            </>
          )
        }
        <img
          src={urlFor(pin?.image).width(250).url()}
          alt="user-pin"
          className='rounded-3xl w-full'
        />
      </div>
      <Link
        to={`/profile/${pin?.postedBy?._id}`}
        className='flex items-center font-bold'
      >
        <img src={pin.postedBy?.image} alt='posted by' className='w-11 h-11 rounded-full' />
        <div className='ml-2'>
          <p className='hover:underline'>{pin?.postedBy?.userName}</p>
          <p className='font-semibold text-neutral-500'>{getDateFromCreatedBy(pin._createdAt)}</p>
        </div>
      </Link>
    </div>
  )
}

export default Pin