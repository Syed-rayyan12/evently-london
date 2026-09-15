import React from 'react'
import Image from "next/image";
const TRUST_ITEMS = [
  {
    icon: "/images/ic-1.png",
    title: "Curated With Care",
    description: "We handpick vendors who truly care.",
  },
  {
    icon: "/images/ic-2.png",
    title: "Built For Every Faith",
    description: "We welcome every culture and tradition.",
  },
  {
    icon: "/images/ic-3.png",
    title: "Luxury Made Simple",
    description: "Elegance without any unnecessary stress.",
  },
  {
    icon: "/images/ic-4.png",
    title: "Personal Support",
    description: "Real people helping you every step.",
  },
];
const Trust = () => {
  return (
    <div className='bg-[#F9F8F4]'>
    <div className='max-w-[87%] mx-auto'>
       <div className=" grid grid-cols-1 gap-8  border-neutral-200 pb-18 pt-18 sm:grid-cols-2 lg:grid-cols-4">
                {TRUST_ITEMS.map(({ icon, title, description }) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className="flex h-[60px] w-[60px] flex-none items-center justify-center">
                      <Image
                        src={icon}
                        alt=""
                        width={60}
                        height={60}
                        className="h-[60px] w-[60px] object-contain"
                        unoptimized
                      />
                    </div>
                    <div>
                      <h3 className="text-[16px] font-inter font-normal text-black">
                        {title}
                      </h3>
                      <p className="mt-1 text-[14px] leading-relaxed text-neutral-500">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
    </div>
    </div>
  )
}

export default Trust
