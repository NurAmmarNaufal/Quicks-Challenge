import React from 'react'

import loop from "../assets/miniIcon/loop.png"

const Navbar = () => {
  return (
    <div className='bg-primary_light_gray py-3'>
    <img src={loop} alt="loop" width={18} className='ml-3' />
    </div>
  )
}

export default Navbar