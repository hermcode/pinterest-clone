import React from 'react'
import  Masonry from 'react-masonry-css'
import Pin from './Pin'

const breakpointColumnsObj = {
  default: 4,
  3000: 6,
  2000: 5,
  1500: 4,
  1300: 3,
  750: 2,
  500: 1,
};

const MasonryLayout = ({ pins }) => (
  <Masonry className="flex animate-slide-fwd" breakpointCols={breakpointColumnsObj}>
    {pins?.map((pin) => <Pin key={pin._id} pin={pin} className="w-max" />)}
  </Masonry>
);

export default MasonryLayout