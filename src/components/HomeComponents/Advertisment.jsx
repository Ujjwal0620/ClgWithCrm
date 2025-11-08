import React from 'react';

const ads = [
  {
    id: 1,
    name: "Amity University",
    description: "Explore top courses and campus facilities at Amity University.",
    image: "https://d13loartjoc1yn.cloudfront.net/upload/institute/images/large/1752497596Amity%20University%20Noida%20campus.webp",
    link: "https://www.amity.edu/",
  },
 
];

const Advertisment = () => {
  return (
   <div className='py-1 px-4  m-3 md:ml-24 md:mr-24'>
    <h1 className='ml-5 font-bold'>sponsored</h1>
     <div className="space-y-4 px-2 py-2 bg-gray-50 ">
      {ads.map((ad) => (
        <a
          key={ad.id}
          href={ad.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col md:flex-row items-center bg-gradient-to-r from-[rgb(51,51,51)] via-[#1c1c1c] to-[rgb(5,0,56)] rounded-xl overflow-hidden shadow-lg  transition-transform duration-300"
        >
          <img
            src={ad.image}
            alt={ad.name}
            className="w-full md:w-1/3 h-48 object-cover"
          />
          <div className="p-4 md:p-6 text-white md:w-2/3 flex flex-col justify-center">
            <h3 className="text-xl font-bold mb-2">{ad.name}</h3>
            <p className="mb-4 text-sm">{ad.description}</p>
            <button className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded hover:bg-yellow-500 w-max">
              Visit Now
            </button>
          </div>
        </a>
      ))}
    </div>
   </div>
  );
};

export default Advertisment;
