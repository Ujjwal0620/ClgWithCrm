import React, { useState, useEffect } from 'react'
import HeroBanner from '../components/HomeComponents/HeroBanner'
import Advertisment from '../components/HomeComponents/Advertisment'
import TopCities from '../components/HomeComponents/CollegeFinder'
import CollegeFinder from '../components/HomeComponents/CollegeFinder'
import ExamsPage from './ExamsPage'
import SignupPopup from '../components/SignupPopup'

const HomePage = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Check if popup has been shown in this session
    const popupShown = sessionStorage.getItem('popupShown');
    
    if (!popupShown) {
      // Show popup after a short delay for better user experience
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
    // Mark popup as shown for this session
    sessionStorage.setItem('popupShown', 'true');
  };

  return (
    <div>
      <HeroBanner/>
      <Advertisment/>
      <CollegeFinder/>
      <ExamsPage />
      
      {showPopup && <SignupPopup onClose={handleClosePopup} />}
    </div>
  )
}

export default HomePage
