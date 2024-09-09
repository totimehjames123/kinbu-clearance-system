import React, { useState } from 'react'
import ProfileModal from './ProfileModal'
import { Bars3BottomLeftIcon, Bars3BottomRightIcon } from '@heroicons/react/24/outline'

const Header = ({profilePicture, onToggleDrawer, title}) => {

  const [isModalOpen, setModalOpen] = useState(false)
  const [isToggleMenuIcon, setIsMenuToggleIcon] = useState(false)

  const handleSideBarSide = () => {
    onToggleDrawer()
    setIsMenuToggleIcon(!isToggleMenuIcon)
  }

  return (
    <nav className={`flex justify-between p-3 h-auto items-center`}>
      <div className='flex items-center gap-3'>
      {isModalOpen && <ProfileModal closeModal={() => setModalOpen(false)}/>}
        {isToggleMenuIcon ?
          <Bars3BottomRightIcon className={'w-10 h-10 p-2 rounded-full bg-gray-100 hover:opacity-50 transition-all duration-500'} onClick={handleSideBarSide}/> :
          <Bars3BottomLeftIcon className={'w-10 h-10 p-2 rounded-full bg-gray-100 hover:opacity-50 transition-all duration-500'} onClick={handleSideBarSide}/>
        }
        <h3 className='text-2xl text-gray-800'>{title}</h3>
        </div>
        <div className='flex items-center'>
          <img onClick={() => setModalOpen(true)} alt='profilepicture' className='rounded-full w-10 h-10 lg:mr-5 border' src={profilePicture} width={200} height={200}/>
        </div>
    </nav>
  )
}

export default Header
