import React, { useContext, useState } from 'react'
import AppContext from '../context/AppContext'
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { BiLinkAlt } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';

import { categories } from '../utils/data';
import { client } from '../client';
import Spinner from './Spinner';

const CreatePin = () => {

  const { userData } = useContext(AppContext)

  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [destination, setDestination] = useState('');
  const [category, setCategory] = useState();
  const [fields, setFields] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageAsset, setImageAsset] = useState();
  const [wrongImageType, setWrongImageType] = useState(false);

  const navigate = useNavigate();

  const uploadImage = (e) => {
    const selectedFile = e.target.files[0]
    const { type } = selectedFile

    if (type === 'image/jpg' || type === 'image/jpeg' || type === 'image/svg' || type === 'image/png' || type === 'image/gif' || type === 'image/tiff') {
      setWrongImageType(false)
      setLoading(true)
      client.assets
        .upload('image', selectedFile, { contentType: type, filename: selectedFile.name })
        .then((document) => {
          setImageAsset(document)
          setLoading(false)
        })
        .catch((error) => {
          console.log(`Upload failed: ${error.message}`);
        })
    } else {
      setLoading(false)
      setWrongImageType(true)
    }
  }

  const savePin = () => {
    if (title && about && destination && imageAsset?._id && category) {
      setFields(false);
      const doc = {
        _type: 'pin',
        title,
        about,
        destination,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset?._id,
          },
        },
        userId: userData._id,
        postedBy: {
          _type: 'postedBy',
          _ref: userData._id,
        },
        category,
      };
      client.create(doc)
        .then(() => {
          navigate('/');
        });
    } else {
      setFields(true);
      // setTimeout(() => setFields(false), 2000 );
    }
  };

  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-7/12 md:w-3/4 w-full '>
        {/* Upload File */}
        <div className="bg-secondaryColor p-3 flex flex-0.8">
          <div className=" flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420">
            {loading && <Spinner />}
            {wrongImageType && <p>It's wrong file type</p>}
            {!imageAsset ? (
              <label className='cursor-pointer'>
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="flex flex-col justify-center items-center">
                    <p className="font-bold text-2xl">
                      <AiOutlineCloudUpload />
                    </p>
                    <p className="text-lg">Click to upload</p>
                  </div>

                  <div className="mt-10 text-gray-400 text-center">
                    <p>Recommendation:</p>
                    <p>Use high-quality JPG, JPEG, SVG, PNG, GIF or TIFF less than 20MB</p>
                  </div>
                </div>
                <input
                  type="file"
                  name="upload-image"
                  onChange={uploadImage}
                  className="w-0 h-0"
                />
              </label>
            ) : (
              <div className="relative max-h-370">
                <img
                  src={imageAsset?.url}
                  alt="uploaded-pic"
                  className="h-full w-full"
                />
                <button
                  type="button"
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-250 ease-in-out opacity-50 hover:opacity-100"
                  onClick={() => setImageAsset(null)}
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Pin Form */}
        <div className='flex flex-1 flex-col gap-6 lg:pl-6 w-full mt-5'>
          <input
            type="text"
            className='border-b-2 border-neutral-300 w-full text-2xl font-semibold outline-none p-2'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Add a title'
          />
          {userData && (
            <div className='flex items-center'>
              <img src={userData.image} alt="user-pic" className='w-11 h-11 rounded-full' />
              <p className='pl-4 font-semibold'>{userData.userName}</p>
            </div>
          )}
          <input
            type="text"
            className='border-b-2 border-neutral-300 w-full font-medium outline-none p-2'
            placeholder='Tell everyone what your Pin is about'
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />
          <div className='flex items-center '>
            <BiLinkAlt fontSize={25} className="text-neutral-400" />
            <input
              type="text"
              className='border-b-2 border-neutral-300 w-full font-medium outline-none p-2'
              placeholder='Add a destination link'
              value={destination}
              onChange={(e) => setDestination((e.target.value).trim())}
              spellCheck="false"
            />
          </div>
          <div className='flex flex-col'>
            <div>
              <p className='text-xl font-semibold'>Choose Pin Category</p>
              <select
                onChange={(e) => setCategory(e.target.value)}
                className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
              >
                <option value="others" className="sm:text-bg bg-white">Select Category</option>
                {categories.map((category) => (
                  <option
                    key={category.name}
                    value={category.name}

                  >{category.name}</option>
                ))

                }
              </select>
            </div>
            {fields && 
              <p className='text-red-500 font-bold text-left text-lg mt-6'>Please add all fields</p>
            }
            <div className="flex justify-end items-end mt-5">
              <button
                type="button"
                onClick={savePin}
                className="bg-red-600 hover:bg-red-700 text-white font-bold p-2 rounded-full w-28 outline-none"
              >
                Save Pin
              </button>
            </div>
            
          </div>
        </div>
      </div>

    </div>
  )
}

export default CreatePin