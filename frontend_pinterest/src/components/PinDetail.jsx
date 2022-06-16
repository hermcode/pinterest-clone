import React, { useState, useEffect } from 'react'
// import { MdDownloadForOffline } from 'react-icons/md';
import { FiDownload } from 'react-icons/fi'
import { HiDotsHorizontal } from 'react-icons/hi'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { client, urlFor } from '../client';
import MasonryLayout from './MasonryLayout';
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data';
import Spinner from './Spinner';
import { useContext } from 'react';
import AppContext from '../context/AppContext';


const PinDetail = () => {

  const { userData } = useContext(AppContext)

  /** States ===================================================== */

  const { pinId } = useParams();
  const [pins, setPins] = useState();
  const [pinDetail, setPinDetail] = useState();
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);

  /** Functions ===================================================== */

  const addComment = () => {
    if (comment.trim()) {
      setAddingComment(true)
      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert('after', 'comments[-1]', [{ comment, _key: uuidv4(), postedBy: { _type: 'postedBy', _ref: userData._id } }])
        .commit()
        .then(() => {
          fetchPinDetails();
          setComment('');
          setAddingComment(false);
        });
    }
  }

  const fetchPinDetails = () => {
    let query = pinDetailQuery(pinId)

    if (query) {
      client.fetch(query)
        .then((data) => {
          setPinDetail(data[0])

          if (data[0]) {
            query = pinDetailMorePinQuery(data[0])

            client.fetch(query)
              .then((response) => setPins(response))
          }
        })
    }
  }

  useEffect(() => {
    fetchPinDetails()
  }, [pinId])


  if (!pinDetail) return <Spinner message="Loading Pin..." />

  return (
    <>
      {pinDetail && (
        <div className="flex xl:flex-row flex-col m-auto justify-center w-full" style={{ maxWidth: '1200px', borderRadius: '32px' }}>
          <div className='flex flex-col w-full md:flex-row'>
            <figure className="w-full md:w-1/2">
              <img
                className='rounded-3xl w-auto max-h-800 m-auto'
                src={(pinDetail?.image && urlFor(pinDetail?.image).url())}
                alt="user-post"
              />
            </figure>
            <div className='flex flex-col gap-3 w-full md:p-6 p-3 flex-1'>
              <div className='flex justify-between items-center'>
                <a
                  href={`${pinDetail?.image?.asset?.url}?dl=`}
                  download
                  className="hover:bg-neutral-200 p-2 text-xl rounded-full flex items-center justify-center w-11 h-11"
                >
                  <FiDownload fontSize={22} />
                </a>
              </div>
              <h1 className='text-3xl font-semibold'>{pinDetail?.title}</h1>
              <p>{pinDetail.about}</p>
              { pinDetail.destination && (
                <a
                  href={pinDetail.destination}
                  target="_blank"
                  className='flex hover:underline items-center rounded-full py-3 w-auto  font-semibold max-w-xs max-w'
                >
                  <FaExternalLinkAlt fontSize={20} className='mr-2' />
                  {pinDetail.destination?.slice(0, 30) + '...'}
                </a>

              )}
              <Link to={`/profile/${pinDetail.postedBy?._id}`} className='flex items-center'>
                <img src={pinDetail.postedBy.image} alt="user-pic" className='w-11 h-11 rounded-full' />
                <div>
                  <p className='ml-2 font-semibold text-xs opacity-50'>Posted by</p>
                  <p className='ml-2 font-semibold hover:underline'>{pinDetail.postedBy?.userName}</p>
                </div>

              </Link>
              <div>
                <h2 className="mt-5 text-xl font-semibold">Comments</h2>
                <div className="max-h-370 overflow-y-auto">
                  {pinDetail?.comments?.map((item) => (
                    <div className="flex gap-2 mt-2 items-center rounded-lg" key={item.comment}>
                      <img
                        src={item.postedBy?.image}
                        className="w-10 h-10 rounded-full cursor-pointer"
                        alt="user-profile"
                      />
                      <div className="flex flex-col">
                        <p className="font-bold">{item.postedBy?.userName}</p>
                        <p>{item.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {userData && (
                <div className='flex mt-4'>
                  {/* <Link to={`/profile/${userData?._id}`} className='flex items-center'>
                    <figure className='w-12 h-12'>
                      <img src={userData.image} alt="user-pic" className='rounded-full' />
                    </figure>
                  </Link> */}
                  <input
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    type="text"
                    className='border-2 border-neutral-200 outline-none bg-transparent py-2 px-5 w-full mr-4 rounded-full font-medium focus:border-neutral-300'
                    placeholder='Add a comment'
                  />
                  <button
                    type="button"
                    className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
                    onClick={addComment}
                  >
                    {addingComment ? 'Posting...' : 'Post'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {pins?.length > 0 && (
        <h2 className="text-center font-bold text-2xl mt-8 mb-4">
          More like this
        </h2>
      )}
      {pins ? (
        <MasonryLayout pins={pins} />
      ) : (
        <Spinner message="Loading more pins" />
      )}
    </>
  )
}

export default PinDetail