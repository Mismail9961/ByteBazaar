import React from 'react'
import { useAppContext } from '@/context/AppContext'

const Navbar = () => {
  const { router } = useAppContext()

  return (
    <div className="flex items-center px-4 md:px-8 py-3 justify-between border-b">
      <h1
        onClick={() => router.push('/')}
        className="text-xl lg:text-2xl font-bold text-[#5C66F0] cursor-pointer"
      >
        ByteBazaar
      </h1>
      <button className="bg-[#5C66F0] text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm">
        Logout
      </button>
    </div>
  )
}

export default Navbar
