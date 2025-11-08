import React from 'react'
import {Routes, Route} from 'react-router-dom' 
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import Login from './components/Login'
import Signup from './components/Signup'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import CollegeDetail from './pages/CollegeDetail'
import ExamsPage from './pages/ExamsPage'
import ExamDetailPage from './pages/ExamDetailPage'
import SignupPopup from './components/SignupPopup'
import ManagementPage from './pages/ManagementPage'
import EngineeringPage from './pages/EngineeringPage'
import MedicalPage from './pages/MedicalPage'
import AllCollegePage from './pages/AllCollegePage'

const App = () => {
  return (
    <div>
      <NavBar/>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path='/colleges/:id' element={<CollegeDetail/>}/>
          <Route path="/exams" element={<ExamsPage />} />
        <Route path="/exams/:slug" element={<ExamDetailPage />} />
        <Route path='/signuppop' element={<SignupPopup/>}/>
        <Route path='/management' element={<ManagementPage/>} />
        <Route path='/engineering' element={<EngineeringPage/>} />
        <Route path='/medical' element={<MedicalPage/>} />
        <Route path='/more' element={<AllCollegePage/>} />
      </Routes>
      <Footer/>
    </div>
  )
}

export default App
