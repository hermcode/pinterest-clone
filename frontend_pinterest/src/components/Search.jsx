import React, { useState, useEffect } from 'react'

import MasonryLayout from './MasonryLayout';
import { client } from '../client';
import { feedQuery, searchQuery } from '../utils/data';
import Spinner from './Spinner';

const Search = ({ searchTerm }) => {

  /** States ======================================= */

  const [pins, setPins] = useState()
  const [loading, setLoading] = useState(false)

  /** Functions ======================================= */

  useEffect(() => {
    if(searchTerm !== '') {
      setLoading(true)
      const query = searchQuery(searchTerm.toLowerCase())
      client.fetch(query)
        .then((data) => {
          setPins(data)
          setLoading(false)
        })
      } else {
        setLoading(true)
        client.fetch(feedQuery)
        .then((data) => {
          setPins(data)
          setLoading(false)
        })
    }
  }, [searchTerm])

  return (
    <div>
      { loading && <Spinner message='Searching Pins...' />}
      { pins?.length !== 0 && <MasonryLayout pins={pins} /> }
      { pins?.length === 0 && searchTerm !== '' && !loading && (
        <p className="flex justify-center font-bold items-center w-full text-2xl mt-2">
          No Pins Found!
        </p>
      )}
    </div>
  )
}

export default Search