
// Hero Component
import React from 'react';
import Image from 'next/image';
import Desk from '../../public/deskHome.jpg';
import Header from './Header'; // Import your Header component

export default function Hero() {
  return (
    <div className='relative h-screen overflow-hidden'>
      {/* Image placed at the top */}
      <Image src={Desk} alt='/' layout='fill' objectFit='cover' />

      {/* Other content placed above the image */}
      <div className='relative z-20 flex flex-col justify-center items-center h-1/6'>
        {/* Place your content here */}
      </div>

      {/* Text centered on the image */}
      <div className='absolute inset-0 flex flex-col justify-center items-center text-white z-0'>
        <sub className='pb-2'>NEED A NEW TAX PROFESSIONAL?</sub>
        <div className='border border-b-white w-1/6 my-4'></div>
        <h1 className='text-2xl md:text-6xl font-bold'>
          Mojave Valley
        </h1>
        <h1 className='text-2xl md:text-6xl font-bold'>
          Financial Services
        </h1>
      </div>
    </div>
  );
}

