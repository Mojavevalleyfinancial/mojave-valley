
'use client'
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MdMenu } from 'react-icons/md';
import Desk from '../../public/deskHome.jpg'; // Make sure the image path is correct
import Logo from '../../public/mvfslogo.svg'

export default function Header() {
  const [animationVisible, setAnimationVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prevState => !prevState);
  }, []);

  useEffect(() => {
    // Trigger animation visibility after a short delay (adjust the delay as needed)
    const animationTimeout = setTimeout(() => {
      setAnimationVisible(true);
    }, 300);

    return () => {
      clearTimeout(animationTimeout);
    };
  }, []);

  return (
    <header className='relative bg-transparent text-white w-full overflow-hidden'>
      {/* Navigation */}
      <nav className='bg-transparent text-white w-full flex flex-col md:flex-row items-center py-3 px-4 md:px-6 lg:px-10 absolute z-10'>
        <div className='flex items-center justify-between w-full md:w-auto'>
          <Link href={"/"}>
            <Image src={Logo} alt='/' className='h-12 w-24 md:h-14 md:w-28' />
          </Link>
          <div className='md:hidden'>
            {/* Mobile menu button */}
            <MdMenu
              className='text-3xl cursor-pointer'
              onClick={toggleMobileMenu}
            />
          </div>
        </div>
        <div
          className={`${mobileMenuOpen ? 'flex' : 'hidden md:flex'} md:flex-row justify-end w-full mt-0 md:mt-4 mb-4`}
        >
          {/* Mobile menu */}
          <ul className={`${mobileMenuOpen ? 'flex flex-row' : 'hidden md:flex'} justify-center md:justify-end w-full md:mt-0 mt-4 mb-4 space-x-2 md:space-x-4 md:items-center`}>
            <li className='md:mb-0 hover:text-blue-500 transition-all duration-400 ease-in-out'>
              <Link href={'/'}>Home</Link>
            </li>
            <li className='md:mb-0 hover:text-blue-500 transition-all duration-400 ease-in-out'>
              <Link href={'/services'}>Services</Link>
            </li>
            <li className='md:mb-0  hover:text-blue-500 transition-all duration-400 ease-in-out'>
              <Link href={'/pricing'}>Pricing</Link>
            </li>
            <li className='md:mb-0 hover:text-blue-500 transition-all duration-400 ease-in-out'>
              <Link href={'/document-portal'}>Upload Docs</Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero section */}
      <div className='relative h-1/4 lg:h-1/2 overflow-hidden'>
        {/* Image placed at the top */}
        <Image src={Desk} alt='/' className='w-full md:h-auto' />
        {/* Text centered on the image */}
        <div className={`hidden md:absolute inset-0 md:flex flex-col justify-center items-center text-white z-0 ${animationVisible ? 'fade-in-from-bottom centered-text' : ''}`}>
          <sub className='pb-2 text-sm lg:text-base'>NEED A NEW TAX PROFESSIONAL?</sub>
          <div className='border border-b-white w-1/3 lg:w-1/6 my-4'></div>
          <h1 className='text-xl md:text-3xl lg:text-4xl font-bold'>
            Mojave Valley
          </h1>
          <h1 className='text-lg md:text-2xl lg:text-4xl font-bold'>
            Financial Services
          </h1>
        </div>
      </div>
    </header>
  );
}

