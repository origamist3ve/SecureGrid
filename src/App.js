import './App.css';
import LandingPage from './Pages/LandingPage';
import VendorRegistrationPage from './Pages/VendorRegistrationPage';
import GetStartedPage from './Pages/GetStartedPage';
import RegistrationPage from './Pages/Registration';
import VendorSearch from "./Pages/VendorSearchPage";
import FormPage from "./Pages/FormPage";
import {BrowserRouter, Routes, Route, Link, Router} from 'react-router-dom';
import theme from './theme.js';
import {ThemeProvider} from "@mui/styles";
import LoginPage from "./Pages/LoginPage";
import Dashboard from "./Pages/DashboardPage"
import VendorProfile from "./Pages/VendorProfilePage";
//Added authentication
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Config/firebase";
import React, { useEffect, useState } from "react";



function App() {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe(); // Cleanup the listener on unmount
    }, []);

    if (loading) {
        return <h2>Loading...</h2>;
    }


  return (
      <ThemeProvider theme={theme}>
          <BrowserRouter>
              <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/vendor-registration/:userId" element={<VendorRegistrationPage />} />
                  <Route path= "/get-started" element={<GetStartedPage />} />
                  <Route path= "/register" element={<RegistrationPage />} />
                  <Route path = "/login" element={<LoginPage />} />
                  <Route path = "/vendor-search" element={<VendorSearch />} />
                  <Route path = "/dashboard" element={<Dashboard/>} />
                  <Route path = "/form" element={<FormPage/>} />
                  <Route path="/vendor-profile/:vendorId" element={<VendorProfile />} />


              </Routes>
          </BrowserRouter>
      </ThemeProvider>
  );
}

export default App;