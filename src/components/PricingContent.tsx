import React from 'react';
import Image from 'next/image';
import Taxes from '../../public/taxes.jpg';

export default function HomeContent() {
  return (
    <div className='flex flex-col py-6 px-4 md:flex-row md:py-12 md:px-12'>
      <div className='md:w-1/4'>
        <Image src={Taxes} alt='/' height={250} width={250} className='hidden md:block' />
      </div>
      <div className='mt-4 md:mt-0 md:w-3/4 md:pl-6'>
        <div className='mb-4'>
          <h3 className='font-bold text-xl md:text-2xl'>Are you looking for a new tax professional?</h3>
          <p className='mt-2 text-sm md:text-base'>Mojave Tax Services can prepare and electronically file 2022 Federal tax returns as well as prior year returns. We can also assist taxpayers who lived or worked outside of Nevada for part of the year and need to electronically file a state income tax return.</p>
        </div>

        <div className='mb-4'>
          <p className='text-sm md:text-base'>We invite you to explore our service offerings and pricing by clicking the Services and Pricing links above. You may also meet your tax preparer by clicking the About Us link.</p>
        </div>
      </div>
    </div>
  );
}

