import React, { useEffect } from 'react';
import { UserProvider, useUser } from './UserContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import HospitalPortal from './pages/HospitalPortal';
import Information from './pages/Information';
import RegisterPage from './pages/RegisterPage';
import AboutusPage from './pages/AboutusPage';
import LoginPage from './pages/LoginPage';
import UploadInfoPage from './pages/UploadInfoPage';
import HospitalStatisticPage from './pages/HospitalStatisticPage';
import EventPage from './pages/EventPage';
import VaccinationPage from './pages/VaccinationPage';
import ScreeningPage from './pages/ScreeningPage';
import FAQ from './components/FAQ';



// Wrapper to restore user context from localStorage
function AppWrapper() {
  const { login } = useUser();

  useEffect(() => {
    // Check if token & user info exist in localStorage
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (token && user) {
      // Restore user context so avatar & login state persist
      login(user);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/vaccination-page" element= {<VaccinationPage/>} />
        <Route path="/event-page" element= {<EventPage/>} />
        <Route path="/" element={<HomePage />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/about-us-page" element={<AboutusPage />} />
        <Route path="/information" element={<Information />} />
        <Route path="/information/:id" element={<Information />} />
        <Route path="/hospital/:hospitalId" element={<HospitalStatisticPage />} />
        <Route path="/login-page" element={<LoginPage />} />
        <Route path="/register-page" element={<RegisterPage />} />
        <Route path="/screening-page" element={<ScreeningPage/>} />
        <Route path="/hospital-portal" element={<HospitalPortal />} />
        <Route path="/hi" element={<UploadInfoPage />} />
        <Route path="/hospital-statistic-page" element={<HospitalStatisticPage/>} />

        
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <UserProvider>
      <AppWrapper />
    </UserProvider>
  );
}

export default App;

















{/*import { UserProvider } from './UserContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import  HomePage from './pages/HomePage';
import  HospitalPortal  from './pages/HospitalPortal';
import Information from './pages/Information';
import RegisterPage from './pages/RegisterPage';
import AboutusPage from './pages/AboutusPage';
import LoginPage from './pages/LoginPage';
import UploadInfoPage  from './pages/UploadInfoPage';


function App() {



  return (
    <UserProvider>
     <Router>
      <Routes>
        <Route path = "/" element ={ <HomePage/>} />
        <Route path = "/homepage" element ={ <HomePage/>} />
        <Route path = "/about-us-page" element = {<AboutusPage/>} />
        <Route path = "/information" element = {<Information/>} />
        <Route path="/information/:id" element={<Information />} />
        <Route path = "/login-page" element = {<LoginPage/>} />
        <Route path = "/register-page" element = {<RegisterPage/>} />
        <Route path = "/hospital-portal" element = {<HospitalPortal/>} />
        <Route path = "/hi" element = {< UploadInfoPage/>} />


      </Routes>
     </Router> 
     </UserProvider>
     
  );
}

export default App; 
*/}